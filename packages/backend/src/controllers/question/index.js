const { questions, user, todos } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");

//FOR QUESTION CREATE
const createQuestion = async (req, res) => {
    try {
        const userId = req.userId;
        const { question, ansOptions, answer_type, category } = req.body;
        if (!question) {
            return res.status(400).json({ status: false, message: "Question name required" })
        }

        if (!category) {
            return res.status(400).json({ status: false, message: "Question category required" })
        }
        const newQuestion = new questions({
            createBy: userId,
            ansOptions,
            answer_type,
            category,
            question,
        })
        await newQuestion.save()

        return res.status(200).json({ status: true, message: "Question created", data: newQuestion })

    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

//FOR GET ALL QUESTION 
const getAllQuestion = async (req, res) => {
    try {
        let questionList = [];
        const userId = req.userId

        const validUser = await user.findById(userId)


        //filter
        const query = {}
        if (validUser?.role === 'Program_Administrator') {
            query.createBy = userId
        } else if (validUser?.role === 'CHW') {
            query.assign_to = userId
        } else {
            query.ansBy = userId
        }
        
        query.isArchive = false;
        const totalQuestionCount = await questions.countDocuments(query)

      

        questionList = await questions.find(query).sort("-createdAt")

        return res.status(200).json({
            status: true,
            data: {
                questionList,
                
             
            }
        })

    } catch (error) {
        console.log('error', error)
        return InternalServerError(res, error)
    }
}

//FOR SEARCH QUESTION

const searchQuestion = async (req, res) => {
    try {
        const searchParameter = req.query?.search;
        let searchQuery = {};
        const escapedSearchParameter = searchParameter ? searchParameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;

        if (searchParameter) {
            searchQuery = {
                $or: [
                    { question: { $regex: escapedSearchParameter, $options: "i" } },
                ],
            };
        }
        
        searchQuery.isArchive = false;
        const questionList = await questions.find(searchQuery);
        return res.status(200).json({ status: true, message: "Users found", data: {questionList:questionList} });
    } catch (error) {
        return InternalServerError(res, error);
    }

}

//FOR SINGLE QUESTION
const getSingleQuestion = async (req, res) => {
    try {
        const questionId = req.query?.id;
        const questionData = await questions.findById(questionId)
        return res.status(200).json({ status: true, message: "Question found", data: questionData })
    } catch (error) {
        return InternalServerError(res, 500)
    }
}

//FOR UPDATE QUESTION 
const updateQuestion = async (req, res) => {
    try {
        const questionId = req.query?.id
        const questionData = { ...req.body }
        const updatedQuestionData = await questions.findByIdAndUpdate(questionId, questionData, { new: true })

        return res.status(200).json({ status: true, message: "question updated", data: updatedQuestionData })
    } catch (error) {
        return InternalServerError(res, error)
    }
}

//FOR DELETE QUESTION 
const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.query?.id;
        const deletedQuestionData = await questions.findByIdAndUpdate(questionId, { isArchive: true })
        return res.status(200).json({ status: true, message: "Question Deleted", data: deletedQuestionData })
    } catch (error) {
        return InternalServerError(res, error)
    }
}


const deleteMultipleQuestion = async (req, res) => {
    try {
        const ids = req.query?.ids
        const deleteTodos = await questions.deleteMany({ _id: { $in: ids } })

        if (deleteTodos) {
            return res.status(200).json({
                status: true,
                message: "Selected todos deleted successfully"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}


module.exports = {
    createQuestion,
    getAllQuestion,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    searchQuestion,
    deleteMultipleQuestion
}