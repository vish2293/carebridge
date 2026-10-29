const { user, request, actionStepHistoryModel } = require("../../models");
const actionPathwayModel = require("../../models/actionStepPathway");
const needOrCategoryModel = require("../../models/needOrCategory");
const requestStatusHistory = require("../../models/requestHistory");
const resourceGiven = require("../../models/resourceGiven");
const userModel = require("../../models/users");
const { InternalServerError } = require("../../utils/errorHandling");
const { trimStrings } = require("../../utils/trimSpace");
const { addActivityRequest } = require("../activityRequest");
const { isValidObjectId } = require('mongoose');

//FOR CREATE REQUESTO
const createRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { request_type, request_details, request_status, request_by, assign_to, resources_given } = req.body;
    const trimmedRequestData = trimStrings({
      createdby: userId,
      request_by,
      request_details,
      request_type,
      resources_given,
      assign_to,
      request_status
    });

    let newRequest = new request(trimmedRequestData);
    await newRequest.save();

    if (requestData?._id) {
      requestData = await request.findOne(requestData?._id)
        .populate({
          path: "assign_to",
          select: "firstName lastName _id email",
        })
        .populate({
          path: "request_by",
          select: "firstName lastName _id email",
        })
        .populate({
          path: "createdby",
          select: "firstName lastName _id email",
        })
        .populate({
          path: "resources_given",
          select: "resource_name _id organization",
        })

      await addActivityRequest({ body: { userId: userId, requestId: requestData?._id, status: "request_client" } });
    }

    return res
      .status(201)
      .json({ status: true, message: "Request added", data: requestData });
  } catch (error) {
    console.log(error);
    return InternalServerError(res, error);
  }
};

//FOR CREATE REQUEST
const multipleRequest = async (requestData) => {
  try {
    const task = requestData;
    const taskAdd = await request.insertMany(task);
    await Promise.all(
      taskAdd.map(async (data) => {
        const historyData = new actionStepHistoryModel({
          request_by: data.request_by,
          assign_to: data.assign_to,
          requestId: data._id,
          request_details: data.request_details,
          request_status: data.request_status,
          resources_given: data.resources_given,
          request_type: data.request_type,
          pathway: data.pathway,
          urgent: data.urgent,
          reason: data.reason || "",
          createdBy: data.createdby,
        })

        await historyData.save()
      })
    );

    return taskAdd;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error"
    })
  }
};

//FOR visitRequest
const visitRequest = async (visitId, userId, role, clientId) => {
  try {
    const taskAdd = await request.find({ request_by: clientId, isArchive: false }).populate({
      path: "resources_given",
      select: "resource_name _id organization"
    }).populate({
      path: "notWorkedResoruces",
      select: "resource_name _id organization"
    }).populate('request_type', '_id name').populate('pathway', '_id name')
    return taskAdd;
  } catch (error) {
    console.log(error);
    return InternalServerError(500, error);
  }
};

const totalRequestCount = async (req, res) => {
  const requestCount = await request.countDocuments({ _id: req.body.id, isArchive: false })

  return res.status(200).json(
    {
      status: true,
      message: 'Request lists',
      data: requestCount
    })
}

//FOR GET ALL REQUEST
const getAllRequests = async (req, res) => {
  try {
    let userId = req?.userId

    const { status, search } = req.body.filter || {};
    const { page, limit } = req.body.pagination

    let requestList = [];

    const query = { isArchive: false };

    if (status) {
      query.request_status = status;
    }

    const loginuser = await user?.findById(userId);
    //For filter
    if (req.role === "Program_Administrator" || req.role === "Super_Admin") {
      // Has all access
    }

    if (req.role === 'CHW') {
      query.assign_to = userId
    }

    if (search) {
      const nameRegex = new RegExp(search, "i");

      const usersMatchingSearch = await user.find({
        $or: [
          { firstName: nameRegex },
          { lastName: nameRegex },
          { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: nameRegex } } }
        ]
      });

      const userIds = usersMatchingSearch.map(user => user._id);

      query.request_by = { $in: userIds };
    }

    requestList = await request.find(query)
      .populate("assign_to", "id firstName lastName")
      .populate("request_by", "_id firstName lastName _id assign_to program")
      .populate("resources_given", "resource_name _id organization")
      .populate('request_type', "_id name")
      .sort({ urgent: -1, createdAt: -1 });

    requestList = requestList.filter(request => request.request_type && request.request_type !== '' && request.request_by !== ("" || undefined) && request.request_status !== "Cancelled" && request.request_status !== "Unsuccessful");

    if (loginuser?.role === 'Super_Admin') {
      // Super admin have all the access
    } else if (loginuser?.role === "Program_Administrator" && Array.isArray(loginuser.pa_program)) {
      requestList = requestList.filter(request =>
        request.request_by?.program && (loginuser.pa_program).includes(request.request_by.program)
      );
    } else if (loginuser?.role === "CHW") {
      const paData = await user.findOne({ _id: loginuser.pa_id })
      const programs = paData.pa_program

      if (Array.isArray(programs)) {
        requestList = requestList.filter(request =>
          request.request_by?.program && programs.includes(request.request_by.program)
        );

        requestList = requestList.filter(todo =>
          todo.request_by?.assign_to && todo.request_by.assign_to.toString() === userId.toString()
        );
      }
    }

    const startIndex = (page - 1) * limit;
    const paginatedArray = requestList.slice(startIndex, startIndex + limit);

    const newRequestCount = requestList?.filter((v) => v?.request_status === "Submitted")?.length
    const inProgressRequestCount = requestList?.filter((v) => v?.request_status === "In-Progress")?.length
    const completedRequestCount = requestList?.filter((v) => v?.request_status === "Completed")?.length

    return res.status(200).json(
      {
        status: true,
        message: 'Request lists',
        data: {
          requestList: paginatedArray,
          totalRequestCount: requestList.length,
          newRequestCount,
          inProgressRequestCount,
          completedRequestCount,
        }
      })

  } catch (error) {
    console.log(error)
    return InternalServerError(res, error)
  }
}

