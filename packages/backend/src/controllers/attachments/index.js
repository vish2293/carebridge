
const attachmentsModel = require("../../models/attachemts");
const { deleteFile } = require("../../services/file");
const { InternalServerError } = require("../../utils/errorHandling");

const addAttachments = async (req, res) => {
    try {
        const { name, clientId } = req.body;
        const files = req.files;

        const fileLocations = files?.map(file => file.location);

        const storeData = new attachmentsModel({
            name: name.trim(),
            clientId: clientId,
            files: fileLocations
        });

        await storeData.save();

        return res.status(201).json({
            status: true,
            data: storeData
        }); 

    } catch (error) {
        console.log("error", error);
        return InternalServerError(res, error);
    }
};

const updateAttachments = async (req, res) => {
    try {
        const deleteFileData = await attachmentsModel.findById(req.body.id);

        if (!deleteFileData) {
            return res.status(404).json({ status: false, message: "Attachment not found" });
        }

        deleteFile(deleteFileData.files);

        const files = JSON.parse(req.body.files);

        const updateData = await attachmentsModel.findByIdAndUpdate(
            req.body.id,
            { $set: { files: files } },
            { new: true }
        );

        return res.status(201).json({
            status: true,
            data: updateData
        });
    } catch (error) {
        console.log("error", error);
        return InternalServerError(res, error);
    }
};

const deleteAttachments = async (req, res) => {
    try {
        const deleteData = await attachmentsModel.findOneAndUpdate({
            _id: req.body.id
        }, {
            $set: { isArchive: true }
        }, {
            new: true
        })

        return res.status(201).json({
            status: true,
            data: deleteData
        });
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error);
    }
}

const getSingleAttachmentRecord = async (req, res) => {
    try {
        const getSingle = await attachmentsModel.findOne({ _id: req.body.attachmentId })

        return res.status(201).json({
            status: true,
            data: getSingle
        });
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error);
    }
}

const listAllAttachments = async (req, res) => {
    try {
        const getAttachemnts = await attachmentsModel.find({ clientId: req.body.clientId, isArchive: false })
        return res.status(201).json({
            status: true,
            data: getAttachemnts
        });
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error);
    }
}

module.exports = {
    addAttachments,
    deleteAttachments,
    updateAttachments,
    getSingleAttachmentRecord,
    listAllAttachments
};
