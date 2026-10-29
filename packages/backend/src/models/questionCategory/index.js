const mongoose=require('mongoose')

const questionCategorySchema=mongoose.Schema({
    created_by:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    category:{
        type:String
    },
    isArchive:{
        type:Boolean,
        default:false
    }
})

const questionCategory=mongoose.model("questionCategory",questionCategorySchema)
module.exports=questionCategory