const getAllNewRequests = async (req, res) => {
  try {
    let userId = req?.userId;
    let requestList = [];
    const loginUser = await user?.findById(userId);
    const paProgram = loginUser.pa_program;

    let query = {};

    if (loginUser?.role === 'Super_Admin' || loginUser?.role === "Program_Administrator") {
      // Super admin & Program admin have all the access
    } else if (loginUser?.role === 'CHW') {
      query.assign_to = userId;
    }

    requestList = await request.find(query)
      .populate('request_type', '_id name')
      .populate("assign_to", "firstName lastName _id")
      .populate("request_by", "firstName lastName _id program")
      .populate({
        path: "resources_given",
        select: "resource_name -_id organization"
      })
      .sort({ urgent: -1, createdAt: -1 });

    requestList = requestList.filter(request => request.request_type && request.request_type !== '' && request.request_by !== ("" || undefined) && request.request_status !== "Cancelled" && request.request_status !== "Unsuccessful");

    if (loginUser?.role === 'Super_Admin') {
      // Super admin have all the access
    } else if (loginUser?.role === "Program_Administrator" && Array.isArray(paProgram)) {
      requestList = requestList.filter(request =>
        request.request_by?.program && paProgram.includes(request.request_by.program)
      );
    } else if (loginUser?.role === "CHW") {
      const paData = await user.findOne({ _id: loginUser.pa_id })
      const programs = paData.pa_program

      if (Array.isArray(programs)) {
        requestList = requestList.filter(request =>
          request.request_by?.program && programs.includes(request.request_by.program)
        );
      }
    }

    const totalRequestCount = requestList?.count;
    const newRequestCount = requestList?.filter((v) => v?.request_status === "Submitted")?.length;
    const inProgressRequestCount = requestList?.filter((v) => v?.request_status === "In-Progress")?.length;
    const completedRequestCount = requestList?.filter((v) => v?.request_status === "Completed")?.length;

    return res.status(200).json({
      status: true,
      message: 'Request lists',
      data: {
        requestList,
        totalRequestCount,
        newRequestCount,
        inProgressRequestCount,
        completedRequestCount,
      }
    });
  } catch (error) {
    console.log(error);
    return InternalServerError(res, error);
  }
};

//FOR SEARCH REQUEST
const searchRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const validUser = await user.findById(userId)
    const searchParameter = req.query.search;
    let searchQuery = {};

    if (validUser?.role === "Program_Administrator") {
      searchQuery = {
        $or: [
          { request_details: { $regex: searchParameter || '', $options: 'i' } },
          { request_type: { $regex: searchParameter || '', $options: 'i' } },
        ],
      };
    } else if (validUser?.role === "CHW") {
      const userData = await user.find({ assign_to: userId });
      const requestByArray = userData?.map((item, i) => item?._id);
      searchQuery = {
        $and: [
          { request_details: { $regex: searchParameter || "", $options: "i" } },
          { request_type: { $regex: searchParameter || "", $options: "i" } },
          { request_by: { $in: requestByArray } },
        ],
      };

    } else if (validUser?.role === "Client") {
      searchQuery = {
        $and: [
          { createdby: userId },
          { request_details: { $regex: searchParameter || "", $options: "i" } },
          { request_type: { $regex: searchParameter || "", $options: "i" } },
        ],
      };
    }

    searchQuery.isArchive = false;
    const requestData = await request.find(searchQuery).populate('assign_to').populate('createdby').populate('request_by')
    return res
      .status(200)
      .json({ status: true, message: "List of request", data: requestData });

  } catch (error) {
    console.log(error)
    return InternalServerError(res, error)
  }
}

