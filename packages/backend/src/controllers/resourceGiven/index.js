const { resourceGivenModel, request } = require("../../models");
const resourceGiven = require("../../models/resourceGiven");
const resourceCategoryModel = require("../../models/rsoruceCastgeory");
const { InternalServerError } = require("../../utils/errorHandling");
const { trimStrings } = require("../../utils/trimSpace");

const createResource = async (req, res) => {
    try {
        const { resource_name, organization, resource_details, website, email, category, eligibility, phone, attachment_name } = req.body
        const userId = req.userId;
        const files = req.files;

        const fileLocations = files.map(file => file.location);

        const data = new resourceGivenModel({
            resource_name: resource_name.trim(),
            organization: organization.trim(),
            resource_details: resource_details.trim(),
            website: website.trim(),
            email: email.trim(),
            phone: phone.trim(),
            category: category,
            eligibility: eligibility.trim(),
            attachments: {
                name: attachment_name,
                files: fileLocations
            },
            createdBy: userId
        })

        await data.save()

        const populatedData = await resourceGivenModel.findById(data._id).populate({
            path: "createdBy",
            select: "firstName lastName _id"
        }).populate({
            path: "modifiedBy",
            select: "firstName lastName _id"
        }).populate({
            path: "category",
            select: "resource_category _id"
        })

        return res.status(200).json({
            status: true,
            message: "Resource given created",
            data: populatedData
        });
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error);
    }
}

const updateResource = async (req, res) => {
    try {
        const { id, isUpdated, isDeleted, attachments, ...updateFields } = req.body;
        let updateData = { ...updateFields, modifiedBy: req.userId };

        let fileUrls = [];
        if ((req.files && req.files.length > 0) || req.body.file_urls) {
            const uploadedFileUrls = req.files.map(file => file.location);
            if (req.body.file_urls) {
                if (typeof req.body.file_urls === 'string') {
                    fileUrls = [...uploadedFileUrls];
                    fileUrls.push(req.body.file_urls)
                } else {
                    fileUrls = [...req.body.file_urls, ...uploadedFileUrls];
                }
            } else {
                fileUrls = [...uploadedFileUrls]
            }
        }

        if (fileUrls.length > 0) {
            updateData.files = fileUrls;
        }

        if (isUpdated) {
            const transformedData = {
                resource_name: updateData.resource_name?.trim() || '',
                organization: updateData.organization?.trim() || '',
                resource_details: updateData.resource_details?.trim() || '',
                website: updateData.website?.trim() || '',
                email: updateData.email?.trim() || '',
                phone: updateData.phone?.trim() || '',
                category: updateData.category,
                eligibility: updateData.eligibility?.trim() || '',
                attachments: {
                    name: updateData.attachment_name?.trim(),
                    files: updateData.files || []
                },
                modifiedBy: req.userId
            };

            const updatedResource = await resourceGivenModel.findOneAndUpdate(
                { _id: id },
                { $set: transformedData },
                { new: true }
            )
                .populate({
                    path: "createdBy",
                    select: "firstName lastName _id"
                })
                .populate({
                    path: "modifiedBy",
                    select: "firstName lastName _id"
                })
                .populate({
                    path: "category",
                    select: "resource_category _id"
                });

            return res.status(200).json({
                status: true,
                message: "Resource given updated",
                data: updatedResource
            });
        } else if (isDeleted) {
            const deleteResource = await resourceGivenModel.findByIdAndUpdate(id, {
                $set: { isArchive: true }
            }, { new: true });

            return res.status(200).json({
                status: true,
                message: "Resource given deleted",
                data: deleteResource
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request"
            });
        }
    } catch (error) {
        console.log("error", error);
        return InternalServerError(res, error);
    }
};


const getAll = async (req, res) => {
    try {
        const { name, category } = req.body;

        let query = { isArchive: false };

        if (name) {
            const nameRegex = new RegExp(name, 'i');
            query.resource_name = nameRegex;
        }

        if (category) {
            query.category = category;
        }

        const getAllResources = await resourceGiven.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: "createdBy",
                select: "firstName lastName _id"
            })
            .populate({
                path: "modifiedBy",
                select: "firstName lastName _id"
            })
            .populate({
                path: "category",
                select: "resource_category _id"
            });

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

        const userDataWithCounts = getAllResources.map(resource => {
            const resourceIdStr = resource._id.toString();
            const usage = resourceUsageCounts[0].usedResources.find(count => count._id.toString() === resourceIdStr);
            const nonWorked = resourceUsageCounts[0].nonWorkedResources.find(count => count._id.toString() === resourceIdStr);

            return {
                ...resource,
                usageCount: usage ? usage.usedCount : 0,
                nonWorkedCount: nonWorked ? nonWorked.nonWorkedCount : 0
            };
        });

        userDataWithCounts.sort((a, b) => b.usageCount - a.usageCount);

        return res.status(200).json({
            status: true,
            message: "Resources listed",
            data: userDataWithCounts
        });
    } catch (error) {
        return InternalServerError(res, error);
    }
};

