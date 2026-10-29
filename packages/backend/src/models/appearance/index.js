const mongoose = require("mongoose");

const appearanceSchema = mongoose.Schema({
    buttonTextColor: {
        type: String,
        default: '#000000'
    },
    textColor: {
        primary: {
            type: String,
            default: '#3D353D'
        },
        secondary: {
            type: String,
            default: '#686268'
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        isSecondary: {
            type: Boolean,
            default: false
        }
    },
    buttonColor: {
        primary: {
            type: String,
            default: '#FEBC5A'  
        },
        secondary: {
            type: String,
            default: '#000000'
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        isSecondary: {
            type: Boolean,
            default: false
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
});

const appearanceModel = mongoose.model("apperance", appearanceSchema);
module.exports = appearanceModel;