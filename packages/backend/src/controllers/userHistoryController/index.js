const { default: mongoose } = require("mongoose");
const { InternalServerError } = require("../../utils/errorHandling");
const taskClientHistory = require("../../models/taskClientHistory");
const clientStatusHistoryModel = require("../../models/userStatusHistory");

const listHistoryOfUser = async (req, res) => {
    try {
        const history = await clientStatusHistoryModel.aggregate([
            {
                $match: { clientId: new mongoose.Types.ObjectId(req.body.clientId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "modifiedBy",
                    foreignField: "_id",
                    as: "modifiedBy"
                }
            },
            {
                $project: {
                    _id: 0,
                    "modifiedBy.firstName": { $arrayElemAt: ["$modifiedBy.firstName", 0] },
                    "modifiedBy.lastName": { $arrayElemAt: ["$modifiedBy.lastName", 0] },
                    "modifiedBy._id": { $arrayElemAt: ["$modifiedBy._id", 0] },
                    createdAt: 1,
                    updatedAt: 1,
                    newstatus: 1,
                    oldStatus: 1,
                    statusReason: 1,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    history: { $push: "$$ROOT" }
                }
            },
            {
                $sort: { "_id": -1 }
            },
        ]);

        return res.status(201).json({
            status: true,
            data: history
        });
    } catch (error) {
        console.log('error', error);
        return InternalServerError(res, error);
    }
}


module.exports = { listHistoryOfUser }