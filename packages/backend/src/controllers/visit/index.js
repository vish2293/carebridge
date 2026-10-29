const { multipleRequest, visitRequest } = require("../request");
const { visit, user, request, taskClient, visitHistory, todos, clientGoalHistoryModel, clientStatusHistoryModel, actionStepHistoryModel } = require("../../models");
const { UnauthorizedError, InternalServerError, NotFoundError, NotAccessError } = require("../../utils/errorHandling");
const { visitTask } = require("../taskClient");
const { isValidObjectId, default: mongoose } = require('mongoose');
const requestStatusHistory = require("../../models/requestHistory");
const taskClientHistory = require("../../models/taskClientHistory");
const needOrCategoryModel = require("../../models/needOrCategory");
const actionPathwayModel = require("../../models/actionStepPathway");

//FOR CREATE visit
const createVisit = async (req, res) => {
    try {
        const createdBy = req.userId;
        req.body.visit.createdBy = createdBy;

        const findUser = await user.findById(req.body.visit.clientId).populate('assign_to')
        if (findUser.ischw_Assign === false) {
            return res.status(201).json({
                status: false,
                message: "You cannot create a visit without assigning CHW to the user"
            })
        }

        const checkVisitExistsOrNot = await visit.find({ clientId: req.body.visit.clientId })

        if (checkVisitExistsOrNot.length === 0) {
            const userStatusData = new clientStatusHistoryModel({
                clientId: req.body.visit.clientId,
                newstatus: "Open",
                oldStatus: "Pending",
            })
            await userStatusData.save()
        }

        const visitData = new visit(req.body.visit)
        await visitData.save();

        const clientGoalHistory = new clientGoalHistoryModel({
            visitId: visitData._id,
            clientId: visitData.clientId,
            from_client_goal: findUser.client_goal || "",
            to_client_goal: req.body.visit.client_goal,
            modifiedBy: req.userId
        })
        await clientGoalHistory.save()
        await user.findOneAndUpdate({ _id: req.body.visit.clientId }, { $set: { status: "Open", client_goal: req.body.visit.client_goal } }, { new: true })

        let requestData = [];
        const createdvisit = await visit.findById(visitData?._id).populate('createdBy').populate('clientId').populate('assign_to')

        if (Array.isArray(req.body.request) && req.body.request.length > 0) {
            for (const requestDatas of req.body.request) {
                if (requestDatas.request_id) {
                    requestData = await request.findOneAndUpdate(
                        { _id: requestDatas.request_id },
                        { $set: requestDatas },
                        { new: true, lean: true }
                    );
                } else {
                    let payload = {
                        ...requestDatas,
                        visitId: visitData._id,
                        assigned_chw: visitData.assign_to,
                        createdby: createdBy,
                    }
                    requestData = await multipleRequest(payload);

                    if (requestData && requestData.length > 0) {
                        for (const request of requestData) {
                            const requestId = request._id;

                            const existingActionPathway = await actionPathwayModel.findOne({
                                pathwayId: request.pathway,
                                userId: request.request_by,
                            });

                            if (existingActionPathway) {
                                await actionPathwayModel.findOneAndUpdate(
                                    { _id: existingActionPathway._id },
                                    { $addToSet: { requestId: requestId } },
                                    { new: true }
                                );
                            } else {
                                const newActionPathway = {
                                    pathwayId: request.pathway,
                                    userId: request.request_by,
                                    status: "Open",
                                    requestId: [requestId],
                                };

                                await actionPathwayModel.create(newActionPathway);
                            }
                        }
                    }
                }

            }
        }

        const { task_name, task_description, dueDate, status, category, clientId } = req.body.task
        const taskData = new taskClient({
            clientId: clientId,
            assign_to: req.body.visit.assign_to,
            visitId: visitData._id,
            task: {
                category: category,
                task_name: task_name,
                task_description: task_description,
                status: status,
            },
            dueDate: dueDate,
            createdby: req.userId
        })
        await taskData.save()

        const visitHistoryData = new visitHistory({
            clientId: req.body.visit.clientId,
            visitId: visitData._id,
            visitType: req.body.visit.visitType,
            visitDate: req.body.visit.visitDate,
            lengthOfVisit: req.body.visit.lengthOfvisit + " " + req.body.visit.lengthOfvisitUnit,
            clientStory: req.body.visit.clientStory,
            clientGoal: req.body.visit.client_goal,
            primaryNeed: req.body.visit.primaryNeed,
            pathway: req.body.visit.pathway,
            otherNeed: req.body.visit.otherNeed,
            followUpdate: req.body.task.dueDate,
            followUpReason: req.body.task.task_name,
            createdBy: req.userId
        })
        await visitHistoryData.save()

        const findUserOfData = await user.findOneAndUpdate({ _id: req.body.visit.clientId }, { $set: { status: "Open" } }, { new: true }).populate('assign_to').populate('profileQuestion.question')
        return res.status(200).json({ status: true, message: "New visit created", data: { requestData, requestCount: requestData.length, createdvisit, taskData, findUserOfData } })
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error);
    }
}

