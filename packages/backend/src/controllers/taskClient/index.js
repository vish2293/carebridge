const { taskClient, request, visit, user, taskClientHistoryModel } = require("../../models");
const taskClientDueDateHistory = require("../../models/taskClientHistory");
const taskClientHistory = require("../../models/taskClientHistory");
const taskClientStatusHistory = require("../../models/taskClientHistory");
const { InternalServerError } = require("../../utils/errorHandling");
const { trimStrings } = require("../../utils/trimSpace");
const { addActivityRequest } = require("../activityRequest");
const { isValidObjectId, default: mongoose } = require('mongoose');

const assignTask = async (req, res) => {
    try {
        let userId = req.userId;
        const task = req.body.task;
        const requestId = req.body.requestId;
        const taskAdd = await taskClient.insertMany(task)
        const updatedRequest = await request.findByIdAndUpdate(requestId, { is_task_assing: true }, { new: true })

        if (taskAdd) {
            await addActivityRequest({ body: { userId: userId, requestId: requestId, status: "task_assign", other: { count: task.length } } });
            return res.status(200).json({
                data: { taskAdd, updatedRequest },
                status: true,
                message: "Task assign successfully"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const editTask = async (req, res) => {
    try {
        const task = trimStrings(req.body.task);
        if (task) {
            await taskClient.insertMany(task);
        }

        const deleteTask = trimStrings(req.body.deleteTask);
        if (deleteTask) {
            await taskClient.updateMany({ _id: { $in: deleteTask } }, { isArchive: true });
        }

        const taskEdit = trimStrings(req.body.editTask);
        let taskUpdated = [];
        if (taskEdit) {
            taskUpdated = await Promise.all(taskEdit.map(async (t) => {
                let taskid = t._id;
                delete t._id;
                let set = {};
                if (t.dueDate) {
                    set["dueDate"] = t.dueDate;
                }
                if (t?.task && t?.task?.task_name) {
                    set["task.task_name"] = t.task.task_name;
                }
                if (t?.task && t?.task?.task_description) {
                    set["task.task_description"] = t.task.task_description;
                }
                let updateData = await taskClient.findOneAndUpdate({ _id: taskid }, { $set: set }, { new: true });
                return updateData;
            }));
        }

        return res.status(200).json({
            data: taskUpdated,
            status: true,
            message: "Task assigned successfully"
        });
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const editSingleTask = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Task ID is required"
            });
        }

        const updateData = await taskClient.findOneAndUpdate(
            { _id: id },
            { $set: { modifiedBy: req.userId, ...req.body } },
            { new: true }
        ).populate('clientId', 'firstName lastName _id');

        if (!updateData) {
            return res.status(404).json({
                status: false,
                message: "Task not found"
            });
        }

        const findVisit = await visit.findOneAndUpdate({ _id: updateData.visitId }, {
            $set: {
                followupDate: req.body.dueDate
            },
        }, { new: true })

        if (req.body.statusReason || req.body.dueDateReason) {
            const statusHistory = new taskClientHistory({
                currentDueDate: req.body.oldDueDate,
                newDueDate: req.body.dueDate,
                dueDateReason: req.body.dueDateReason,
                currentStatus: req.body.oldStatus,
                newStatus: req.body.task.status,
                statusReason: req.body.statusReason,
                taskClientId: req.body.id,
                clientId: updateData.clientId._id,
                modifiedBy: req.userId
            });
            await statusHistory.save();
        }

        return res.status(200).json({
            status: true,
            message: "Task updated successfully",
            data: updateData,
            visitData: findVisit,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const data = await taskClient.findByIdAndUpdate(req.query?.id, { isArchive: true }, { new: true })
        return res.status(200).json({ status: true, message: "Task deleted", data: data })
    } catch (error) {

        console.log(error);
        return InternalServerError(res, error);
    }
}

const getAllTask = async (req, res) => {
    try {
        const userId = req.userId;
        const userRole = req.role;

        const loginUser = await user?.findById(userId);
        const paProgram = loginUser.pa_program;

        const { status, search } = req.body.filter || {};
        const { page, limit } = req.body.pagination || {};

        const query = { isArchive: false };

        if (status) {
            query["task.status"] = status;
        }

        if (userRole === "Program_Administrator" || userRole === "Super_Admin") {
            // No additional filters
        } else if (userRole === "CHW") {
            query.$or = [{ assign_to: userId }];
        }

        if (search) {
            const nameRegex = new RegExp(search, "i");
            const usersMatchingSearch = await user.find({
                $or: [
                    { firstName: nameRegex },
                    { lastName: nameRegex },
                    { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: nameRegex } } }
                ]
            });

            const userIds = usersMatchingSearch.map(user => user._id);
            query.clientId = { $in: userIds };
        }

        const currentDate = new Date();

        let todoData = await taskClient.find(query)
            .populate({ path: "clientId", select: "firstName lastName _id assign_to program" })
            .populate('task.category', '_id name')
            .sort({ createdAt: -1 });

        todoData = todoData.filter(todo => todo.clientId !== null);

        if (loginUser?.role === 'Super_Admin') {
            // Super admin have all access
        } else if (loginUser?.role === "Program_Administrator" && Array.isArray(paProgram)) {
            todoData = todoData.filter(todos =>
                todos.clientId?.program && paProgram.includes(todos.clientId.program)
            );
        } else if (loginUser?.role === "CHW") {
            const paData = await user.findOne({ _id: loginUser.pa_id });
            const programs = paData?.pa_program || [];

            if (Array.isArray(programs)) {
                todoData = todoData.filter(todo =>
                    todo.clientId?.program && programs.includes(todo.clientId.program)
                );

                todoData = todoData.filter(todo =>
                    todo.clientId?.assign_to && todo.clientId.assign_to.toString() === userId.toString()
                );
            }
        }

        await Promise.all(todoData.map(async (task) => {
            if (Array.isArray(task.task.category)) {
                task.task.category = await Promise.all(task.task.category.map(async (category) => {
                    if (mongoose.Types.ObjectId.isValid(category)) {
                        return category;
                    } else {
                        const categoryDoc = await Category.findOne({ name: category });
                        if (categoryDoc) {
                            return categoryDoc._id;
                        } else {
                            throw new Error(`Category with name '${category}' not found.`);
                        }
                    }
                }));
            }

            if (task.task.status === "Pending" || task.task.status === "In-Progress") {
                if (task.dueDate && new Date(task.dueDate) < currentDate) {
                    task.isOverdue = true;
                } else {
                    task.isOverdue = false;
                }
            } else {
                task.isOverdue = false;
            }
            await task.save();
        }));

        if (req.body.pagination) {
            const startIndex = (page - 1) * limit;
            const paginatedArray = todoData.slice(startIndex, startIndex + limit);

            const visitData = await visit.find(query).populate("clientId");

            return res.status(200).json({
                status: true,
                message: "Todo list",
                data: {
                    answerAdd: paginatedArray,
                    totalCount: todoData.length,
                    visitData: visitData
                }
            });
        } else {
            const visitData = await visit.find(query).populate("clientId");

            return res.status(200).json({
                status: true,
                message: "Todo list",
                data: {
                    answerAdd: todoData,
                    totalCount: todoData.length,
                    visitData: visitData
                }
            });
        }
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
}




//FOR visitRequest
const visitTask = async (visitId) => {
    try {
        const taskAdd = await taskClient.findOne({ visitId: visitId });
        return taskAdd;
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};

const getRequestTask = async (req, res) => {
    try {
        const clientId = req.body.clientId;
        const answerAdd = await taskClient.find({ clientId: clientId, isArchive: false });

        if (answerAdd) {
            return res.status(200).json({
                data: answerAdd,
                status: true,
                message: "Get request task"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const getRequestTaskByCHW = async (req, res) => {
    try {
        const reqId = req.userId;
        const startDate = req.body?.startDate ? new Date(req.body?.startDate) : "";
        const endDate = req.body?.endDate ? new Date(req.body?.endDate) : "";


        let query = {};
        let answerAdd = [];

        if (req.role === "Client") {
            query.clientId = reqId;
        } else if (req.role === "CHW") {
            query.chwid = reqId;
        } else if (req.role === "Program_Administrator") {
            query.paid = reqId;
        }

        // Date filter
        if (startDate !== "" && endDate !== "") {
            query.dueDate = { $gte: startDate, $lte: endDate };
        }

        answerAdd = await taskClient.find(query).populate('clientId', 'firstName').sort({ createdAt: -1 });

        const newTodoCount = answerAdd?.filter((v) => v?.status === "Pending")?.length;
        const inProgressTodoCount = answerAdd?.filter((v) => v?.status === "In-Progress")?.length;
        const completedTodoCount = answerAdd?.filter((v) => v?.status === "Completed")?.length;

        if (answerAdd) {
            return res.status(200).json({
                data: { answerAdd, newTodoCount, inProgressTodoCount, completedTodoCount },
                status: true,
                message: "Get request task"
            });
        }
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};


const statusTask = async (req, res) => {
    try {
        const taskClientId = req.body.taskClientId;
        const status = req.body.status;

        let statusUpdate = await taskClient.findOneAndUpdate(
            { _id: taskClientId },
            { status: status },
            { new: true }
        );

        await taskClient.find({
            clientId: statusUpdate.clientId,
            status: { $in: ['Pending', 'In-Progress'] }
        });
        // if (requestData.length === 0) {
        //     await request.findByIdAndUpdate(statusUpdate.requestId, { request_status: 'Completed' });
        // }
        if (statusUpdate) {
            await taskClient.find({
                clientId: statusUpdate.clientId,
                status: { $in: ['Pending', 'In-Progress'] },
            });
            // if (requestData.length === 0) {
            //     await request.findByIdAndUpdate(
            //         statusUpdate.requestId,
            //         { request_status: 'Completed' },
            //         { new: true }
            //     );
            //     await addActivityRequest({ body: { userId: req.userId, requestId: statusUpdate.requestId, status: "completed" } });
            // }
            const response = await taskClient.findById(taskClientId);
            return res.status(200).json({
                data: response,
                status: true,
                message: "Task status changed",
            });
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const getRequestTaskSearch = async (req, res) => {
    try {
        const reqId = req.userId;
        const search = req.query.search;
        let answerAdd = [];
        let searchQuery = {};
        if (req.role === "Client") {
            searchQuery = {
                $and: [
                    { clientId: reqId },
                ],
                $or: [
                    { "task.task_name": { $regex: search || "", $options: "i" } },
                    { "task.task_description": { $regex: search || "", $options: "i" } },
                ],
            };
            answerAdd = await taskClient.find(searchQuery).populate('clientId', 'firstName');
        } else if (req.role === "CHW") {
            searchQuery = {
                $and: [
                    { chwid: reqId },
                ], $or: [
                    { "task.task_name": { $regex: search || "", $options: "i" } },
                    { "task.task_description": { $regex: search || "", $options: "i" } },
                ],
            };
            answerAdd = await taskClient.find(searchQuery).populate('clientId', 'firstName')
        }

        if (answerAdd) {
            return res.status(200).json({
                data: answerAdd,
                status: true,
                message: "Get request task"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const getTaskAndFollowupData = async (req, res) => {
    try {
        const reqId = req.userId;

        let query = {};
        let answerAdd, visitData = [];

        if (req.role === "Client") {
            query.clientId = reqId;
        } else if (req.role === "CHW") {
            query.chwid = reqId;
        } else if (req.role === "Program_Administrator") {
            query.paid = reqId;
        }
        if (req.body.year && req.body.month) {
            const startDate = new Date(req.body.year, req.body.month - 1, 1);
            const endDate = new Date(req.body.year, req.body.month, 0);
            query.dueDate = { $gt: startDate, $lte: endDate };
        }

        answerAdd = await taskClient.find(query).populate('clientId', 'firstName').sort({ createdAt: -1 });
        let visitquery = { isArchive: false };

        visitquery.createdBy = reqId;
        console.log(reqId)
        if (req.body.year && req.body.month) {
            const startDate = new Date(req.body.year, req.body.month - 1, 1);
            const endDate = new Date(req.body.year, req.body.month, 0);
            query.followupDate = { $gt: startDate, $lte: endDate };
        }
        visitData = await visit.find(visitquery).populate("clientId").sort({ createdAt: -1 });
        if (answerAdd) {
            return res.status(200).json({
                data: { answerAdd, visitData },
                status: true,
                message: "Get request task"
            });
        }
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};

const singleTask = async (req, res) => {
    try {
        const taskId = req.query.id;

        if (!taskId || !isValidObjectId(taskId)) {
            return res.status(400).json({ status: false, message: "Please provide a correct ID" });
        }

        const requestData = await taskClient.findById(taskId).populate("clientId")
        return res.status(200).json({ status: true, message: "Request found", data: requestData })
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const createTodo = async (req, res) => {
    try {
        const createdby = req.userId;
        req.body.createdby = createdby
        const todoData = new taskClient(req.body)
        await todoData.save()
        return res.status(201).json({ status: true, message: "Todo created", data: todoData })

    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
}

const getSingleUserTodo = async (req, res) => {
    try {
        const clientId = req.query?.id;
        if (req.role === "Super_Admin" || req.role === "Program_Administrator") {
            const todoData = await taskClient.find({ clientId: clientId, isArchive: false }).populate({ path: "clientId", select: "id firstName lastName" }).populate('task.category', '_id name').sort({ createdAt: -1 });
            return res.status(200).json({ status: true, message: "User todo list", data: todoData });
        } else {
            const todoData = await taskClient.find({ clientId: clientId, createdby: req.userId, isArchive: false }).populate({ path: "clientId", select: "id firstName lastName" }).sort({ createdAt: -1 });
            return res.status(200).json({ status: true, message: "User todo list", data: todoData });
        }
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};

module.exports = {
    createTodo,
    getSingleUserTodo,
    assignTask,
    editTask,
    getRequestTask,
    getRequestTaskByCHW,
    statusTask,
    getRequestTaskSearch,
    getTaskAndFollowupData,
    editSingleTask,
    getAllTask,
    deleteTask,
    singleTask,
    visitTask
}