const mongoose = require("mongoose");

const activityRequestSchemma = mongoose.Schema(
    {        
        userId:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },  
        requestId:{ type: mongoose.Schema.Types.ObjectId, ref: "request" },  
        status: { type: String },
        other: { type: mongoose.Schema.Types.Mixed }
    },
    {
        timestamps: true,
    }
);

const activityRequest = mongoose.model("activity_request", activityRequestSchemma);
module.exports = activityRequest;
