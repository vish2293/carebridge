const needOrCategoryModel = require("../../models/needOrCategory");

const createNeedOrCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (Array.isArray(name) && name.length > 0) {
            const needOrCategoryData = name.map((n) => ({
                name: n
            }));

            const createdNeedsOrCategories = await needOrCategoryModel.insertMany(needOrCategoryData);

            return res.status(201).json({
                success: true,
                data: createdNeedsOrCategories,
                message: 'Needs or Categories added successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid data, name should be an array'
            });
        }
    } catch (error) {
        console.log("err", error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const listNeedOrCategory = async (req, res) => {
    try {
        const getAll = await needOrCategoryModel.find({ }).lean();

        const formattedData = getAll.map(item => ({
            label: item.name,
            value: item._id
        }));

        return res.status(200).json({
            success: true,
            data: formattedData,
            message: 'Needs or Categories retrieved successfully'
        });
    } catch (error) {
        console.log("err", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve Needs or Categories'
        });
    }
}

const samenameRemove = async (req, res) => {
    try {
        const { names } = req.body; // Assuming the names are passed as an array in the request body

        // Check if names are provided and is an array
        if (!Array.isArray(names) || names.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Names array is required and should not be empty'
            });
        }

        // Fetch all records from the database
        const allRecords = await needOrCategoryModel.find(); // Fetch all "Need" or "Category" records

        // Check if no records are found
        if (allRecords.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No records found'
            });
        }

        // Filter the records that match any name in the array
        const matchingRecords = allRecords.filter(record => names.includes(record.name));

        // If no matching records, return an appropriate response
        if (matchingRecords.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No records found matching the names in the array`
            });
        }

        // Now, remove all matching records by their names
        const result = await needOrCategoryModel.deleteMany({ name: { $in: names } });

        return res.status(200).json({
            success: true,
            message: `Successfully removed ${result.deletedCount} record(s) with the names ${names.join(', ')}`,
            removedRecords: matchingRecords
        });

    } catch (error) {
        console.log("err", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to remove records'
        });
    }
};

module.exports = {
    createNeedOrCategory,
    listNeedOrCategory,
    samenameRemove
}