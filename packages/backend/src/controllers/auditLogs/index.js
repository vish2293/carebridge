const { default: mongoose } = require("mongoose");
const auditLogModel = require("../../models/auditLogs");
const userModel = require("../../models/users");
const actionStepHistoryModel = require("../../models/actionStepHistory");
const actionPathwayModel = require("../../models/actionStepPathway");
const notes = require("../../models/notes");
const profileQuestionHistory = require("../../models/profileQuestionHistory");
const requestModel = require("../../models/request");
const taskClient = require("../../models/taskClient");
const taskClientHistory = require("../../models/taskClientHistory");
const visit = require("../../models/visit");
const visitHistory = require("../../models/visitHistory");
const attachmentsModel = require("../../models/attachemts");
const client_goal_history = require("../../models/clientGoalHistory");

const listAuditLogs = async (req, res) => {
    try {
        if (req.role !== "Super_Admin") {
            return res.status(401).json({
                status: false,
                message: "You don't have permission to access this route!"
            });
        }

        const pageNo = parseInt(req.body.pagination?.page) || 1;
        const pageSize = parseInt(req.body.pagination?.limit) || 25;
        const skip = (pageNo - 1) * pageSize;

        const totalCount = await auditLogModel.find({
            accessedData: {
                $ne: 'N/A',
                $exists: true,
                $nin: ['null', 'undefined']
            }
        })
            .populate({ path: "accessedBy", select: "firstName lastName" })
            .sort({ accessedAt: -1 })
            .lean();

        const auditLogs = await auditLogModel.find({
            accessedData: {
                $ne: 'N/A',
                $exists: true,
                $nin: ['null', 'undefined']
            }
        })
            .populate({ path: "accessedBy", select: "firstName lastName" })
            .sort({ accessedAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean();

        const validLogs = auditLogs.filter(log =>
            mongoose.Types.ObjectId.isValid(log?.accessedData)
        );

        const uniqueAccessedIds = [...new Set(validLogs.map(log => log.accessedData))];

        const [users, visits, requests, tasks, actionStepHistory, actionPathway, attachemts, client_goal, notesdata, profileQuestion, visitHistories, taskClientHistories] = await Promise.all([
            userModel.find({ _id: { $in: uniqueAccessedIds } })
                .select('firstName lastName _id')
                .lean(),
            visit.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            requestModel.find({ request_by: { $in: uniqueAccessedIds } })
                .populate('request_by', 'firstName lastName')
                .select('request_by')
                .lean(),
            taskClient.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            actionStepHistoryModel.find({ request_by: { $in: uniqueAccessedIds } })
                .populate('request_by', 'firstName lastName')
                .select('request_by')
                .lean(),
            actionPathwayModel.find({ userId: { $in: uniqueAccessedIds } })
                .populate('userId', 'firstName lastName')
                .select('userId')
                .lean(),
            attachmentsModel.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            client_goal_history.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            notes.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            profileQuestionHistory.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            visitHistory.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            taskClientHistory.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
        ]);

        const dataLookup = new Map();

        [...users, ...visits, ...requests, ...tasks, ...actionStepHistory, ...actionPathway, ...attachemts, ...client_goal, ...notesdata, ...profileQuestion, ...visitHistories, ...taskClientHistories].forEach(record => {
            const id = record._id?.toString() ||
                record.clientId?._id?.toString() ||
                record.request_by?._id?.toString();

            if (id) {
                const name = {
                    firstName: record.firstName || record.clientId?.firstName || record.request_by?.firstName || '',
                    lastName: record.lastName || record.clientId?.lastName || record.request_by?.lastName || ''
                };
                dataLookup.set(id, name);
            }
        });

        const processedLogs = validLogs.map(log => {
            const accessedId = log.accessedData.toString();
            const name = dataLookup.get(accessedId);

            if (!name) return null;

            return {
                ...log,
                accessedData: [{
                    firstName: name.firstName,
                    lastName: name.lastName
                }]
            };
        }).filter(Boolean);

        return res.status(200).json({
            status: true,
            message: "Audit logs retrieved successfully",
            data: processedLogs,
            count: totalCount.length,
            pageNo,
            pageSize
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    listAuditLogs
}