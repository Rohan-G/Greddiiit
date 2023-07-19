import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
    Commentor:{
        type:String,
        required:true
    },
    Post:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    Content:{
        type:String,
        required:true
    }
})

const Comment = mongoose.model('comment',CommentSchema);
export default Comment;