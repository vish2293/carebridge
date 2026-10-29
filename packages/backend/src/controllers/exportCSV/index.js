const { default: mongoose } = require("mongoose");
const { user, visit, taskClient, request, questionObjective, resourceGivenModel, actionStepHistoryModel, profileQuestionHistory, visitHistory } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");
const pathwayModel = require("../../models/pathways");
const auditLogModel = require("../../models/auditLogs");
const actionPathwayModel = require("../../models/actionStepPathway");
const attachmentsModel = require("../../models/attachemts");
const client_goal_history = require("../../models/clientGoalHistory");
const notesModel = require("../../models/notes");
const taskClientHistory = require("../../models/taskClientHistory");
const userModel = require("../../models/users");

function calculateBirthdateRangeFromAge(age) {
    const currentDate = new Date();
    const startOfBirthDate = new Date(currentDate.getFullYear() - age - 1, currentDate.getMonth(), currentDate.getDate() + 1);
    const endOfBirthDate = new Date(currentDate.getFullYear() - age, currentDate.getMonth(), currentDate.getDate() + 1);

    return {
        startOfBirthDate,
        endOfBirthDate
    };
}

const exportUser = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req?.body?.clientId;
        const zipCode = req?.body?.zipCode;
        const assign_to = req?.body?.byCHW;
        const status = req?.body?.status;
        const role = req?.body?.role ? req?.body?.role : '';
        const program = req.body.program;
        const startDate = req.body.fromDate;
        const endDate = req.body.toDate;
        const age = req.body.age;
        const language = req.body.language;
        const prononuce = req.body.prononuce;
        const ethnicity = req.body.ethnicity;

        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        let searchQuery = {
            $and: []
        };

        if (startDate !== "" && endDate !== "") {
            searchQuery.$and.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        searchQuery.$and.push({ role: role, isArchive: false });
        if (zipCode) {
            searchQuery.$and.push({ zipCode: zipCode });
        }

        if (program) {
            searchQuery.$and.push({ program: program });
        }

        if (assign_to) {
            searchQuery.$and.push({ assign_to: assign_to });
        }

        if (status) {
            searchQuery.$and.push({ status: status });
        }

        if (age) {
            const { startOfBirthDate, endOfBirthDate } = calculateBirthdateRangeFromAge(age);

            searchQuery.$and.push({
                birthDate: {
                    $gte: startOfBirthDate.toISOString().split('T')[0],
                    $lt: endOfBirthDate.toISOString().split('T')[0]
                }
            });
        }

        if (language) {
            searchQuery.$and.push({ 'profileQuestion.answer.answer': language });
        }

        if (prononuce) {
            searchQuery.$and.push({ 'profileQuestion.answer.answer': prononuce });
        }

        if (ethnicity) {
            searchQuery.$and.push({ 'profileQuestion.answer.answer': ethnicity });
        }

        const validUser = await user.findById(userId);

        if (validUser?.role === "Program_Administrator") {
            // Additional logic for Program Administrator
        } else if (validUser?.role === "CHW") {
            searchQuery.assign_to = userId;
        }

        if (clientId) {
            searchQuery.$and.push({ _id: clientId });
        }

        searchQuery.isArchive = false;

        let userData = await user.find(searchQuery)
            .sort({ createdAt: -1 })
            .populate({ path: 'assign_to', select: "firstName lastName _id" })
            .populate({ path: 'createdBy', select: "firstName lastName _id" })
            .populate("profileQuestion.question");

        if (validUser?.role === 'Super_Admin') {
            // Super admin have all the access
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser.paProgram)) {
            userData = userData.filter(user => (validUser.paProgram).includes(user.program))
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id })
            const programs = paData.pa_program

            if (Array.isArray(programs)) {
                userData = userData.filter(users =>
                    users?.program && programs.includes(users?.program)
                );
            }
        }

        const enhancedUserData = await Promise.all(userData.map(async (user) => {
            const [visitCount, todoCount, requestCount] = await Promise.all([
                visit.countDocuments({ clientId: user._id }),
                taskClient.countDocuments({ clientId: user._id }),
                request.countDocuments({ request_by: user._id })
            ]);

            return {
                ...user._doc,
                visitCount,
                todoCount,
                requestCount
            };
        }));

        const statusOrder = {
            "Pending": 1,
            "Open": 2,
            "Closed-Success": 3,
            "Closed-Inactive": 4
        };

        enhancedUserData.sort((a, b) => {
            return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
        });

        return res.status(200).json({ status: true, message: "Users found", data: enhancedUserData });
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};

