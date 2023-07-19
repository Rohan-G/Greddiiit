import mongoose from "mongoose";

// Name, Description, Tags, Banned Keywords, Followers, Blocked Followers, Join Requests, Image, Posts, Reports, Creator, Creation Date,  

const SubSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Description: {
        type: String
    },
    Tags: {
        type: [String],
        required: true
    },
    BannedKeywords: {
        type: [String],
        required: true
    },
    Followers: {
        type: [String],
        required: true
    },
    BlockedFollowers: {
        type: [String],
        required: true
    },
    JoinRequests: {
        type: [String],
        required: true
    },
    LeftUsers: {
        type: [String],
        required: true
    },
    Posts: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    Reports: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    Creator: {
        type: String,
        required: true
    },
    Image: {
        type: String
    },
    CreateDate: {
        type: Number
    }
})

const Sub = mongoose.model('sub', SubSchema);
export default Sub;