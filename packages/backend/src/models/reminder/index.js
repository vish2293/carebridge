const mongoose = require("mongoose");

const reminderSchema = mongoose.Schema(
    {        
        reminder_by:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
        is24Hours:{type:String,default:false},
        is12Hours:{type:String,default:false},
        is30Minutes:{type:String,default:false}                 
    },
    {
        timestamps: true,
    }
);

const reminder = mongoose.model("reminder", reminderSchema);
module.exports = reminder;