//FOR GET ALL visit
const getAllVisit = async (req, res) => {
    try {
        const userId = req.userId;
        const search = req.body.search;
        let visitLists = [];
        let query = {};
        const { page, limit } = req.body.pagination;

        const validUser = await user.findById(userId);
        if (!validUser || !validUser.role) {
            return NotAccessError(res, "Invalid user or role");
        }

        if (validUser.role === "Super_Admin") {
            // No need to modify the query
        } else if (validUser.role === "Program_Administrator") {
            query.role = { $nin: ["Super_Admin", "Program_Administrator", "CHW"] };
        } else if (validUser.role === "CHW") {
            query.assign_to = userId;
        } else {
            return NotAccessError(res, "You don't have access");
        }
        query.isArchive = false;

        if (search) {
            const nameRegex = new RegExp(search, "i"); // Case-insensitive match

            const usersMatchingSearch = await user.find({
                $or: [
                    { firstName: nameRegex },
                    { lastName: nameRegex },
                    { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: nameRegex } } }
                ]
            });

            const userIds = usersMatchingSearch.map(user => user._id)

            query.clientId = { $in: userIds };
        }

        visitLists = await visit.find(query).populate({
            path: "clientId",
            select: "firstName lastName _id program assign_to"
        }).populate({
            path: "primaryNeed",
            select: "name"
        }).populate({
            path: "pathway",
            select: "name"
        }).sort({ createdAt: -1 });

        visitLists = visitLists.filter((visit) => visit.clientId !== null);


        if (validUser?.role === 'Super_Admin') {
            // Super admin have all the access
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser?.pa_program)) {
            visitLists = visitLists.filter(visits =>
                visits.clientId?.program && (validUser.pa_program).includes(visits.clientId.program)
            );
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id })
            const programs = paData.pa_program

            if (Array.isArray(programs)) {
                visitLists = visitLists.filter(visits =>
                    visits.clientId?.program && programs.includes(visits.clientId.program)
                );

                visitLists = visitLists.filter(visits =>
                    visits.clientId.assign_to && visits.clientId.assign_to.toString() === userId.toString()
                );
            }
        }

        const startIndex = (page - 1) * limit;
        const paginatedArray = visitLists.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            status: true,
            message: "List of all visits",
            data: paginatedArray,
            totalCount: visitLists.length
        });
    } catch (error) {
        console.log("error", error);
        return InternalServerError(res, error);
    }
};

//FOR SINGLE visit
const getSingleVisit = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return UnauthorizedError(res, 'User');
        }

        const visitId = req.query?.id;

        // Check if the visitId is a valid ObjectId
        if (!visitId || !isValidObjectId(visitId)) {
            return res.status(400).json({ status: false, message: "Please provide a correct ID" });
        }

        const visitData = await visit.findOne({ _id: visitId })
            .populate({
                path: 'createdBy modifiedBy',
                select: 'firstName lastName'
            })
            .populate('primaryNeed', '_id name')
            .populate('pathway', 'name _id')

        if (!visitData) {
            return res.status(404).json({ status: false, message: "Visit not found" });
        }

        const requestData = await visitRequest(visitId, req.userId, req.role, visitData?.clientId);
        const taskData = await visitTask(visitId);

        return res.status(200).json({ status: true, message: "Visit found", data: { visitData, requestData, taskData } });
    } catch (error) {
        console.error(error);
        return InternalServerError(res, error);
    }
}

