const { default: mongoose } = require("mongoose");
const { InternalServerError } = require("../../utils/errorHandling");
const requestStatusHistory = require("../../models/requestHistory");
const { actionStepHistoryModel } = require("../../models");

const listHistoryOfStatus = async (req, res) => {
    try {
        const history = await requestStatusHistory.aggregate([
            {
                $match: { requestId: new mongoose.Types.ObjectId(req.body.requestId) }
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
                $lookup: {
                    from: "requests",
                    localField: "requestId",
                    foreignField: "_id",
                    as: "request"
                }
            },
            {
                $project: {
                    _id: 0,
                    "modifiedBy.firstName": { $arrayElemAt: ["$modifiedBy.firstName", 0] },
                    "modifiedBy.lastName": { $arrayElemAt: ["$modifiedBy.lastName", 0] },
                    "modifiedBy._id": { $arrayElemAt: ["$modifiedBy._id", 0] },
                    createdAt: 1,
                    request: { $arrayElemAt: ["$request", 0] },
                    currentStatus: 1,
                    newStatus: 1,
                    reason: 1
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

const listActionStepHistory = async (req, res) => {
    try {
        const role = req.role
        if (role === "Program_Administrator" || role === "Super_Admin") {
            const listData = await actionStepHistoryModel.find({ requestId: req.body.requestId })
                .populate('request_by', 'firstName lastName _id')
                .populate('assign_to', 'firstName lastName _id')
                .populate('createdBy', 'firstName lastName _id')
                .populate('modifiedBy', 'firstName lastName _id')
                .populate('pathway')
                .populate('request_type')
                .populate({ path: "resources_given", select: "resource_name _id organization" })
                .populate({ path: "notWorkedResoruces", select: "resource_name _id organization" })

            const formatDate = (date) => {
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return new Intl.DateTimeFormat('default', options).format(new Date(date));
            };

            const groupedData = listData.reduce((acc, current) => {
                const createdAtDate = formatDate(current.createdAt);
                if (!acc[createdAtDate]) {
                    acc[createdAtDate] = [];
                }
                acc[createdAtDate].push(current);
                return acc;
            }, {});

            for (const date in groupedData) {
                groupedData[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            const result = Object.keys(groupedData).map(date => ({ date, data: groupedData[date] }));
            result.sort((a, b) => new Date(b.date) - new Date(a.date));

            return res.status(200).json({ status: true, message: "Action Step history listed", data: result });
        } else {
            return UnauthorizedError(res, "User");
        }
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = { listHistoryOfStatus, listActionStepHistory }