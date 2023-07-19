import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    Creator:{
        type: String,
        required: true
    },
    Sub:{
        type: String,
        required: true
    },
    Title:{
        type: String,
        required:true
    },
    Text:{
        type:String,
        required: true
    },
    Upvotes:{
        type:[String],
        required:true
    },
    Downvotes:{
        type:[String],
        required:true
    },
    Comments:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true
    },
    Reports:{
        type:[mongoose.Schema.Types.ObjectId],
        required: true
    },
    UsersSaved:{
        type:[String],
        required: true
    }
})

const Post = mongoose.model('post',PostSchema);
export default Post;