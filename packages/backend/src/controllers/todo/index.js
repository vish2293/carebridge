const { visit, user, todos } = require("../../models");
const { UnauthorizedError, InternalServerError, NotFoundError, NotAccessError } = require("../../utils/errorHandling");

//FOR CREATE TODO
const createTodo = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return UnauthorizedError(res, "User")
        }
        const validUser = await user.findById(userId)

        if (validUser?.role === "Program_Administrator" || validUser?.role === "Super_Admin" || validUser?.role === "CHW") {
            const { requested_by, category, task_description, task_name, dueDate, assign_to } = req.body;
            const todoData = new todos({
                created_by: userId,
                requested_by,
                task_description,
                category,
                assign_to,
                task_name,
                dueDate
            })
            await todoData.save()
            const createdTodo = await todos.findById(todoData?._id).populate('assign_to')
            return res.status(200).json({ status: true, message: "New todo created", data: createdTodo })
        } else {
            return NotAccessError(res, "You don't have an access to create todo")
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)

    }

}

//FOR GET ALL TODO
const getAllTodo = async (req, res) => {
    try {
        const userId = req.userId;
        const loginUser = await user.findById(userId)
        let todoLists = [];
        let query = {}
        if (loginUser?.role === "Program_Administrator") {

        } else if (loginUser?.role === "CHW") {
            query.assign_to = userId


        } else if (loginUser?.role === "Client") {
            query.requested_by = userId
        }
        query.isArchive = false

        todoLists = await todos.find(query).sort({ createdAt: -1 })
        const totalTodoCount = todoLists?.length;
        const newTodoCount = todoLists?.filter((v) => v?.status === "Pending")?.length;
        const inProgressTodoCount = todoLists?.filter((v) => v?.status === "In-Progress")?.length;
        const completedTodoCount = todoLists?.filter((v) => v?.status === "Completed")?.length;

        return res.status(200).json(
            {
                status: true,
                message: "List of all todo's",
                data: {
                    todoLists,
                    totalTodoCount,
                    newTodoCount,
                    inProgressTodoCount,
                    completedTodoCount,
                }
            })
    } catch (error) {
        console.log('error', error)
        return InternalServerError(res, error)
    }

}

//For user todo list
const getllUserTodo = async (req, res) => {
    try {
        const logInUserId = req.userId;
        const userId = req.query?.id;
        const loginUser = await user.findById(logInUserId)
        let query = {}
        if (loginUser?.role === "Program_Administrator") {
            query.$and = [{ created_by: logInUserId }, { requested_by: userId }]
        } else if (loginUser?.role === "CHW") {
            query.$and = [{ assign_to: logInUserId }, { requested_by: userId }]
        }


        let todoLists = await todos.find({ $and: [query] })?.populate("assign_to").sort({ createdAt: -1 })
        return res.status(200).json({ status: true, message: "User todo lists", data: todoLists })


    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error)

    }
}
//FOR SINGLE TODO
const getSingleTodo = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return UnauthorizedError(res, 'User')
        }
        const todoId = req.query?.id;
        const todoData = await todos.findById(todoId)
        return res.status(200).json({ status: true, message: "Todo found", data: todoData })
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

//FOR UPDATE TODO
const updateTodo = async (req, res) => {
    try {
        const userId = req.userId;
        const todoId = req.query?.id;
        const todoData = { ...req.body }
        if (!userId) {
            return UnauthorizedError(res, "user")
        }
        if (!todoId) {
            return NotFoundError(res, "Todo")
        }
        const updatedTododata = await todos.findByIdAndUpdate(todoId, todoData, { new: true })
        return res.status(200).json({ status: true, message: "Todo updated", data: updatedTododata })


    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

//FOR DELETE TODO
const deleteTodo = async (req, res) => {
    try {
        const userId = req.userId;
        const todoId = req.query?.id;
        if (!userId) {
            return UnauthorizedError(res, "user")
        }
        if (!todoId) {
            return NotFoundError(res, "Todo")
        }
        const deletedTodo = await todos.findByIdAndUpdate(todoId, { isArchive: true })

        return res.status(200).json(
            {
                status: true,
                message: "Todo deleted",
                data: deletedTodo

            }
        )
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

//FOR SEARCH TODO
const searchTodo = async (req, res) => {
    try {
        const userId = await req.userId;
        const searchParameter = req.query?.search;
        let searchQuery = {}
        if (searchParameter) {
            searchQuery = {
                $or: [
                    { task_description: { $regex: searchParameter, $options: "i" } },
                    { task_name: { $regex: searchParameter, $options: "i" } },
                    { status: { $regex: searchParameter, $options: "i" } },
                ],
            };
        }

        searchQuery.isArchive = false;
        if (!userId) {
            return UnauthorizedError(res, 'user')
        }
        const todoData = await todos.find(searchQuery)
        return res.status(200).json({ status: true, message: "Todo's found", data: todoData })
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)

    }


}

const multipleDeleteTodos = async (req, res) => {
    try {
        const ids = req.body?.ids

        const deleteTodos = await todos.deleteMAny({ _id: { $in: ids } })

        if (deleteTodos) {
            return res.status(200).json({
                status: true,
                message: "Selected todos deleted successfully"
            })
        }
    } catch (error) {
        return InternalServerError(res, error)
    }
}

module.exports = {
    createTodo,
    getAllTodo,
    getSingleTodo,
    updateTodo,
    getllUserTodo,
    deleteTodo,
    searchTodo,
    multipleDeleteTodos
}