const exportVisits = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req?.body?.client;
        const assign_to = req?.body?.assign_to;
        const visitType = req?.body?.visitType;
        const primaryNeed = req?.body?.primaryNeed;
        const visitDate = req?.body?.visitDate;
        const followUpDate = req?.body?.followUpDate;

        const validUser = await user.findById(userId);
        let searchQuery = {
            isArchive: false
        };

        if (validUser?.role === "Program_Administrator") {
            // Additional conditions for Program_Administrator can be added here if needed
        } else if (validUser?.role === "CHW") {
            searchQuery.assign_to = userId;
        }

        const startDate = req.body.fromDate
        const endDate = req.body.toDate

        const andConditions = [];

        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        if (startDate !== "" && endDate !== "") {
            andConditions.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        if (assign_to) {
            andConditions.push({ assign_to: assign_to });
        }

        if (clientId) {
            andConditions.push({ clientId: clientId });
        }

        if (primaryNeed) {
            andConditions.push({ primaryNeed: primaryNeed });
        }

        if (visitDate) {
            const visitDates = new Date(visitDate);
            const nextDay = new Date(visitDates);
            nextDay.setDate(visitDates.getDate() + 1);

            andConditions.push({
                visitDate: {
                    $gte: visitDates,
                    $lt: nextDay
                }
            });
        }

        if (followUpDate) {
            const visitDates = new Date(followUpDate);
            const nextDay = new Date(visitDates);
            nextDay.setDate(visitDates.getDate() + 1);

            andConditions.push({
                followupDate: {
                    $gte: visitDates,
                    $lt: nextDay
                }
            });
        }

        if (visitType) {
            andConditions.push({ visitType: visitType });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        let userData = await visit.find(searchQuery).sort({ createdAt: -1 })
            .populate({
                path: 'clientId',
                select: 'firstName lastName _id client_goal program assign_to'
            })
            .populate({
                path: 'assign_to',
                select: 'firstName lastName _id'
            })
            .populate('primaryNeed', '_id name')
            .populate('pathway', '_id name')

        if (validUser?.role === 'Super_Admin') {
            // Super admin have all the access
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser?.pa_program)) {
            userData = userData.filter(visits =>
                visits.clientId?.program && (validUser.pa_program).includes(visits.clientId.program)
            );
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id })
            const programs = paData.pa_program

            if (Array.isArray(programs)) {
                userData = userData.filter(visits =>
                    visits.clientId?.program && programs.includes(visits.clientId.program)
                );

                userData = userData.filter(visits =>
                    visits.clientId.assign_to && visits.clientId.assign_to.toString() === userId.toString()
                );
            }
        }

        return res.status(200).json({ status: true, message: "Visits found", data: userData });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving visits", error: error.message });
    }
};

