import express, { request } from "express";
import Sub from "../models/Sub.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Report from "../models/Report.js";
import Comment from "../models/Comments.js";

const router = express.Router();

// router.patch("/addLeft", async(req,res)=>{
//     try{
//         const { uname  } = req.body;
//         await Sub.findOneAndUpdate({Name:uname},{
//             LeftUsers:[]
//         })
//         return res.send({error: { msg: "Successfully added" }});
//     }catch(err){
//         return res.status(500).send({error: { msg: "Server Error" }});
//     }
// })

router.post("/leave",auth,async(req,res)=>{
    try{
        const user = req.userInfo.uname;
        const { subName } = req.body;
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error: {msg: "Sub doesn't exist"}});
        }
        if(!exists.Followers.includes(user)){
            return res.status(400).send({error:{msg:"User not following the Sub"}});
        }
        if(exists.Creator == user){
            return res.status(400).send({error:{msg:"Creator cannot leave Sub"}});
        }
        await Sub.updateOne({Name:subName},{$pull:{Followers:user}, $push:{LeftUsers:user}});
        await User.updateOne({UserName:user},{$pull:{SubsFollowing:subName}, $push:{SubsLeft:subName}});
        return res.send({error:{msg:"Successfully Updated"}});
    }catch(err){
        return res.send({error:{msg:"Internal Server Error"}});
    }
})

router.post("/join",auth,async(req,res)=>{
    try{
        const user = req.userInfo.uname;
        const { subName } = req.body;
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error: {msg: "Sub doesn't exist"}});
        }
        if(exists.JoinRequests.includes(user)){
            return res.status(400).send({error: {msg:"Request already awaiting"}});
        }
        if(exists.LeftUsers.includes(user)){
            return res.status(400).send({error:{msg:"Left the Subgreddiit. Cannot join again."}})
        }
        if(exists.Followers.includes(user) || exists.BlockedFollowers.includes(user)){
            return res.status(400).send({error: {msg: "Already Following"}});
        }
        await Sub.updateOne({Name:subName},{$push:{JoinRequests:user}});
        return res.send({error:{msg:"Successfully Requested"}});
    }catch(err){
        return res.status(500).send({error: {msg:"Internal Server Error"}});
    }
})

router.post("/join/approve", auth, async(req,res)=>{
    try{
        const user = req.userInfo.uname;
        const { subName, uname } = req.body;
        // console.log(user,uname,subName);
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error: {msg: "Sub doesn't exist"}});
        }
        if(exists.Creator != user){
            return res.status(400).send({error: {msg: "Unauthorized access"}});
        }
        if(!exists.JoinRequests.includes(uname)){
            return res.status(400).send({error: {msg: "Not requested to join. Cannot approve"}});
        }
        await Sub.updateOne({Name: subName}, {$pull:{JoinRequests:uname}, $push:{Followers:uname}});
        await User.updateOne({UserName: uname}, {$push:{SubsFollowing:subName}});
        return res.send({error: {msg:"Successfully accepted"}});
    }catch(err){
        return res.status(500).send({error: {msg:"Internal Server Error"}});
    }
})

router.post("/join/reject", auth, async(req,res)=>{
    try{
        const user = req.userInfo.uname;
        const { subName, uname } = req.body;
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error: {msg: "Sub doesn't exist"}});
        }
        if(exists.Creator != user){
            return res.status(400).send({error: {msg: "Unauthorized access"}});
        }
        if(!exists.JoinRequests.includes(uname)){
            return res.status(400).send({error: {msg: "Not requested to join. Cannot reject"}});
        }
        await Sub.updateOne({Name: subName}, {$pull:{JoinRequests:uname}});
        return res.send({error: {msg:"Successfully rejected"}});
    }catch(err){
        return res.status(500).send({error: {msg:"Internal Server Error"}});
    }
})

router.get("/users/:subName", auth, async (req,res)=>{
    try{
        const user = req.userInfo.uname;
        const subName = req.params["subName"];
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error: {msg:"SubGreddiit doesn't exist"} });
        }
        if(exists.Creator != user){
            return res.status(400).send({error: {msg:"Unauthorized access"}});
        }
        return res.send({Normal: exists.Followers, Blocked: exists.BlockedFollowers});
    }catch(err){
        return res.status(500).send({error: {message: "Internal Server Error"}})
    }
})

router.get("/", auth, async (req,res)=>{
    try{
        const { name } = req.body;
        const exists = await Sub.findOne({ Name: name });
        if(!exists){
            return res.status(400).send({error: {msg: "No such Subgrediit"}});
        }
        else{
            return res.send(exists);
        }
    }catch(err){
        return res.status(500).send({error: {msg: "Internal Server Error"}});
    }
});

router.get("/one/:subName", auth, async(req,res)=>{
    try{
        const subName = req.params['subName'];
        const exists = await Sub.findOne({ Name:subName });
        if(!exists){
            return res.status(400).send({error: {msg: "No such Subgrediit"}});
        }
        return res.send(exists);
    }
    catch(err){
        return res.status(500).send({error: {msg: "Internal Server Error"}});
    }
})