const getSingleUserRequestLists = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ status: false, message: "Please provide a correct ID" });
    }

    // Fetch requests made by the user
    const requestCount = await request.countDocuments({
      request_by: userId,
      isArchive: false,
      request_status: { $in: ["Pending", "In-Progress"] }
    });

    // Fetch pathways with related data populated
    const fetchAllPathway = await actionPathwayModel.find({ userId: userId })
      .populate('pathwayId')
      .populate({
        path: 'requestId',
        populate: [
          { path: 'pathway' },
          { path: 'request_type' }
        ]
      })
      .lean();

    let filteredPathways = [];
    let totalRequestIdCount = 0; // Initialize total count of `requestId`

    if (fetchAllPathway.length > 0) {
      filteredPathways = fetchAllPathway.map((pathway) => {
        if (pathway.requestId && Array.isArray(pathway.requestId)) {
          const filteredRequests = pathway.requestId.filter(
            (request) => !request.isArchive && request.request_type !== ("" || undefined)
          );

          if (filteredRequests.length > 0) {
            totalRequestIdCount += filteredRequests.length;
            return { ...pathway, requestId: filteredRequests };
          } else {
            totalRequestIdCount += filteredRequests.length
            return {};
          }
        }
        return pathway;
      });
    }

    return res.status(200).json({
      status: true,
      message: "User request list",
      data: filteredPathways,
      requestCount: requestCount,
      totalPathways: filteredPathways?.length || 0,
      totalRequestIdCount // Include the total count of `requestId`
    });
  } catch (error) {
    console.log("error", error);
    return InternalServerError(res, error);
  }
};

//FOR GET SINGLE REQUEST
const getSingleRequest = async (req, res) => {
  try {
    const requestId = req.query?.id;
    const singleRequestData = await request.findById(requestId).populate("request_by", "firstName lastName _id").populate('resources_given', 'resource_name organization _id').populate({
      path: 'visitId',
      select: 'assign_to',
      populate: {
        path: 'assign_to',
        select: 'firstName lastName _id'
      }
    }).populate({
      path: 'assign_to',
      select: 'firstName lastName _id'
    }).populate({
      path: 'notWorkedResoruces',
      select: 'resource_name _id organization'
    }).populate('request_type', '_id name').populate('pathway', '_id name')

    return res
      .status(200)
      .json({ status: true, message: "Request data", data: singleRequestData });
  } catch (error) {
    console.log("error", error)
    return InternalServerError(res, error);
  }
};

//FOR UPDATE REQUEST
const updateRequest = async (req, res) => {
  try {
    const userId = req.userId
    const requestId = req.query?.id;
    const requestData = { ...req.body };

    if (requestData.request_status === "Accepted") {
      await addActivityRequest({ body: { userId: userId, requestId: requestId, status: "accepted" } });
      await user.findByIdAndUpdate(requestData?.clientId, { status: "Open" })
    } else if (requestData.request_status === "In-Progress") {
      await addActivityRequest({ body: { userId: userId, requestId: requestId, status: "assign" } });
    } else if (requestData.request_status === "Completed") {
      await addActivityRequest({ body: { userId: userId, requestId: requestId, status: "completed" } });
    }

    const findRequestData = await request.findOne({ _id: requestId }).lean()

    const resoruceOfFindRequest = findRequestData.resources_given || []
    const resoruceOfBody = requestData.resources_given || []

    const final = resoruceOfFindRequest.filter(function (item) {
      return !resoruceOfBody.includes(item.toString());
    });

    if (!requestData.notWorkedResoruces) {
      requestData.notWorkedResoruces = [];
    }
    requestData.notWorkedResoruces.push(...final);

    const updatedRequestData = await request.findByIdAndUpdate(requestId, { $set: requestData }, { new: true }).populate('assign_to', 'firstName lastName _id').populate("request_by", 'firstName lastName _id').populate({
      path: "resources_given",
      select: "resource_name _id organization",
    }).populate({
      path: "notWorkedResoruces",
      select: "resource_name _id organization",
    }).populate('request_type', 'name _id').populate('pathway', 'name')

    if (req.body.reason) {
      const statusHistory = new requestStatusHistory({
        currentStatus: req.body.oldStatus,
        newStatus: req.body.request_status,
        reason: req.body.reason,
        requestId: requestId,
        clientId: updatedRequestData.request_by,
        modifiedBy: req.userId
      });
      await statusHistory.save();
    }

    const latestHistory = await actionStepHistoryModel.findOne({ requestId: requestId }).sort({ createdAt: -1 });

    const isMatching = latestHistory &&
      latestHistory.request_by.toString() === req.body.request_by.toString() &&
      latestHistory.assign_to.toString() === req.body.assign_to.toString() &&
      latestHistory.request_details === req.body.request_details &&
      latestHistory.request_status === req.body.request_status &&
      latestHistory.resources_given.toString() === req.body.resources_given.toString() &&
      latestHistory.request_type === req.body.request_type &&
      latestHistory.urgent === req.body.urgent &&
      latestHistory.reason === req.body.reason;

    if (!isMatching) {
      const historyData = new actionStepHistoryModel({
        request_by: req.body.request_by,
        assign_to: req.body.assign_to,
        requestId: requestId,
        request_details: req.body.request_details,
        request_status: req.body.request_status,
        resources_given: req.body.resources_given,
        request_type: req.body.request_type,
        pathway: req.body.pathway,
        notWorkedResoruces: final,
        urgent: req.body.urgent,
        reason: req.body.reason,
        createdBy: latestHistory?.createdBy,
        modifiedBy: req.userId
      });
      await historyData.save();
    }

    return res.status(200).json({ status: true, message: 'Request updated', data: updatedRequestData })
  } catch (error) {
    console.log(error)
    return InternalServerError(res, error)
  }
}