// FOR GET USER VISIT LIST
const getUserVisitList = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return UnauthorizedError(res, 'User')
        }
        const visitId = req.query.id;

        if (!visitId || !isValidObjectId(visitId)) {
            return res.status(400).json({ status: false, message: "Please provide a correct ID" });
        }

        if (req.role === "Super_Admin" || req.role === "Program_Administrator") {
            const visitData = await visit.find({ clientId: visitId, isArchive: false }).populate("clientId").
                populate("createdBy", "id firstName lastName").
                populate("modifiedBy", "id firstName lastName").
                sort({ createdAt: -1 });
            const taskData = await taskClient.find({ visitId: visitId, isArchive: false }).populate("visitId")
            return res.status(200).json({ status: true, message: "User visit lists", data: { visitData, taskData } })
        } else {
            const visitData = await visit.find({ clientId: visitId, assign_to: req.userId, isArchive: false }).populate("clientId").
                populate("createdBy", "id firstName lastName").
                populate("modifiedBy", "id firstName lastName").
                sort({ createdAt: -1 });
            const taskData = await taskClient.find({ visitId: visitId, isArchive: false }).populate("visitId")
            return res.status(200).json({ status: true, message: "User visit lists", data: { visitData, taskData } })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error);
    }
}

//FOR UPDATE visit
const updateVisit = async (req, res) => {
    try {
        const userId = req.userId;
        const visitId = req.query?.id;

        if (!userId) {
            return UnauthorizedError(res, "user");
        }

        if (!visitId) {
            return NotFoundError(res, "visit");
        }

        let updatedRequests = [];
        let taskData = null;

        try {
            const findUser = await user.findById(req.body.visit.clientId)
            const updatedVisitData = await visit.findByIdAndUpdate(visitId, { $set: { ...req.body.visit, modifiedBy: req.userId } }, { new: true })
                .populate({
                    path: 'createdBy',
                    select: 'firstName lastName'
                })
                .populate({
                    path: 'modifiedBy',
                    select: 'firstName lastName'
                }).populate('primaryNeed', '_id name').populate('pathway', 'name _id')

            if (findUser.client_goal !== req.body.visit.client_goal) {
                const clientGoalHistory = new clientGoalHistoryModel({
                    visitId: visitId,
                    clientId: req.body.visit.clientId,
                    from_client_goal: findUser.client_goal,
                    to_client_goal: req.body.visit.client_goal,
                    modifiedBy: req.userId
                })
                await clientGoalHistory.save()
            }

            await user.findOneAndUpdate({ _id: req.body.visit.clientId }, { $set: { client_goal: req.body.visit.client_goal } }, { new: true })

            if (req.body.request && req.body.request.length > 0) {
                updatedRequests = await Promise.all(req.body.request.map(async (r) => {
                    const id = r._id;
                    delete r._id;
                    let updatedRequest = {};
                    const findRequestData = await request.findOne({ _id: id }).lean();

                    const resoruceOfFindRequest = findRequestData?.resources_given || [];
                    const resoruceOfBody = r?.resources_given || [];

                    const final = resoruceOfFindRequest?.filter((item) => {
                        return !resoruceOfBody?.includes(item.toString());
                    });

                    r?.notWorkedResoruces?.push(...final);

                    if (id) {
                        updatedRequest = await request.findByIdAndUpdate(
                            id,
                            { $set: r, assigned_chw: req.body.visit.assign_to },
                            { new: true }
                        )
                            .populate("request_by", "firstName lastName _id")
                            .populate("resources_given", "resource_name _id organization")
                            .populate("notWorkedResoruces", "resource_name _id organization")
                            .populate("request_type", "name _id")
                            .populate("pathway", "name _id");

                        if (r.reason) {
                            const statusHistory = new requestStatusHistory({
                                currentStatus: r.oldStatus,
                                newStatus: r.request_status,
                                reason: r.reason,
                                requestId: updatedRequest._id,
                                clientId: req.body.visit.clientId,
                                modifiedBy: req.userId
                            });
                            await statusHistory.save();
                        }

                        const pathwayEntry = await actionPathwayModel.findOne({
                            pathwayId: r.pathway,
                            userId: r.request_by
                        });

                        if (pathwayEntry) {
                            await actionPathwayModel.findByIdAndUpdate(pathwayEntry._id, {
                                $addToSet: { requestId: updatedRequest._id }
                            }, { new: true });
                        } else {
                            const newPathwayEntry = new actionPathwayModel({
                                pathwayId: r.pathway,
                                userId: r.request_by,
                                status: "Open",
                                requestId: [updatedRequest._id]
                            });
                            await newPathwayEntry.save();
                        }

                        const latestHistory = await actionStepHistoryModel.findOne({ requestId: id }).sort({ createdAt: -1 });

                        const isMatching =
                            latestHistory &&
                            latestHistory.request_by.toString() === r.request_by.toString() &&
                            latestHistory.assign_to.toString() === r.assign_to.toString() &&
                            latestHistory.request_details === r.request_details &&
                            latestHistory.request_status === r.request_status &&
                            latestHistory.resources_given.toString() === r.resources_given.toString() &&
                            latestHistory.request_type === r.request_type &&
                            latestHistory.urgent === r.urgent &&
                            latestHistory.reason === r.reason;

                        if (!isMatching) {
                            const historyData = new actionStepHistoryModel({
                                request_by: r.request_by,
                                assign_to: r.assign_to,
                                requestId: id,
                                request_details: r.request_details,
                                request_status: r.request_status,
                                resources_given: r.resources_given,
                                request_type: r.request_type,
                                pathway: r.pathway,
                                urgent: r.urgent,
                                notWorkedResoruces: final,
                                reason: r.reason,
                                createdBy: latestHistory?.createdBy,
                                modifiedBy: req.userId
                            });
                            await historyData.save();
                        }
                    } else {
                        r.visitId = visitId;
                        r.createdby = userId;
                        r.assign_to = req.body.visit.assign_to;
                        const newRequest = new request(r);
                        updatedRequest = await newRequest.save();

                        if (updatedRequest) {
                            updatedRequest = await request.findById(updatedRequest._id)
                                .populate("resources_given", "resource_name _id organization")
                                .populate("notWorkedResoruces", "resource_name _id organization")
                                .populate("request_type", "name _id")
                                .populate("pathway", "name _id")
                                .exec();
                        }

                        if (r?.reason) {
                            const statusHistory = new requestStatusHistory({
                                currentStatus: r.oldStatus,
                                newStatus: r.request_status,
                                reason: r.reason,
                                requestId: updatedRequest._id,
                                clientId: req.body.visit.clientId,
                                modifiedBy: req.userId
                            });
                            await statusHistory.save();
                        }

                        const pathwayEntry = await actionPathwayModel.findOne({
                            pathwayId: r.pathway,
                            userId: r.request_by,
                        });

                        if (pathwayEntry) {
                            await actionPathwayModel.findByIdAndUpdate(pathwayEntry._id, {
                                $addToSet: { requestId: updatedRequest._id }
                            }, { new: true });
                        } else {
                            const newPathwayEntry = new actionPathwayModel({
                                pathwayId: r.pathway,
                                userId: r.request_by,
                                status: "Open",
                                requestId: [updatedRequest._id]
                            });
                            await newPathwayEntry.save();
                        }

                        const latestHistory = await actionStepHistoryModel.findOne({ requestId: updatedRequest._id }).sort({ createdAt: -1 });

                        const isMatching =
                            latestHistory &&
                            latestHistory.request_by.toString() === r.request_by.toString() &&
                            latestHistory.assign_to.toString() === r.assign_to.toString() &&
                            latestHistory.request_details === r.request_details &&
                            latestHistory.request_status === r.request_status &&
                            latestHistory.resources_given.toString() === r.resources_given.toString() &&
                            latestHistory.request_type === r.request_type &&
                            latestHistory.urgent === r.urgent &&
                            latestHistory.reason === r.reason;

                        if (!isMatching) {
                            const historyData = new actionStepHistoryModel({
                                request_by: r.request_by,
                                assign_to: r.assign_to,
                                requestId: updatedRequest._id,
                                request_details: r.request_details,
                                request_status: r.request_status,
                                pathway: r.pathway,
                                resources_given: r.resources_given,
                                request_type: r.request_type,
                                urgent: r.urgent,
                                notWorkedResoruces: final,
                                reason: r.reason,
                                createdBy: latestHistory?.createdBy,
                                modifiedBy: req.userId
                            });

                            await historyData.save();
                        }
                    }
                    return updatedRequest;
                }));
            }


            const allRequests = await request.find({ visitId });
            const removedRequests = allRequests.filter(req => !updatedRequests.map(ur => ur._id.toString()).includes(req._id.toString()));
            await Promise.all(removedRequests.map(async req => {
                req.isArchive = true;
                await req.save();
            }));

            if (req.body.task) {
                taskData = await taskClient.findOneAndUpdate({ _id: req.body.task.id }, { $set: req.body.task }, { new: true });

                const statusOfTask = await taskClient.findById(req.body.task.id).select('task.status')

                if (req.body.task.dueDateReason) {
                    const statusHistory = new taskClientHistory({
                        currentDueDate: req.body.task.oldDueDate,
                        newDueDate: req.body.task.dueDate,
                        dueDateReason: req.body.task.dueDateReason,
                        currentStatus: statusOfTask.task.status,
                        taskClientId: req.body.task.id,
                        clientId: req.body.visit.clientId,
                        modifiedBy: req.userId
                    });
                    await statusHistory.save();
                }
            }

            const findCreatedBy = await visit.findById(visitId).select('createdBy')

            const visitHistoryData = new visitHistory({
                clientId: req.body.visit.clientId,
                visitId: visitId,
                visitType: req.body.visit.visitType,
                visitDate: req.body.visit.visitDate,
                lengthOfVisit: req.body.visit.lengthOfvisit + " " + req.body.visit.lengthOfvisitUnit,
                clientStory: req.body.visit.clientStory,
                clientGoal: req.body.visit.client_goal,
                primaryNeed: req.body.visit.primaryNeed,
                pathway: req.body.visit.pathway,
                otherNeed: req.body.visit.otherNeed,
                followUpdate: req.body.task.dueDate,
                followUpReason: req.body.task.task.task_name,
                createdBy: findCreatedBy.createdBy,
                modifiedBy: req.userId
            })
            await visitHistoryData.save()

            return res.status(200).json({ status: true, message: "visit updated", data: { updatedVisitData, updatedRequests, taskData } });
        } catch (error) {
            console.log("error", error);
            return InternalServerError(res, error);
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

//FOR DELETE visit
const deleteVisit = async (req, res) => {
    try {
        const userId = req.userId;
        const visitId = req.body.visitId;

        if (!userId) {
            return UnauthorizedError(res, "user")
        }
        if (!visitId) {
            return NotFoundError(res, "visit")
        }
        const deletedvisit = await visit.findOneAndUpdate({ _id: visitId }, { isArchive: true }, { new: true })
        const deleteTodo = await taskClient.findOneAndUpdate({ visitId: visitId }, { isArchive: true }, { new: true })
        const deleteRequest = await request.updateMany({ visitId: visitId }, { isArchive: true }, { new: true })

        return res.status(200).json(
            {
                status: true,
                message: "visit deleted",
                data: {
                    deletedvisit,
                    deleteTodo,
                    deleteRequest
                }
            }
        )
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

//FOR SEARCH visit
const searchVisit = async (req, res) => {
    try {
        const userId = await req.userId;
        const searchParameter = req.query?.search;
        let searchQuery = {}
        if (searchParameter) {
            searchQuery = {
                $or: [
                    { visitType: { $regex: searchParameter, $options: "i" } },
                    { clienStory: { $regex: searchParameter, $options: "i" } },
                    { nextSteps: { $regex: searchParameter, $options: "i" } },
                ],
            };
        }

        searchQuery.isArchive = false;
        if (!userId) {
            return UnauthorizedError(res, 'user')
        }
        const visitData = await visit.find(searchQuery)
        return res.status(200).json({ status: true, message: "visit's found", data: visitData })
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)

    }
}

const multipleDeleteVisit = async (req, res) => {
    try {
        const ids = req.body?.ids

        const deletevisit = await visit.deleteMAny({ _id: { $in: ids } })

        if (deletevisit) {
            return res.status(200).json({
                status: true,
                message: "Selected visit deleted successfully"
            })
        }
    } catch (error) {
        return InternalServerError(res, error)
    }
}

//FOR GET ALL visit
const getAllVisitByType = async (req, res) => {
    try {
        let visitLists = [];
        let query = {};
        query.createdBy = req.userId;
        query.isArchive = false;

        visitLists = await visit.find(query).populate("clientId").sort({ createdAt: -1 });

        return res.status(200).json(
            {
                status: true,
                message: "List of all visit's",
                data: visitLists
            })
    } catch (error) {
        console.log('error', error)
        return InternalServerError(res, error)
    }
}

const assignTodos = async (req, res) => {
    try {
        const todos = await taskClient.find();
        const visits = await visit.find();

        const visitAssignMap = {};
        visits.forEach(visit => {
            visitAssignMap[visit._id.toString()] = visit.assign_to;
        });

        const updatePromises = todos.map(async todo => {
            const assignTo = visitAssignMap[todo.visitId.toString()];
            if (assignTo) {
                return taskClient.findByIdAndUpdate(
                    todo._id,
                    { assign_to: assignTo },
                    { new: true }
                );
            }
        });

        const updatedTodos = await Promise.all(updatePromises);

        return res.status(200).json({
            status: true,
            message: 'Todos updated successfully',
            data: updatedTodos.filter(Boolean)  // Remove undefined values if any
        });
    } catch (error) {
        console.log('error', error);
        return InternalServerError(res, error);
    }
};

const addIdOfCategory = async (req, res) => {
    try {
        const getCategoryName = await needOrCategoryModel.find({}).lean();
        const categoryMap = getCategoryName.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        const getRequests = await request.find({}).lean();
        const requestUpdates = getRequests
            .map(requestItem => {
                const categoryId = categoryMap[requestItem.request_type];
                return {
                    updateOne: {
                        filter: { _id: requestItem._id },
                        update: { $set: { request_type: new mongoose.Types.ObjectId(categoryId) } },
                        new: true
                    }
                };
            })
            .filter(update => update !== null);

        const getTasks = await taskClient.find({}).lean();
        const taskUpdates = getTasks
            .map(taskItem => {
                const taskCategoryNames = taskItem.task.category
                    ? [taskItem.task.category]
                    : [taskItem.task.category];

                const updatedTaskCategory = taskCategoryNames
                    .map(name => categoryMap[name])
                    .filter(id => id);

                if (updatedTaskCategory.length > 0) {
                    return {
                        updateOne: {
                            filter: { _id: taskItem._id },
                            update: { $set: { 'task.category': updatedTaskCategory } },
                            new: true
                        }
                    };
                }
                return null;
            })
            .filter(update => update !== null);

        const getVisits = await visit.find({}).lean();
        const visitUpdates = getVisits
            .map(visitItem => {
                const visitCategoryNames = Array.isArray(visitItem.primaryNeed)
                    ? visitItem.primaryNeed
                    : [visitItem.primaryNeed];

                const updatedVisitCategory = visitCategoryNames
                    .map(name => categoryMap[name])
                    .filter(id => id);

                if (updatedVisitCategory.length > 0) {
                    return {
                        updateOne: {
                            filter: { _id: visitItem._id },
                            update: { $set: { primaryNeed: updatedVisitCategory } },
                            new: true
                        }
                    };
                }
                return null;
            })
            .filter(update => update !== null);

        if (requestUpdates.length > 0) {
            await request.bulkWrite(requestUpdates);
        }

        if (taskUpdates.length > 0) {
            await taskClient.bulkWrite(taskUpdates);
        }

        if (visitUpdates.length > 0) {
            await visit.bulkWrite(visitUpdates);
        }

        return res.status(200).json({ message: 'Categories updated successfully for requests, tasks, and visits!' });
    } catch (error) {
        console.log('error', error);
        return InternalServerError(res, error);
    }
};

module.exports = {
    createVisit,
    getAllVisit,
    getSingleVisit,
    updateVisit,
    deleteVisit,
    getUserVisitList,
    searchVisit,
    multipleDeleteVisit,
    getAllVisitByType,
    assignTodos,
    addIdOfCategory
}