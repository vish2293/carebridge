const { reminders } = require("../../models");
const { InternalServerError, NotFoundError } = require("../../utils/errorHandling")

// FOR CREATE REMINDER
const createReminder=async(req,res)=>{
    try {
        const userId=req.userId;
        if(!userId){
            return NotFoundError(res,'User')
        }
        const {is24Hours,is12Hours,is30Minutes}=req.body;

        const reminderData=new reminders({
            reminder_by:userId,
            is24Hours,
            is12Hours,
            is30Minutes
        })
        await reminderData.save()
        return res.status(200).json({status:true,message:"reminder is create",data:reminderData})
    } catch (error) {
        console.log('error',error)
        return InternalServerError(res,error)
    }
}

// FOR UPDATE REMINDER

const updateReminder=async(req,res)=>{
    try {
        const userId=req.userId;
        const reminderId=req.query?.id;
        const updateData={...req.body};

        const updatedReminder=await reminders.findByIdAndUpdate(reminderId,updateData,{new:true})

        return res.status(200).json({status:true,message:'Reminder updated',data:updatedReminder})       
        
    } catch (error) {
        console.log('error',error)
        return InternalServerError(res,error)
    }

}

module.exports={createReminder,updateReminder}