//FOR DELETE REQUEST
const deleteRequest = async (req, res) => {
  try {
    const requestId = req.query?.id;
    const deletedRequest = await request.findByIdAndUpdate(requestId, { isArchive: true });

    return res
      .status(200)
      .json({ status: true, message: "Request deleted", data: deletedRequest });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

const multipleDeleteRequest = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      message: "Multiple request deleted successfully!",
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

const assignChwinRequest = async (req, res) => {
  try {
    const allRequests = await request
      .find({ isArchive: false })
      .populate('request_by', 'assign_to')
      .lean();

    for (const singleRequest of allRequests) {
      const { request_by } = singleRequest;

      if (request_by && request_by.assign_to) {
        const assignToChw = request_by.assign_to;
        await request.updateMany(
          { isArchive: false, request_by: request_by._id },
          { $set: { assigned_chw: assignToChw } },
          { new: true }
        );
      }
    }

    return res.status(200).json({ message: "CHW assignment updated successfully." });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

const updatePathwayData = async (req, res) => {
  try {

    if (Array.isArray(req.body.outcomes) && req.body.outcomes.length === 1 && req.body.outcomes[0] === '-') {
      return res.status(400).json({
        status: false,
        message: "Please select at least one outcome!",
      });
    }

    const updateData = await actionPathwayModel.findOneAndUpdate({ _id: req.body._id }, { $set: { ...req.body } }, { new: true })
      .populate('pathwayId')
      .populate({
        path: 'requestId',
        populate: [
          { path: 'pathway' },
          { path: 'request_type' }
        ]
      })
      .lean()

    return res
      .status(200)
      .json({ status: true, message: "Data updated successfully.", data: updateData });
  } catch (error) {
    return InternalServerError(res, error);
  }
}

const previoudRequestData = async (req, res) => {
  try {
    const requestBy = req.params.requestId;

    const fetchAllRequests = await request.find({
      request_by: requestBy,
      request_status: { $nin: ["Completed", "Unsuccessful", "Cancelled"] },
      isArchive: false
    })
      .populate('pathway', 'name _id need')
      .populate('resources_given', 'resource_name _id organization')
      .populate('request_type', 'name _id')
      .populate('assign_to', '_id firstName lastName')

    return res
      .status(200)
      .json({ status: true, message: "Pending or In-progress action step data listed successfully.", data: fetchAllRequests });
  } catch (error) {
    console.log("Error:", error)
    return InternalServerError(res, error);
  }
}

const removeDeletedResourceGiven = async (req, res) => {
  try {
    const findAllRequest = await request.find({ isArchive: false }).lean();

    const findAllResource = await resourceGiven.find({}, "_id").lean();
    const validResourceIds = findAllResource.map((resource) => resource._id.toString());

    for (const reqItem of findAllRequest) {
      if (Array.isArray(reqItem.resources_given)) {
        const updatedResourcesGiven = reqItem.resources_given.filter((id) =>
          validResourceIds.includes(id.toString())
        );

        if (
          reqItem.resources_given.length !== updatedResourcesGiven.length
        ) {
          await request.updateOne(
            { _id: reqItem._id },
            { $set: { resources_given: updatedResourcesGiven } }
          );
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "Deleted resources removed from all requests successfully.",
    });
  } catch (error) {
    console.log("Error:", error);
    return InternalServerError(res, error);
  }
};

module.exports = {
  getAllRequests,
  getSingleRequest,
  updateRequest,
  deleteRequest,
  multipleDeleteRequest,
  createRequest,
  getAllNewRequests,
  searchRequest,
  getSingleUserRequestLists,
  multipleRequest,
  visitRequest,
  assignChwinRequest,
  updatePathwayData,
  previoudRequestData,
  totalRequestCount,
  removeDeletedResourceGiven
}
