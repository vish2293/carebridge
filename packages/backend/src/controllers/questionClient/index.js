const { questionClient, request } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");
const { addActivityRequest } = require("../activityRequest");
const { isValidObjectId } = require('mongoose');
const assignQuestion = async (req, res) => {
    try {
        const question = req.body.question;
        const requestId = req.body.requestId;

        const updatedRequest = await request.findByIdAndUpdate(requestId, { is_question_assign: true, request, request_status: "In-Progress" }, { new: true })
        const questionAdd = await questionClient.insertMany(question)

        if (questionAdd) {
            await addActivityRequest({ body: { userId: req.userId, requestId: requestId, status: "question_assign" } });
            return res.status(200).json({
                data: { questionAdd, updatedRequest },
                status: true,
                message: "Question assign successfully"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const getRequestQuestion = async (req, res) => {
    try {
        const reqId = req.body.reqId;
        const answerAdd = await questionClient.find({ requestId: reqId })

        if (answerAdd) {
            return res.status(200).json({
                data: answerAdd,
                status: true,
                message: "Get request question"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}

const answerQuestion = async (req, res) => {
    try {
        const answer = req.body.answer;
        const reqId = req.query.reqId;

        if (!reqId || !isValidObjectId(reqId)) {
            return res.status(400).json({ status: false, message: "Please provide a correct ID" });
        }

        let arrAnswer = [];
        if (answer && answer.length > 0) {
            // Use map to create an array of promises
            const promises = answer.map(async (a) => {
                // Use await to wait for each findOneAndUpdate to complete
                const addedAns = await questionClient.findOneAndUpdate({ _id: a._id }, { answer: a.answer }, { new: true });
                return addedAns;
            });

            // Use Promise.all to wait for all promises to resolve
            arrAnswer = await Promise.all(promises);
        }

        if (arrAnswer) {
            const updatedRequest = await request.findByIdAndUpdate(reqId, { is_answer_given: true, status: "In-Progress" }, { new: true })
            return res.status(200).json({
                data: { arrAnswer, updatedRequest },
                status: true,
                message: "Question answer added successfully"
            })
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}


module.exports = {
    assignQuestion,
    getRequestQuestion,
    answerQuestion
}