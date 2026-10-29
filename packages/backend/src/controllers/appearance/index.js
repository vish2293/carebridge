const { apperance } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");

const createApperance = async (req, res) => {
    try {
        const role = req.role

        if (role === "Program_Administrator" || role === "Super_Admin") {
            const { textColor, buttonColor, buttonTextColor } = req.body

            const saveApperance = new apperance({
                textColor: textColor,
                buttonColor: buttonColor,
                buttonTextColor: buttonTextColor,
                createdBy: req.userId
            })

            await saveApperance.save()

            return res.status(201).json({
                status: true,
                message: "Save the apperance",
                data: saveApperance
            })
        } else {
            return res.status(403).json({
                status: false,
                message: "You don't have access of the route"
            })
        }
    } catch (error) {
        console.error(error);
        return InternalServerError(res, error);
    }
}

const getApperance = async (req, res) => {
    try {
        const role = req.role

        // if (role === "Program_Administrator" || role === "Super_Admin") {
        // const getApperanceData = await apperance.findOne({ createdBy: req.userId })
        const getApperanceData = await apperance.find({})

        return res.status(201).json({
            status: true,
            message: "Save the apperance",
            data: getApperanceData[0]
        })
        // } else {
        //     return res.status(403).json({
        //         status: false,
        //         message: "You don't have access of the route"
        //     })
        // }
    } catch (error) {
        console.error(error);
        return InternalServerError(res, error);
    }
}

const updateApperance = async (req, res) => {
    try {
        const role = req.role

        if (role === "Program_Administrator" || role === "Super_Admin") {
            const updateApperanceData = await apperance.findOneAndUpdate({
                createdBy: req.userId
            }, {
                $set: req.body
            }, { new: true })

            return res.status(201).json({
                status: true,
                message: "Save the apperance",
                data: updateApperanceData
            })
        } else {
            return res.status(403).json({
                status: false,
                message: "You don't have access of the route"
            })
        }

    } catch (error) {
        console.error(error);
        return InternalServerError(res, error);
    }
}

module.exports = {
    createApperance,
    getApperance,
    updateApperance
}