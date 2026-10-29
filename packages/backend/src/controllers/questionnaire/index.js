const { InternalServerError } = require("../../utils/errorHandling");

const createQuestions = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("error", error)
        return InternalServerError(res, error);
    }
}