const exportImportantDates = async (req, res) => {
    try {
        const userId = req.userId;
        const { client: clientId, assign_to, category, status, dueDate } = req?.body || {};

        const validUser = await user.findById(userId);
        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.fromDate;
        const endDate = req.body.toDate;

        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        if (startDate !== "" && endDate !== "") {
            andConditions.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        if (validUser?.role === "CHW") {
            andConditions.push({ assign_to: userId });
        }

        if (category) {
            andConditions.push({ 'task.category': category });
        }

        if (dueDate !== "") {
            const visitDates = new Date(dueDate);
            const nextDay = new Date(visitDates);
            nextDay.setDate(visitDates.getDate() + 1);

            andConditions.push({
                dueDate: {
                    $gte: visitDates,
                    $lt: nextDay
                }
            });
        }

        if (assign_to) {
            andConditions.push({ assign_to: assign_to });
        }

        if (status) {
            andConditions.push({ 'task.status': status });
        }

        if (clientId) {
            andConditions.push({ clientId: clientId });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        let userData = await taskClient.find(searchQuery)
            .sort({ createdAt: -1 })
            .populate({
                path: 'visitId',
                select: 'assign_to',
                populate: {
                    path: 'assign_to',
                    select: 'firstName lastName _id'
                }
            })
            .populate({
                path: 'clientId',
                select: 'firstName lastName program assign_to _id'
            })
            .populate('task.category')

        if (validUser?.role === 'Super_Admin') {
            // Super admin have all the access
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser.pa_program)) {
            const paProgram = validUser.pa_program;
            userData = userData.filter(todos =>
                todos.clientId?.program && paProgram.includes(todos.clientId.program)
            );
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id });
            const programs = paData?.pa_program || [];

            if (Array.isArray(programs)) {
                userData = userData.filter(todo =>
                    todo.clientId?.program && programs.includes(todo.clientId.program)
                );

                userData = userData.filter(todo =>
                    todo.clientId?.assign_to && todo.clientId.assign_to.toString() === userId.toString()
                );
            }
        }

        return res.status(200).json({
            status: true,
            message: "Tasks found",
            data: userData,
        });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving tasks", error: error.message });
    }
};

const exportActionStep = async (req, res) => {
    try {
        const userId = req.userId;
        const { client: clientId, assign_to, status, type, urgent, resource_given } = req.body;

        const validUser = await user.findById(userId);
        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.fromDate
        const endDate = req.body.toDate
        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        if (startDate !== "" && endDate !== "") {
            andConditions.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        if (validUser?.role === "Program_Administrator") {
        } else if (validUser?.role === "CHW") {
            andConditions.push({ assign_to: userId });
        }

        if (resource_given) {
            andConditions.push({ resources_given: { $in: [resource_given] } });
        }

        if (type) {
            andConditions.push({ request_type: type });
        }

        if (status) {
            andConditions.push({ request_status: status });
        }

        if (urgent !== "") {
            andConditions.push({ urgent: urgent });
        }

        if (assign_to) {
            andConditions.push({ assign_to: assign_to });
        }

        if (clientId) {
            andConditions.push({ request_by: clientId });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        let userData = await request.find(searchQuery).sort({ createdAt: -1 })
            .populate({
                path: 'assign_to',
                select: 'firstName lastName _id'
            }).populate({
                path: 'request_by',
                select: 'firstName lastName program assign_to _id'
            })
            .populate({
                path: 'resources_given',
                select: 'resource_name _id organization',
                options: { strictPopulate: false }
            })
            .populate({
                path: "visitId",
                select: "assign_to",
                populate: {
                    path: "assign_to",
                    select: "firstName lastName _id"
                }
            })
            .populate('request_type')

        userData = userData.filter(request => request.request_type && request.request_type !== '' && request.request_by !== ("" || undefined));

        if (validUser?.role === 'Super_Admin') {
            // Super admin have all the access
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser.pa_program)) {
            userData = userData.filter(request =>
                request.request_by?.program && (validUser.pa_program).includes(request.request_by.program)
            );
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id })
            const programs = paData.pa_program

            if (Array.isArray(programs)) {
                userData = userData.filter(request =>
                    request.request_by?.program && programs.includes(request.request_by.program)
                );

                userData = userData.filter(todo =>
                    todo.request_by?.assign_to && todo.request_by.assign_to.toString() === userId.toString()
                );
            }
        }

        return res.status(200).json({ status: true, message: "Action Steps found", data: userData });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving tasks", error: error.message });
    }
}

const exportObjectives = async (req, res) => {
    try {
        const userId = req.userId;
        const { client: clientId, label, value } = req.body || {};

        const validUser = await user.findById(userId);
        let searchQuery = {};
        let andConditions = [];

        if (clientId) {
            andConditions.push({ clientId: clientId });
        }

        if (label) {
            andConditions.push({ label: label });
        }

        if (value) {
            andConditions.push({ value: value });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        let userData = await questionObjective.find(searchQuery)
            .sort({ createdAt: -1 })
            .populate({
                path: 'clientId',
                select: 'firstName lastName program _id role assign_to'
            });

        if (validUser?.role === 'Super_Admin') {
            // Do nothing specific for Super_Admin, retain all data
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser.pa_program)) {
            userData = userData.filter(user =>
                user.clientId?.program && validUser.pa_program.includes(user.clientId.program)
            );
        } else if (validUser?.role === "CHW") {
            userData = userData.filter(user =>
                user.clientId?.assign_to && user.clientId.assign_to.toString() === userId
            );
        }

        return res.status(200).json({ status: true, message: "Objectives found", data: userData, totalCount: userData.length });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving tasks", error: error.message });
    }
};

