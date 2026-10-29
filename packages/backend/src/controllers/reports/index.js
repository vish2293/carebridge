const { default: mongoose } = require("mongoose");
const { user, visit, taskClient, request, questionObjective, resourceGivenModel } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");
const { toNamespacedPath } = require("path/posix");
const pathwayModel = require("../../models/pathways");
const actionPathwayModel = require("../../models/actionStepPathway");

function calculateBirthdateRangeFromAge(age) {
    const currentDate = new Date();
    const startOfBirthDate = new Date(currentDate.getFullYear() - age - 1, currentDate.getMonth(), currentDate.getDate() + 1);
    const endOfBirthDate = new Date(currentDate.getFullYear() - age, currentDate.getMonth(), currentDate.getDate() + 1);

    return {
        startOfBirthDate,
        endOfBirthDate
    };
}

function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

const searchUser = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req?.body?.filter?.clientId;
        const zipCode = req?.body?.filter?.zipCode;
        const assign_to = req?.body?.filter?.assign_to;
        const status = req?.body?.filter?.status;
        const memberGroup = req.body.filter.memberGroup;
        const program = req.body.filter.program;
        const startDate = req.body.filter.fromDate;
        const endDate = req.body.filter.toDate;
        const age = req.body.filter.age;
        const language = req.body.filter.language;
        const prononuce = req.body.filter.prononuce;
        const ethnicity = req.body.filter.ethnicity;
        const { page, limit } = req.body.pagination

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

        searchQuery.$and.push({ role: "Client", isArchive: false });
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

        if (memberGroup) {
            searchQuery.$and.push({ memberGroup: lowerFirstLetter(memberGroup) });
        }

        const validUser = await user.findById(userId);
        const paProgram = validUser?.pa_program;

        if (validUser?.role === "Program_Administrator" || validUser?.role === "Super_Admin") {
        } else if (validUser?.role === "CHW") {
            searchQuery.assign_to = userId;
        }

        if (clientId) {
            searchQuery.$and.push({ _id: clientId });
        }

        let userData = await user.find({ ...searchQuery, role: "Client" })
            .sort({ createdAt: -1 })
            .populate({ path: 'assign_to', select: "firstName lastName _id" })
            .populate({ path: 'createdBy', select: "firstName lastName _id" })
            .populate("profileQuestion.question");

        if (validUser?.role === 'Super_Admin') {
            // Super admin have all the access
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(paProgram)) {
            userData = userData.filter(user => paProgram.includes(user.program))
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id })
            const programs = paData.pa_program

            if (Array.isArray(programs)) {
                userData = userData.filter(users =>
                    users?.program && programs.includes(users?.program)
                );
            }
        }

        const getFilteredCount = async (status) => {
            const baseQuery = {
                ...searchQuery,
                status,
                role: 'Client'
            };

            if (validUser?.role === "Program_Administrator" && Array.isArray(paProgram)) {
                baseQuery.$or = [
                    { program: { $in: paProgram } },
                ];
            } else if (validUser?.role === "CHW") {
                const paData = await user.findOne({ _id: validUser.pa_id });
                const programs = paData?.pa_program || [];
                baseQuery.program = { $in: programs };
            }

            return user.countDocuments(baseQuery).lean();
        };

        const pendingUserCount = await getFilteredCount("Pending");
        const openUserCount = await getFilteredCount("Open");
        const closedSuccessUserCount = await getFilteredCount("Closed-Success");
        const closedInactiveUserCount = await getFilteredCount("Closed-Inactive");

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

        const startIndex = (page - 1) * limit;
        const paginatedArray = enhancedUserData.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            status: true,
            message: "Users found",
            data: paginatedArray,
            pendingUserCount,
            openUserCount,
            closedSuccessUserCount,
            closedInactiveUserCount,
            totalCount: enhancedUserData.length
        });
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};

const serachVisits = async (req, res) => {
    try {
        const userId = req.userId;
        const clientId = req?.body?.filter?.client;
        const assign_to = req?.body?.filter?.assign_to;
        const visitType = req?.body?.filter?.visitType;
        const primaryNeed = req?.body?.filter?.primaryNeed;
        const visitDate = req?.body?.filter?.visitDate;
        const followUpDate = req?.body?.filter?.followUpDate;
        const { page, limit } = req.body.pagination;

        const validUser = await user.findById(userId);
        let searchQuery = {
            isArchive: false
        };

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        }

        if (validUser?.role === "Program_Administrator") {
            // Additional conditions for Program_Administrator can be added here if needed
        } else if (validUser?.role === "CHW") {
            searchQuery.assign_to = userId;
        }

        const startDate = req.body.filter.fromDate
        const endDate = req.body.filter.toDate

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

                userData = userData.filter(todo =>
                    todo.clientId?.assign_to && todo.clientId.assign_to.toString() === userId.toString()
                );
            }
        }

        const startIndex = (page - 1) * limit;
        const paginatedArray = userData.slice(startIndex, startIndex + limit);

        const phoneCallCount = userData.filter(visit => visit.visitType === "Phone Call").length
        const textCount = userData.filter(visit => visit.visitType === "Text").length
        const inPersonCount = userData.filter(visit => visit.visitType === "In-Person").length
        const emailCount = userData.filter(visit => visit.visitType === "Email").length
        const virtualCount = userData.filter(visit => visit.visitType === "Virtual").length

        return res.status(200).json({
            status: true,
            message: "Visits found",
            phoneCallCount,
            textCount,
            inPersonCount,
            emailCount,
            virtualCount,
            data: paginatedArray,
            totalCount: userData.length
        });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving visits", error: error.message });
    }
};

