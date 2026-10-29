const pathwayModel = require("../../models/pathways")
const { InternalServerError } = require("../../utils/errorHandling")

const createPathway = async (req, res) => {
    try {
        const { name, description, need } = req.body

        const createdData = new pathwayModel({
            name: name,
            description: description,
            need: need
        })
        await createdData.save()

        return res.status(201).json({
            status: true,
            message: "Pathway created successfully",
            data: createdData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}

const updatePathway = async (req, res) => {
    try {
        const updatedData = await pathwayModel.findOneAndUpdate({ _id: req.body.id }, { $set: { ...req.body } }, { new: true })

        return res.status(200).json({
            status: true,
            message: "Pathway updated successfully",
            data: updatedData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}

const listAllPathways = async (req, res) => {
    try {
        const searchTerm = req.body.payload || '';

        const filter = { isArchive: false };

        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: 'i' };
        }

        const getAllData = await pathwayModel
            .find(filter)
            .populate('need', '_id name')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: true,
            message: "Pathway listed successfully",
            data: getAllData,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};


const deletePathway = async (req, res) => {
    try {
        const deleteData = await pathwayModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isArchive: true } }, { new: true })

        return res.status(200).json({
            status: true,
            message: "Pathway deleted successfully",
            data: deleteData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}

const listSinglePathway = async (req, res) => {
    try {
        const getSingleData = await pathwayModel.findOne({ _id: req.params.id }).populate('need', '_id name').lean()

        return res.status(200).json({
            status: true,
            message: "Pathway fetched successfully",
            data: getSingleData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}

const listPathwayOnBaseOfNeed = async (req, res) => {
    try {
        const getPathwayName = await pathwayModel
            .find({ need: { $in: req.body.payload }, isArchive: false })
            .populate('need', 'name _id')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: true,
            message: "Pathways fetched successfully based on need!",
            data: getPathwayName,
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

const listPathwayNames = async (req, res) => {
    try {
        const { search } = req.body;

        let userQuery = { isArchive: false };
        if (search) {
            userQuery.$or = [
                { name: { $regex: new RegExp(search, 'i') } },
            ];
        }

        const listData = await pathwayModel.find(userQuery);
        const answersML = listData
            .filter(item => item.name)
            .map(item => ({
                label: item.name,
                value: item._id
            }));

        return res.status(200).json({ status: true, message: "Data found", data: answersML });
    } catch (error) {
        console.log('error :', error);
        return InternalServerError(res, error);
    }
}

const getNeedName = async (req, res) => {
    try {
        const getName = await pathwayModel.findOne({ _id: req.body.payload }).populate('need', 'name _id').lean()

        return res.status(200).json({
            status: true,
            message: "Need name fetched successfully based on pathway name!",
            data: getName?.need,
        });
    } catch (error) {
        console.log("err", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve Needs or Categories'
        });
    }
}

const fetchOutcomes = async (req, res) => {
    try {
        const pathwayId = req.body.pathwayId

        const returnOutcomes = await pathwayModel.findOne({ _id: pathwayId })

        return res.status(200).json({
            status: true,
            message: "Outcomes fetched successfully based on pathwayid!",
            data: returnOutcomes,
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    createPathway,
    updatePathway,
    listAllPathways,
    deletePathway,
    listSinglePathway,
    listPathwayOnBaseOfNeed,
    listPathwayNames,
    getNeedName,
    fetchOutcomes
}