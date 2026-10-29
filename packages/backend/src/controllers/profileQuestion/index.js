const { profileQuestion, user } = require("../../models");
const { InternalServerError } = require("../../utils/errorHandling");
const { trimStrings } = require("../../utils/trimSpace");

const checkCategory = async (req, res) => {
    try {
        const allCategories = await profileQuestion.find({
            category: { $exists: true, $ne: "" },
        }).select('category isArchive createdAt -_id').sort({ createdAt: -1 });

        const categorizedData = Object.values(allCategories.reduce((acc, category) => {
            const existingCategory = acc[category.category];
            if (!existingCategory || existingCategory.createdAt < category.createdAt) {
                acc[category.category] = {
                    label: category.category,
                    value: category.category,
                    disabled: category.isArchive === true ? false : true
                };
            }
            return acc;
        }, {}));

        return res.status(200).json({
            status: true,
            message: "Data listed",
            data: {
                categories: categorizedData
            }
        });
    } catch (error) {
        console.log(error);
        return InternalServerError(res, error);
    }
};

const updateMultipleQuestion = async (req, res) => {
    try {
        const payload = req.body;

        if (!Array.isArray(payload) || payload.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Invalid payload'
            });
        }

        const bulkOperations = payload.map(item => ({
            updateOne: {
                filter: { _id: item._id },
                update: {
                    $set: {
                        selected: item.selected,
                        sequence: item.sequence
                    }
                }
            }
        }));

        await profileQuestion.bulkWrite(bulkOperations);

        const updatedQuestions = await profileQuestion.find({ isArchive: false }).sort({ sequence: 1 });

        return res.status(200).json({
            status: true,
            message: 'Questions updated successfully',
            data: updatedQuestions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const addQuestionNumber = async (req, res) => {
    try {
        const questions = await profileQuestion.find().sort({ _id: 1 });

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            await profileQuestion.updateOne(
                { _id: question._id },
                { $set: { questionNumber: i + 1 } }
            );
        }

        return res.status(201).json({
            status: true,
            message: "Question number added"
        })
    } catch (error) {
        console.log("error", error);
    }
};

const addSequenceNumber = async (req, res) => {
    try {
        const questions = await profileQuestion.find().sort({ _id: 1 });

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            await profileQuestion.updateOne(
                { _id: question._id },
                { $set: { sequence: i + 1 } }
            );
        }

        return res.status(201).json({
            status: true,
            message: "Sequence number added"
        })
    } catch (error) {
        console.log("error", error);
    }
};

const updateQuestionNumbers = async (req, res) => {
    try {
        const payload = req.body;

        if (!Array.isArray(payload) || payload.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Invalid payload'
            });
        }

        const bulkOperations = payload.map(item => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $set: { questionNumber: item.questionNumber } }
            }
        }));

        await profileQuestion.bulkWrite(bulkOperations);

        const updatedQuestions = await profileQuestion.find({ isArchive: false }).sort({ questionNumber: 1 });

        return res.status(200).json({
            status: true,
            message: 'Question numbers updated successfully',
            data: updatedQuestions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const createQuestion = async (req, res) => {
    try {
        const createdBy = req.userId;
        const { questionML, category, answers, short_desc, isMapped } = req.body;

        const lastQuestion = await profileQuestion.findOne().sort({ questionNumber: -1 });

        const newQuestionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;

        const newQuestion = new profileQuestion({
            createdBy: createdBy.trim(),
            category: category.trim(),
            questionML: Array.isArray(questionML) ? questionML.map(q => ({
                ...q,
                value: typeof q.value === 'string' ? q.value.trim() : q.value
            })) : questionML,
            answers: {
                answer_type: typeof answers.answer_type === 'string' ? answers.answer_type.trim() : answers.answer_type,
                answersML: Array.isArray(answers.answersML) ? answers.answersML.map(a => ({
                    ...a,
                    value: typeof a.value === 'string' ? a.value.trim() : a.value
                })) : (typeof answers.answersML === 'string' ? answers.answersML.trim() : answers.answersML)
            },
            short_desc: Array.isArray(short_desc) ? short_desc.map(s => ({
                ...s,
                value: typeof s.value === 'string' ? s.value.trim() : s.value
            })) : short_desc,
            isMapped: isMapped,
            questionNumber: newQuestionNumber
        });

        await newQuestion.save();

        const sortedQuestions = await profileQuestion.find({ isArchive: false }).sort({ questionNumber: 1 });

        return res.status(200).json({
            status: true,
            data: sortedQuestions
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getAllQuestion = async (req, res) => {
    try {
        const questionList = await profileQuestion.find({ isArchive: false }).sort({ questionNumber: 1 });

        return res.status(200).json({
            status: true,
            data: {
                questionList,
            }
        })
    } catch (error) {
        console.log('error', error)
        return InternalServerError(res, error)
    }
}

const getAllQuestionsss = async (req, res) => {
    try {
        const questionList = await profileQuestion.find({ isArchive: false }).sort({ questionNumber: 1 });

        return res.status(200).json({
            status: true,
            data: {
                questionList,
            }
        })
    } catch (error) {
        console.log('error', error)
        return InternalServerError(res, error)
    }
}

const updateQuestion = async (req, res) => {
    try {
        const questionId = req.body.id;
        const questionData = req.body.questionData;

        const updatedQuestionData = await profileQuestion.findOneAndUpdate(
            { _id: questionId },
            { $set: questionData },
            { new: true }
        );

        return res.status(200).json({
            status: true,
            message: "Question updated",
            data: updatedQuestionData
        });
    } catch (error) {
        return InternalServerError(res, error);
    }
};


const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.body?.id;
        const deletedQuestionData = await profileQuestion.findByIdAndUpdate(questionId, { isArchive: true }, { new: true })
        return res.status(200).json({ status: true, message: "Question Deleted", data: deletedQuestionData })
    } catch (error) {
        return InternalServerError(res, error)
    }
}

const getDemography = async (req, res) => {
    try {
        const questionList = await profileQuestion.find({ isArchive: false }).sort({ sequence: 1 });

        return res.status(200).json({
            status: true,
            data: {
                questionList,
            }
        })
    } catch (error) {
        return InternalServerError(res, error)
    }
}

module.exports = {
    createQuestion,
    getAllQuestion,
    updateQuestion,
    deleteQuestion,
    checkCategory,
    updateMultipleQuestion,
    getAllQuestionsss,
    updateQuestionNumbers,
    addQuestionNumber,
    addSequenceNumber,
    getDemography
}