const searchImportantDates = async (req, res) => {
    try {
        const userId = req.userId;
        const { client: clientId, assign_to, category, status, dueDate } = req?.body?.filter || {};
        const { page, limit } = req.body.pagination;

        const validUser = await user.findById(userId);
        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.filter.fromDate;
        const endDate = req.body.filter.toDate;

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

        const pendingTodoCount = userData.filter(todo => todo.task.status === "Pending").length;
        const inProgressTodoCount = userData.filter(todo => todo.task.status === "In-Progress").length;
        const completedTodoCount = userData.filter(todo => todo.task.status === "Completed").length;

        const startIndex = (page - 1) * limit;
        const paginatedArray = userData.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            status: true,
            message: "Tasks found",
            data: paginatedArray,
            pendingTodoCount,
            inProgressTodoCount,
            completedTodoCount,
            totalCount: userData.length
        });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving tasks", error: error.message });
    }
};


const serachActionStep = async (req, res) => {
    try {
        const userId = req.userId;
        const { client: clientId, assign_to, status, type, urgent, resource_given } = req?.body?.filter || {};
        const { page, limit } = req.body.pagination

        const validUser = await user.findById(userId);
        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.filter.fromDate
        const endDate = req.body.filter.toDate

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

        const pendingActionSteps = userData.filter(request => request.request_status === "Pending").length
        const completedActionSteps = userData.filter(request => request.request_status === "Completed").length
        const inprogressActionSteps = userData.filter(request => request.request_status === "In-Progress").length
        const unsuccessfulActionSteps = userData.filter(request => request.request_status === "Unsuccessful").length
        const cancelledActionSteps = userData.filter(request => request.request_status === "Cancelled").length

        const startIndex = (page - 1) * limit;
        const paginatedArray = userData.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            status: true,
            message: "Action Steps found",
            pendingActionSteps,
            completedActionSteps,
            inprogressActionSteps,
            cancelledActionSteps,
            unsuccessfulActionSteps,
            data: paginatedArray,
            totalCount: userData.length
        });

    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving tasks", error: error.message });
    }
};

const searchObjectives = async (req, res) => {
    try {
        const userId = req.userId;
        const { client: clientId, label, value } = req?.body?.filter || {};
        const { page, limit } = req.body.pagination;

        const validUser = await user.findById(userId);
        let searchQuery = {};
        let andConditions = [];

        const startDate = req.body.filter.fromDate;
        const endDate = req.body.filter.toDate;

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

        // Filter by role
        if (validUser?.role === 'Super_Admin') {
            // Super admin can see all data
        } else if (validUser?.role === "Program_Administrator" && Array.isArray(validUser.pa_program)) {
            userData = userData.filter(user =>
                user.clientId?.program && validUser.pa_program.includes(user.clientId.program)
            );
        } else if (validUser?.role === "CHW") {
            const paData = await user.findOne({ _id: validUser.pa_id });
            const programs = paData.pa_program;

            if (Array.isArray(programs)) {
                userData = userData.filter(request =>
                    request.clientId?.program && programs.includes(request.clientId.program)
                );

                userData = userData.filter(todo =>
                    todo.clientId?.assign_to && todo.clientId.assign_to.toString() === userId.toString()
                );
            }
        }

        const labelCounts = userData.reduce((acc, obj) => {
            if (obj.label && obj.value) {  // Ensure both label and value are present
                if (!acc[obj.label]) {
                    acc[obj.label] = { stable: 0, unstable: 0 };  // Initialize label
                }

                if (obj.value === "stable") {
                    acc[obj.label].stable += 1;
                } else if (obj.value === "unstable") {
                    acc[obj.label].unstable += 1;
                }
            }
            return acc;
        }, {});

        let mostStableLabel = null;
        let mostUnstableLabel = null;
        let mostStableCount = 0;
        let mostUnstableCount = 0;

        for (const label in labelCounts) {
            const { stable, unstable } = labelCounts[label];

            if (stable > mostStableCount) {
                mostStableCount = stable;
                mostStableLabel = label;
            }

            if (unstable > mostUnstableCount) {
                mostUnstableCount = unstable;
                mostUnstableLabel = label;
            }
        }

        const startIndex = (page - 1) * limit;
        const paginatedArray = userData.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            status: true,
            message: "Objectives found",
            data: paginatedArray,
            totalCount: userData.length,
            mostStable: mostStableLabel ? { label: mostStableLabel, count: mostStableCount } : { label: 'None', count: "" },
            mostUnstable: mostUnstableLabel ? { label: mostUnstableLabel, count: mostUnstableCount } : { label: 'None', count: "" }
        });
    } catch (error) {
        console.log('error :', error);
        return res.status(500).json({ status: false, message: "An error occurred while retrieving tasks", error: error.message });
    }
};

