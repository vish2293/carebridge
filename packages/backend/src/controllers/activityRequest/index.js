const { activityRequest } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");

const addActivityRequest = async (req, res) => {
    try {
        const body = req.body;
        const newActivityRequest = new activityRequest({
            userId: body?.userId,
            requestId: body?.requestId,
            status: body?.status,
            other: body?.other
        });
        const newActiviry = await newActivityRequest.save();
                
        if (newActiviry) {
            return newActiviry;
        }
    } catch (error) {
        return InternalServerError(res, error)
    }
}

const getActivityRequest = async (req, res) => {
    try {
        const reqId = req.body.reqId;

        const answerAdd = await activityRequest.find({requestId : reqId}).populate('userId', "role")
                
        if (answerAdd) {
            return res.status(200).json({
                data: answerAdd,
                status: true,
                message: "Get request activiry"
            })  
        }
    } catch (error) {
        console.log(error)
        return InternalServerError(res, error)
    }
}


module.exports = {
    addActivityRequest,
    getActivityRequest
}