const { questionObjective, user } = require("../../models");
const { UnauthorizedError, InternalServerError } = require("../../utils/errorHandling");

const listObjectives = async (req, res) => {
    try {
        const role = req.role;
        if (role === "Program_Administrator" || role === "Super_Admin") {
            const listData = await questionObjective.find({ clientId: req.params.id }).populate({
                path: 'clientId',
                select: '_id firstName lastName'
            }).populate({
                path: 'modifiedBy',
                select: '_id firstName lastName'
            }).populate({
                path: 'createdBy',
                select: '_id firstName lastName'
            });

            const groupedData = {};
            listData.forEach(item => {
                const formattedDate = formatDate(item.createdAt);

                if (!groupedData[formattedDate]) {
                    groupedData[formattedDate] = [];
                }

                const finalData = {
                    labelData: formatObjectives(item, listData),
                    client: `${item.clientId?.firstName} ${item.clientId?.lastName}`,
                    modifiedBy: item.modifiedBy ? `${item.modifiedBy?.firstName} ${item.modifiedBy?.lastName}` : "",
                    createdBy: item.createdBy ? `${item.createdBy?.firstName} ${item.createdBy?.lastName}` : ""
                };
                groupedData[formattedDate].push(finalData);
            });

            const flattenedData = Object.entries(groupedData).map(async ([date, data]) => ({
                date,
                data: await Promise.all(data.flatMap(async item => ({
                    ...item,
                    labelData: await item.labelData
                })))
            }));

            let resolvedData = await Promise.all(flattenedData);

            resolvedData.sort((a, b) => new Date(b.date) - new Date(a.date));

            resolvedData.forEach(group => {
                group.data.sort((a, b) => new Date(b.labelData.createdAt) - new Date(a.labelData.createdAt));
            });

            return res.status(200).json({ status: true, message: "Visit history listed", data: resolvedData });
        } else {
            return UnauthorizedError(res, "User");
        }
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
}


const formatDate = (date) => {
    const formattedDate = new Date(date);
    const month = formattedDate.getMonth() + 1;
    const day = formattedDate.getDate();
    const year = formattedDate.getFullYear();
    return `${month}/${day}/${year}`;
}

const formatObjectives = (objective, listData) => {
    if (typeof objective === 'object' && objective !== null) {
        const { label, clientId, fromValue, value, createdAt } = objective;
        const capitalizedLabel = label?.charAt(0).toUpperCase() + label?.slice(1).replace(/Security/g, " Security");
        const result = {
            label: `${capitalizedLabel}`,
            fromValue: capitalizeFirstLetter(fromValue),
            value: capitalizeFirstLetter(value),
            createdAt: createdAt
        }
        return result;
    } else {
        return "Invalid objectives data";
    }
}

const capitalizeFirstLetter = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
};

module.exports = { listObjectives, formatDate };
