const { default: mongoose } = require("mongoose");
const client_goal_history = require("../../models/clientGoalHistory");
const { InternalServerError } = require("../../utils/errorHandling");

const listClientGoalHistory = async (req, res) => {
    try {
        const history = await client_goal_history.aggregate([
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
                    to_client_goal: 1,
                    from_client_goal: 1
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
};


module.exports = { listClientGoalHistory }