const getSingleResource = async (req, res) => {
    try {
        const getSingle = await resourceGiven.findOne({ _id: req.params.id }).lean()

        return res.status(200).json({
            status: true,
            message: "Resources given fetched ",
            data: getSingle
        });
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error);
    }
}

const craeteCategory = async (req, res) => {
    try {
        const { name } = req.body

        const data = await resourceCategoryModel({
            resource_category: name,
            createdBy: req.userId
        })

        await data.save()

        const populatedData = await resourceCategoryModel.findById(data._id).populate({
            path: "createdBy",
            select: "firstName lastName _id"
        }).populate({
            path: "modifiedBy",
            select: "firstName lastName _id"
        })

        return res.status(200).json({
            status: true,
            message: "Resource category created",
            data: populatedData
        });

    } catch (error) {
        return InternalServerError(res, error);
    }
}

const updateCategory = async (req, res) => {
    try {
        if (req.body.isUpdated === true) {
            const updatedResource = await resourceCategoryModel.findOneAndUpdate(
                { _id: req.body.id },
                { $set: { ...req.body, modifiedBy: req.userId } },
                { new: true }
            ).populate({
                path: "createdBy",
                select: "firstName lastName _id"
            }).populate({
                path: "modifiedBy",
                select: "firstName lastName _id"
            })

            return res.status(200).json({
                status: true,
                message: "Resource category updated",
                data: updatedResource
            })
        } else if (req.body.isDeleted === true) {
            const deleteResource = await resourceCategoryModel.findByIdAndUpdate(req.body.id, {
                $set: { isArchive: true }
            }, { new: true })

            return res.status(200).json({
                status: true,
                message: "Resource category deleted",
                data: deleteResource
            })
        }
    } catch (error) {
        console.log("error", error);
        return InternalServerError(res, error);
    }
}

const getAllCategory = async (req, res) => {
    try {
        const nameRegex = new RegExp(req.body.name, 'i');

        const getAllResources = await resourceCategoryModel.find({ $and: [{ resource_category: nameRegex, isArchive: false }] }).sort({ createdAt: -1 }).populate({
            path: "createdBy",
            select: "firstName lastName _id"
        }).populate({
            path: "modifiedBy",
            select: "firstName lastName _id"
        })

        return res.status(200).json({
            status: true,
            message: "Resource given listed",
            data: getAllResources
        })
    } catch (error) {
        return InternalServerError(res, error);
    }
}

const listResoruceCategory = async (req, res) => {
    try {
        const { search } = req.body;

        let userQuery = { isArchive: false };
        if (search) {
            userQuery.$or = [
                { resource_category: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const listData = await resourceCategoryModel.find(userQuery);
        const answersML = listData
            .filter(item => item.resource_category)
            .map(item => ({
                label: item.resource_category,
                value: item._id
            }));

        return res.status(200).json({ status: true, message: "Data found", data: answersML });
    } catch (error) {
        console.log('error :', error);
        return InternalServerError(res, error);
    }
}

const listResoruceNames = async (req, res) => {
    try {
        const { search } = req.body;

        let userQuery = { isArchive: false };
        if (search) {
            userQuery.$or = [
                { resource_name: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const listData = await resourceGivenModel.find(userQuery);
        const answersML = listData
            .filter(item => item.resource_name)
            .map(item => ({
                label: item.resource_name,
                value: item._id
            }));

        return res.status(200).json({ status: true, message: "Data found", data: answersML });
    } catch (error) {
        console.log('error :', error);
        return InternalServerError(res, error);
    }
}

const listResourceOrganization = async (req, res) => {
    try {
        const { search } = req.body;

        let userQuery = { isArchive: false };
        if (search) {
            userQuery.$or = [
                { organization: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const listData = await resourceGivenModel.find(userQuery);
        const answersML = listData
            .filter(item => item.organization)
            .map(item => ({
                label: item.organization,
                value: item._id
            }));

        return res.status(200).json({ status: true, message: "Data found", data: answersML });
    } catch (error) {
        console.log('error :', error);
        return InternalServerError(res, error);
    }
}

module.exports = {
    createResource,
    updateResource,
    getAll,
    getSingleResource,
    craeteCategory,
    updateCategory,
    getAllCategory,
    listResoruceCategory,
    listResoruceNames,
    listResourceOrganization
}