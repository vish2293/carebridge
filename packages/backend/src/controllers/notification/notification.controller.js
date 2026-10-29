const notificationModel = require("../../models/notification/notification.model")
const user = require("../../models/users")
const { isValidObjectId } = require('mongoose');
const { InternalServerError } = require("../../utils/errorHandling")

const createReminders = async (req, res) => {
    try {
        const { reminders } = req.body
        const userId = req.userId;
        const pmOrNot = await user.findOne({ _id: userId }).select('_id role');
        if (pmOrNot.role === 'Program_Administrator') {

            let finalData = await notificationModel.insertMany(reminders);

            return res.status(200).json({
                status: true,
                message: "Reminder set-up successfully",
                data: finalData
            })
        } else {
            return res.status(403).json({ status: true, message: "You can't access this route" })
        }
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error)
    }
}

const updateReminder = async (req, res) => {
    try {
        const userId = req.userId

        const pmOrNot = await user.findOne({ _id: userId }).select('_id role')

        if (pmOrNot.role === 'Program_Administrator') {

            if (!req.query.id || !isValidObjectId(req.query.id)) {
                return res.status(400).json({ status: false, message: "Please provide a correct ID" });
            }

            const updateReminderData = await notificationModel.updateOne({ _id: req.query.id }, { $set: req.body }).lean()

            return res.status(200).json({
                status: true,
                message: "Reminder update successfully",
                data: updateReminderData
            })
        } else {
            return res.status(403).json({ status: true, message: "You can't access this route" })
        }
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error)
    }
}

const getReminderList = async (req, res) => {
    try {
        const getListOfReminder = await notificationModel.find()

        return res.status(200).json({
            status: true,
            message: "Reminder listed successfully",
            data: getListOfReminder
        })
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error)
    }
}

const deleteReminders = async (req, res) => {
    try {
        const userId = req.userId;
        const pmOrNot = await user.findOne({ _id: userId }).select('_id role')

        if (pmOrNot.role === 'Program_Administrator') {

            const deleteReminderDara = await notificationModel.deleteOne({ _id: req.params.id })

            return res.status(200).json({
                status: true,
                message: "Reminder delete successfully",
                data: deleteReminderDara
            })
        } else {
            return res.status(403).json({ status: true, message: "You can't access this route" })
        }
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error)
    }
}

const getSingleReminder = async (req, res) => {
    try {
        const id = req.userId;
        const getReminder = await notificationModel.findOne({ createdBy: id })

        return res.status(200).json({
            status: true,
            message: "Reminder get successfully",
            data: getReminder
        })
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error)
    }
}
module.exports = {
    createReminders,
    updateReminder,
    getReminderList,
    deleteReminders,
    getSingleReminder
}