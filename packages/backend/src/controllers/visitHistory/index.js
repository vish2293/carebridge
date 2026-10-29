const { visitHistory } = require("../../models")
const { InternalServerError, UnauthorizedError } = require("../../utils/errorHandling")
const { formatDate } = require("../questionObjective")

const listVisitHistory = async (req, res) => {
    try {
        const role = req.role
        if (role === "Program_Administrator" || role === "Super_Admin") {
            const listData = await visitHistory.find({ visitId: req.params.id })
                .populate('clientId', 'firstName lastName _id')
                .populate('createdBy', 'firstName lastName _id')
                .populate('modifiedBy', 'firstName lastName _id')
                .populate('primaryNeed', '_id name')
                .populate('pathway', '_id name')

            const formatDate = (date) => {
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return new Intl.DateTimeFormat('default', options).format(new Date(date));
            };

            const groupedData = listData.reduce((acc, current) => {
                const createdAtDate = formatDate(current.createdAt);
                if (!acc[createdAtDate]) {
                    acc[createdAtDate] = [];
                }
                acc[createdAtDate].push(current);
                return acc;
            }, {});

            for (const date in groupedData) {
                groupedData[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            const result = Object.keys(groupedData).map(date => ({ date, data: groupedData[date] }));
            result.sort((a, b) => new Date(b.date) - new Date(a.date));

            return res.status(200).json({ status: true, message: "Visit history listed", data: result });
        } else {
            return UnauthorizedError(res, "User");
        }
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
}

module.exports = {
    listVisitHistory
}