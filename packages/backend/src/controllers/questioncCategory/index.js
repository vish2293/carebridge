const { error } = require("console");
const { questionCategory } = require("../../models");
const { UnauthorizedError, InternalServerError, NotFoundError } = require("../../utils/errorHandling");

//FOR CREATE CATEGORY CONTROLLER
const createCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const { category } = req.body

        if (!category) {
            return res.status(400).json({ status: "fail", message: "Please enter category" })
        }
        if (!userId) {
            return UnauthorizedError(res, "User")
        }
        const categoryData = new questionCategory({
            created_by:userId,
            category
        })
        await categoryData.save()
        return res.status(201).json({ status: true, message: "Category Added", data: categoryData })
    } catch (error) {
        console.log('err', error)
        return InternalServerError(res, error)
    }
}
//FOR GET ALL CATEGORY CONTROLLER
const allCategory = async (req, res) => {
    try {

        const userId = req.userId

        if (!userId) {
            return UnauthorizedError(res, "User")
        }

        const categoryList = await questionCategory.find({})
        return res.status(200).json({ status: true, message: "Question category list", data: categoryList })


    } catch (error) {
        console.log('err', error)
        return InternalServerError(res, error)
    }
}

//FOR GET SINGLE CATEGORY CONTROLLER
const singleCategory = async (req, res) => {
    try {

        const userId = req.userId
        const questionCategoryId = req.query?.id;
        if (!userId) {
            return UnauthorizedError(res, "User")
        }
        const categoryDetail = await questionCategory.findOne(questionCategoryId)
        return res.status(200).json({ status: true, message: "Question category detail", data: categoryDetail })

    } catch (error) {

        console.log('err', error)
        return InternalServerError(res, error)
    }
}

//FOR UPDATE CATEGORY CONTROLLER
const updateCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const categoryData = { ...req.body }
        const questionCategoryId = req.query?.id;
        if(!questionCategoryId){
            return NotFoundError(res,"Question")
        }
        if (!userId) {
            return UnauthorizedError(res, "User")
        }
        const updatedCategoryData = await questionCategory.findByIdAndUpdate(questionCategoryId, categoryData, { new: true })
        return res.status(201).json({ status: true, message: "Question category updated", data: updatedCategoryData })
    } catch (error) {
        console.log('err', error)
        return InternalServerError(res, error)
    }
}
//FOR DELETE CATEGORY CONTROLLER
const deleteCategory = async (req, res) => {
    try {
        const userId = req.userId;
        const questionCategoryId = req.query?.id;
        if(!questionCategoryId){
            return NotFoundError(res,"Question")
        }
        if (!userId) {
            return UnauthorizedError(res, "User")
        }
        const deleteCategoryData = await questionCategory.findByIdAndUpdate(questionCategoryId, {isArchive: true})
        return res.status(200).json({ status: true, message: "Question category deleted", data: deleteCategoryData })
    } catch (error) {
        console.log('err', error)
        return InternalServerError(res, error)
    }
}

module.exports = {
    createCategory,
    allCategory,
    singleCategory,
    updateCategory,
    deleteCategory
}