const exportResourceGiven = async (req, res) => {
    try {
        const userId = req.userId;
        const { organization, name, category } = req?.body || {};

        const validUser = await user.findById(userId);
        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.fromDate
        const endDate = req.body.toDate

        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        if (startDate !== "" && endDate !== "") {
            andConditions.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        if (validUser?.role === "Program_Administrator") {
        } else if (validUser?.role === "CHW") {
            andConditions.push({ assign_to: userId });
        }

        if (organization) {
            andConditions.push({ organization: new RegExp(organization, 'i') });
        }

        if (name) {
            andConditions.push({ _id: name });
        }

        if (category) {
            andConditions.push({ category: category });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        const userData = await resourceGivenModel.find(searchQuery).lean()

        const resourceUsageCounts = await request.aggregate([
            { $unwind: "$resources_given" },
            { $group: { _id: "$resources_given", count: { $sum: 1 } } }
        ]);

        // Map the count to the resources
        const userDataWithCounts = userData.map(resource => {
            const usage = resourceUsageCounts.find(count => count.count);
            return {
                ...resource,
                usedCount: usage ? usage.count : 0
            };
        });

        return res.status(200).json({ status: true, message: "Resource Given found", data: userDataWithCounts, totalCount: userData.length });
    } catch (error) {
        console.log("error", error)
    }
}

const exportPathways = async (req, res) => {
    try {
        const { name, need } = req?.body || {};

        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.fromDate
        const endDate = req.body.toDate

        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        if (startDate !== "" && endDate !== "") {
            andConditions.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        if (name) {
            andConditions.push({ name: name });
        }

        if (need) {
            andConditions.push({ need: need });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        const userData = await pathwayModel.find(searchQuery).populate('need').sort({ createdAt: -1 }).lean()

        return res.status(200).json({ status: true, message: "Pathways found", data: userData, totalCount: userData.length });
    } catch (error) {
        console.log("error", error)
    }
}

const exportAuditLogs = async (req, res) => {
    try {
        if (req.role !== "Super_Admin") {
            return res.status(401).json({
                status: false,
                message: "You don't have permission to access this route!"
            });
        }

        const auditLogs = await auditLogModel.find({
            accessedData: {
                $ne: 'N/A',
                $exists: true,
                $nin: ['null', 'undefined']
            }
        })
            .populate({ path: "accessedBy", select: "firstName lastName" })
            .sort({ accessedAt: -1 })
            .lean();

        const validLogs = auditLogs.filter(log =>
            mongoose.Types.ObjectId.isValid(log?.accessedData)
        );

        const uniqueAccessedIds = [...new Set(validLogs.map(log => log.accessedData))];

        const [users, visits, requests, tasks, actionStepHistory, actionPathway, attachemts, client_goal, notes, profileQuestion, visitHistories, taskClientHistories] = await Promise.all([
            userModel.find({ _id: { $in: uniqueAccessedIds } })
                .select('firstName lastName _id')
                .lean(),
            visit.find({ clientId: { $in: uniqueAccessedIds } })
                .populate('clientId', 'firstName lastName')
                .select('clientId')
                .lean(),
            request.find({ request_by: { $in: uniqueAccessedIds } })
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
            notesModel.find({ clientId: { $in: uniqueAccessedIds } })
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

        [...users, ...visits, ...requests, ...tasks, ...actionStepHistory, ...actionPathway, ...attachemts, ...client_goal, ...notes, ...profileQuestion, ...visitHistories, ...taskClientHistories].forEach(record => {
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
            count: processedLogs.length
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
    exportUser,
    exportVisits,
    exportImportantDates,
    exportActionStep,
    exportObjectives,
    exportResourceGiven,
    exportPathways,
    exportAuditLogs
}