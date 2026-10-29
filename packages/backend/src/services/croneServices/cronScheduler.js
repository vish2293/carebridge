const { todos, sendTodos, reminders } = require("../../models");
const { sendReminder12Hours, sendReminder24Hours, sendReminder30Minutes } = require("./sendReminders");

const cronScheduler = async () => {
    const today = new Date();
    const todayMilliseconds = today.getTime();
    const todoData = await todos.find({}).populate('assign_to');

    if(todoData){

        for (const item of todoData) {
            const dueDate = new Date(item?.due_by)
            
            const currentTimeDifference = dueDate - todayMilliseconds + 300000
    
            const currentHourDifference = Math.round((currentTimeDifference) / (1000 * 60 * 60))
    
            const currentMinuteDifference = Math.round((currentTimeDifference) / (1000 * 60))
    
            const sendTodoData = await sendTodos.findOne({ todoId: item?._id })
            
            const userData = await reminders.findOne({ reminder_by: item?.assign_to })        
    
            if (userData?.is24Hours==='true') {            
                if (!sendTodoData?.is24hours && currentHourDifference === 24) {
                    sendReminder24Hours(item)
                }
            }
            if (userData?.is12Hours==='true') {
                if (!sendTodoData?.is12hours && currentHourDifference === 12) {
                    sendReminder12Hours(item, sendTodoData)
                }
            }
            if (userData?.is30Minutes==='true') {
                if (!sendTodoData?.is30Minutes && currentMinuteDifference === 30) {
                    sendReminder30Minutes(item, sendTodoData)
                }
            }
        }
    }

    
}

module.exports = { cronScheduler }