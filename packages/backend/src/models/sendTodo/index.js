const mongoose=require("mongoose")
const sendTodoSchema=mongoose.Schema({    
    assign_to:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createBy:{ type: mongoose.Schema.Types.ObjectId, ref: "user" },
    todoId:{ type: mongoose.Schema.Types.ObjectId, ref: "todo" },
    is24hours:{type:String},
    is12hours:{type:String},
    is30Minutes:{type:String}
})
const sendTodos=mongoose.model('sendTodo',sendTodoSchema)
module.exports=sendTodos