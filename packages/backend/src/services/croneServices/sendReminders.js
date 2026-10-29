const { sendTodos } = require("../../models")
const { sendReminderEmail } = require("../emailServices/sendReminderEmail")

const sendReminder24Hours = async (item) => {
    try {
        const sendTodoData = new sendTodos({
            createBy: item?.createBy,
            assign_to: item?.assign_to,
            todoId: item?._id,
            is24hours: true,
            is_Sent: true,
        })
        await sendTodoData.save()
        sendReminderEmail(item)
        
    } catch (error) {
        console.log('error', error)
    }
}

const sendReminder12Hours = async(item,sendTodoData) => {
    try {
        if(!sendTodoData?.is24hours){
            const sendTodoData = new sendTodos({
                createBy: item?.createBy,
                assign_to: item?.assign_to,
                todoId: item?._id,
                is12hours: true,
                is_Sent: true,
            })
            await sendTodoData.save()
        }else{

            await  sendTodos.findOneAndUpdate({todoId:item?._id},{is12hours:true},{new:true})
        }
        sendReminderEmail(item)
        
    } catch (error) {
        console.log('error', error)
    }
}

const sendReminder30Minutes = async(item,sendTodoData) => {
    try {
        if(!sendTodoData?.is24hours&& !sendTodoData?.is12hours){
            const sendTodoData = new sendTodos({
                createBy: item?.createBy,
                assign_to: item?.assign_to,
                todoId: item?._id,
                is30Minutes: true,
                is_Sent: true,
            })
            await sendTodoData.save()
        }else{
            await  sendTodos.findOneAndUpdate({todoId:item?._id},{is30Minutes:true},{new:true})
        }
        sendReminderEmail(item)
        
    } catch (error) {
        console.log('error', error)
    }
}

module.exports = { sendReminder24Hours, sendReminder12Hours, sendReminder30Minutes }