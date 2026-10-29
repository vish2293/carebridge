const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    answer: {
        type: String,
    },
    _id: false
});

const profileQuestionSchema = new mongoose.Schema({
    _id: false,
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile_question'
    },
    answer: [answerSchema]
});

const userSchema = mongoose.Schema(
    {
        assign_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        firstName: {
            type: String,
            required: true
        },
        profileQuestionBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
        },
        userName: {
            type: String,
            trim: true
        },
        profileImage: {
            type: String
        },
        address: {
            type: String,
        },
        Phone: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        city: {
            type: String,
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Open", "Closed-Inactive", "Closed-Success"]
        },
        birthDate: {
            type: String,
        },
        password: {
            type: String,
        },
        visit_type: { type: String },
        requests: {
            type: Array,
        },
        request_details: { type: String },
        is_Verified: { type: Boolean, default: false },
        isSuspended: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: { type: String },
        role: {
            type: String,
            enum: ["Super_Admin", "Program_Administrator", "CHW", "Client"]
        },
        isChw_Assign: {
            type: Boolean,
            default: false
        },
        createdDate: { type: String },
        followupDate: { type: String },
        changeMailMetaKey: {
            type: String,
        },
        tempEmail: {
            type: String,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            trim: true,
        },
        permissions: {
            type: Array
        },
        isArchive: {
            type: Boolean,
            default: false
        },
        profileQuestion: [profileQuestionSchema],
        program: { type: String },
        objective: [
            {
                _id: false,
                label: { type: String },
                value: { type: String }
            }
        ],
        lastLoginTime: {
            type: Date,
            default: null,
        },
        tokens: [
            {
                _id: false,
                token: {
                    type: String,
                    default: null,
                },
            },
        ],
        isCsvUpload: {
            type: Boolean,
            default: false
        },
        modifiedProfileQuestions: [{
            _id: false,
            modifiedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            createdAt: {
                type: Date,
                default: new Date()
            }
        }],
        isDuplicate: {
            type: Boolean,
            default: false
        },
        client_goal: {
            type: String
        },
        token: {
            type: String
        },
        token_expiry_time: {
            type: Date
        },
        otp: {
            type: String
        },
        otp_expiry_time: {
            type: Date
        },
        is_set_pwd: {
            type: Boolean,
            default: false
        },
        is_reset_pwd: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDetailCompleted: {
            type: Boolean,
            default: true
        },
        mergedWith: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],
        isReassessment: {
            type: Boolean,
            default: false
        },
        reassessmentDate: {
            type: Date
        },
        memberGroup: {
            type: String,
        },
        pa_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        pa_program: [{
            type: String
        }],
        metaKey: {
            type: String
        },
        metaKeyTimeLimit: {
            type: Date
        },
        is_pa_pwd_set: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