const searchResourceGiven = async (req, res) => {
    try {
        const userId = req.userId;
        const { organization, name, category } = req?.body?.filter || {};
        const { page, limit } = req.body.pagination

        let searchQuery = { isArchive: false };
        let andConditions = [];

        const startDate = req.body.filter.fromDate
        const endDate = req.body.filter.toDate

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

        const userData = await resourceGivenModel.find(searchQuery).populate('category').lean()

        const resourceUsageCounts = await request.aggregate([
            {
                $facet: {
                    usedResources: [
                        { $unwind: "$resources_given" },
                        { $group: { _id: "$resources_given", usedCount: { $sum: 1 } } }
                    ],
                    nonWorkedResources: [
                        { $unwind: "$notWorkedResoruces" },
                        { $group: { _id: "$notWorkedResoruces", nonWorkedCount: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const userDataWithCounts = userData.map(resource => {
            const resourceIdStr = resource._id.toString();
            const usage = resourceUsageCounts[0].usedResources.find(count => count._id.toString() === resourceIdStr);
            const nonWorked = resourceUsageCounts[0].nonWorkedResources.find(count => count._id.toString() === resourceIdStr);

            return {
                ...resource,
                usageCount: usage ? usage.usedCount : 0,
                nonWorkedCount: nonWorked ? nonWorked.nonWorkedCount : 0
            };
        });

        const sortedByUsageCountDescending = [...userDataWithCounts].sort((a, b) => b.usageCount - a.usageCount);
        const sortedByUsageCountAscending = [...userDataWithCounts].sort((a, b) => a.usageCount - b.usageCount);
        const mostUsedResource = sortedByUsageCountDescending[0];
        const leastUsedResource = sortedByUsageCountAscending[0];

        const startIndex = (page - 1) * limit;
        const paginatedArray = userDataWithCounts.slice(startIndex, startIndex + limit);

        return res.status(200).json({ status: true, message: "Resource Given found", data: paginatedArray, mostUsedResource, leastUsedResource, totalCount: userData.length });
    } catch (error) {
        console.log("error", error)
    }
}

const searchPathways = async (req, res) => {
    try {
        const { name, need, clientId, status } = req?.body?.filter || {};
        const { page = 1, limit = 10 } = req.body.pagination || {};

        let searchQuery = {};
        let andConditions = [];

        const startDate = req.body.filter?.fromDate || "";
        const endDate = req.body.filter?.toDate || "";

        const dateHigh = endDate ? new Date(endDate) : new Date();
        const dateLow = startDate ? new Date(startDate) : new Date();

        if (startDate && endDate) {
            andConditions.push({
                createdAt: {
                    $gte: dateLow,
                    $lte: dateHigh
                }
            });
        }

        if (name) {
            andConditions.push({ pathwayId: name });
        }

        if (clientId) {
            andConditions.push({ userId: clientId });
        }

        if (status) {
            andConditions.push({ status: status });
        }

        if (andConditions.length > 0) {
            searchQuery.$and = andConditions;
        }

        const userData = await actionPathwayModel.find(searchQuery)
            .populate({
                path: "pathwayId",
                select: "name need description",
                populate: [
                    { path: 'need' },
                    { path: 'name' }
                ]
            })
            .populate({
                path: "userId",
                select: "firstName lastName"
            })
            .populate("requestId")
            .sort({ createdAt: -1 })
            .lean();

        let filteredData = userData;

        if (need) {
            filteredData = userData.filter(item => {
                return item.pathwayId && String(item.pathwayId.need._id) === String(need);
            });
        }

        filteredData = filteredData.map(item => {
            if (item.requestId && Array.isArray(item.requestId)) {
                const filteredRequests = item.requestId.filter(request => !request.isArchive);
                item.requestId = filteredRequests;
                item.requestIdCount = filteredRequests.length;
            } else {
                item.requestIdCount = 0;
            }
            return item;
        });

        const startIndex = (page - 1) * limit;
        const paginatedArray = filteredData.slice(startIndex, startIndex + limit);

        return res.status(200).json({
            status: true,
            message: "Pathways found",
            data: paginatedArray,
            totalCount: userData.length
        });
    } catch (error) {
        console.error("Error in searchPathways:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};


module.exports = {
    searchUser,
    serachVisits,
    searchImportantDates,
    serachActionStep,
    searchObjectives,
    searchResourceGiven,
    searchPathways
}