const mongoose = require('mongoose')

const programAdminSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    zipcode: {
        type: String
    },
    program: [{
        type: String
    }],
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "Program_Administrator"
    },
    profileImage: {
        type: String
    },
    is_set_pwd: {
        type: Boolean,
        default: false
    },
    metaKey: {
        type: String
    },
    timeLimit: {
        type: Date
    },
    isArchive: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const programAdminModel = mongoose.model("Program_Admin", programAdminSchema)
module.exports = programAdminModel