router.get("/all", auth, async (req,res)=>{
    try{
        const exists = await Sub.find();
        // console.log(exists);
        const user = await User.findById(req.userInfo._id);
        if(!user){
            return res.status(400).send({error: {msg: "No such user"}});
        }
        let ret = [[],[],[],[]];
        for(let i=0;i<exists.length;i++){
            let x = exists[i]._id.getTimestamp();
            exists[i].CreateDate = Math.floor(x.getTime()/1000);
            if(user.Subs.includes(exists[i].Name)){
                ret[0].push(exists[i]);
            }
            else if(user.SubsFollowing.includes(exists[i].Name)){
                ret[1].push(exists[i]);
            }
            else if(user.SubsLeft.includes(exists[i].Name)){
                ret[3].push(exists[i]);
            }
            else{
                ret[2].push(exists[i]);
            }
        }
        // console.log(exists);
        return res.send(ret);
    }catch(err){
        return res.status(500).send({error: {msg: "Internal Server Error",error:err}});
    }
})

router.get("/my", auth, async(req, res)=>{
    try{
        const uname = req.userInfo.uname;
        // console.log(req.userInfo.uname);
        const user = await User.findOne({ UserName: uname});
        const MySubs = user.Subs;
        let SubsInfo = [];
        for(let i=0; i<MySubs.length; i++){
            SubsInfo.push(await Sub.findOne({ Name:MySubs[i] }));
        }
        return res.send(SubsInfo);

    }catch(err){
        return res.send({error : {msg : "Server not Found", err: err}});
    }
})

router.post("/", auth, async ( req, res )=>{
    try{
        const creator = req.userInfo.uname;
        const { name, description, tags, bannedKeywords, img } = req.body;
        const exists = await Sub.findOne({ Name:name });
        let banned = [];
        for(let i=0; i<bannedKeywords.length; i++){
            banned.push(bannedKeywords[i].trim());
            if(bannedKeywords[i].trim().indexOf(' ')>=0){
                return res.status(400).send({error:{msg:"Banned Keywords must only be 1 word each."}})
            }
        }
        let tag = [];
        for(let i=0; i<tags.length; i++){
            tag.push(tags[i].trim());
            if(tags[i].trim().indexOf(' ')>=0){
                return res.status(400).send({error:{msg:"Tags must only be 1 word each."}})
            }
            if(tags[i].toLowerCase() != tags[i]){
                return res.status(400).send({error:{msg:"Tags must be lower case"}});
            }
        }
        if(exists){
            return res.status(400).send({error: {msg: "Sub Name taken"}});
        }
        await User.updateOne({UserName:creator}, {$push:{Subs: name}}, {new:true});
        var followers = new Array();
        followers.push(creator);
        const sub = new Sub({ Name: name, Description: description, Tags: tags, BannedKeywords: bannedKeywords, Followers: followers, BlockedFollowers: [], JoinRequests: [], LeftUsers:[], Posts: [], Reports: [], Creator: creator, Image: img})
        await sub.save();
        return res.send({error: {msg: "Added Successfully"}});
    }catch(err){
        return res.status(500).send({error: {msg: "Internal Server Error", error: err}});
    }
})

router.delete("/", auth, async ( req,res )=>{
    try{
        const creator = req.userInfo.uname;
        const { subName } = req.body;
        // console.log(req.body);
        const exists = await Sub.findOne({Name: subName});
        if(!exists){
            return res.status(400).send({error: {msg: "SubGreddiit doesn't exist"}});
        }
        if(exists.Creator != creator){
            return res.status(400).send({error: {msg: "Not the creator. Cannot delete SubGreddiit"}});
        }
        for(let i=0; i<exists.Followers.length; i++){
            await User.updateOne({UserName:exists.Followers[i]},{$pull:{SubsFollowing:subName}});
        }
        for(let i=0; i<exists.BlockedFollowers.length; i++){
            await User.updateOne({UserName:exists.BlockedFollowers[i]},{$pull:{SubsFollowing:subName}});
        }
        for(let i=0; i<exists.LeftUsers.length; i++){
            await User.updateOne({UserName:LeftUsers[i]}, {$pull:{SubsLeft:subName}});
        }
        for(let i=0; i<exists.Posts.length; i++){
            let post = await Post.findById(exists.Posts[i]);
            for(let i=0;i<post.Reports.length; i++){
                await Sub.updateOne({Name:post.Sub},{$pull:{Reports:post.Reports[i]}});
                await Report.findByIdAndDelete(post.Reports[i]);
            }
            for(let i=0;i<post.Comments.length;i++){
                await Comment.findByIdAndDelete(post.Comments[i]);
            }
            for(let i=0; i<post.UsersSaved.length;i++){
                await User.updateOne({UserName:UsersSaved[i]},{$pull:{SavedPosts:post._id}});
            }
            await Sub.updateOne({Name:exists.Sub}, {$pull:{Posts:post._id}});
            await Post.findByIdAndDelete(post._id);
        }
        await User.updateOne({UserName:creator},{$pull:{Subs: subName}});
        await Sub.findOneAndDelete({Name: subName});
        return res.send({error: {msg: "SubGreddiit deleted"}});
    }catch(err){
        console.log(err);
        return res.status(500).send({error: {msg: "Internal Server Error", error:err}})
    }
})

router.get("/joins/:subName", auth, async ( req,res )=>{
    try{
        const requester = req.userInfo.uname;
        const subName = req.params["subName"];
        // console.log(subName);
        const exists = await Sub.findOne({Name: subName});
        if(!exists){
            return res.status(400).send({error: {msg: "SubGreddiit doesn't exist"}});
        }
        if(exists.Creator != requester){
            return res.status(400).send({error: {msg: "Unauthorized access"}});
        }
        return res.send({my_data:exists.JoinRequests});
    }catch(err){
        return res.status(500).send({error: {msg: "Internal Server Error", error:err}});
    }
})

export default router;