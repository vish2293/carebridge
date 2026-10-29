const mongoose = require("mongoose");

const contactUsSchemma = mongoose.Schema(
    {    
        fullName:{
            type:String,            
        },
        email:{
            type: String,
        },
        message:{
            type:String
        },
        description:{
            type:Array
        },
    },
    {
        timestamps: true,
        unique: false,
    }
);

const contactUs = mongoose.model("contact_us", contactUsSchemma);
module.exports = contactUs;
