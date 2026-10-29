const { user } = require("../../models");
const notesModel = require("../../models/notes")

const createNotes = async (req, res) => {
    try {
        const notesArray = req.body.notes;

        if (!Array.isArray(notesArray) || notesArray.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Invalid input: notes should be a non-empty array"
            });
        }

        const notesDataArray = notesArray.map(note => ({
            clientId: note.clientId,
            contactType: note.contactType,
            dateOfAttempts: note.dateOfAttempts,
            status: note.status,
            description: note.description,
            createdBy: req.userId
        }));

        const savedNotes = await notesModel.insertMany(notesDataArray)

        const populatedNotes = await notesModel.find({
            _id: { $in: savedNotes.map(note => note._id) }
        }).populate({
            path: "createdBy",
            select: "firstName lastName _id"
        }).populate({
            path: "modifiedBy",
            select: "firstName lastName _id"
        }).sort({ createdAt: -1 });

        let userData;
        for (const note of savedNotes) {
            const lastThreeNotes = await notesModel.find({
                clientId: note.clientId,
                isArchive: false
            }).sort({ createdAt: -1 }).limit(3);

            if (lastThreeNotes.length === 3) {
                const allNotAnswered = lastThreeNotes.every(note => note.status === 'Not-Answered');
                if (allNotAnswered) {
                    userData = await user.findOneAndUpdate({ _id: savedNotes[0].clientId }, { $set: { isActive: false } }, { new: true }).populate({
                        path: "assign_to",
                        select: "firstName lastName _id"
                    }).populate('profileQuestion.question');
                }
                else {
                    userData = await user.findOneAndUpdate({ _id: savedNotes[0].clientId }, { $set: { isActive: true } }, { new: true }).populate({
                        path: "assign_to",
                        select: "firstName lastName _id"
                    }).populate('profileQuestion.question');
                }
            } else {
                userData = await user.findOneAndUpdate({ _id: savedNotes[0].clientId }, { $set: { isActive: true } }, { new: true }).populate({
                    path: "assign_to",
                    select: "firstName lastName _id"
                }).populate('profileQuestion.question');
            }
        }

        return res.status(201).json({
            status: true,
            message: "Notes added successfully",
            data: populatedNotes,
            userData: userData
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const getAll = await notesModel.find({ clientId: req.body.clientId, isArchive: false }).populate({
            path: "createdBy",
            select: "firstName lastName _id"
        }).populate({
            path: "modifiedBy",
            select: "firstName lastName _id"
        }).sort({ dateOfAttempts: -1 })

        return res.status(201).json({
            status: true,
            message: "Notes listed successfully",
            data: getAll,
            count: getAll.length
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error
        });
    }
}

const updateDeleteNotes = async (req, res) => {
    try {
        let responseMessage = "";
        let data;

        if (req.body.isUpdated === true) {
            data = await notesModel.findOneAndUpdate(
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

            responseMessage = "Notes updated";
        } else if (req.body.isDeleted === true) {
            data = await notesModel.findByIdAndUpdate(req.body.id, {
                $set: { isArchive: true }
            }, { new: true });

            responseMessage = "Notes deleted";
        }

        const clientId = req.body.clientId;
        const lastThreeNotes = await notesModel.find({ clientId: clientId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('status');

        const allNotAnswered = lastThreeNotes.every(note => note.status === 'Not-Answered');

        let userData = await user.findByIdAndUpdate(clientId, {
            $set: { isActive: !allNotAnswered }
        }, { new: true }).select('_id, firstName lastName isActive')

        return res.status(200).json({
            status: true,
            message: responseMessage,
            data: data,
            userData: userData
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error
        });
    }
};

module.exports = {
    createNotes,
    getAllNotes,
    updateDeleteNotes
}