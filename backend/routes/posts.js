import express, { request } from "express";
import Sub from "../models/Sub.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Report from "../models/Report.js";
import Comment from "../models/Comments.js";

const router = express.Router();

// router.patch("/addUsersSaved", async(req,res)=>{
//     try{
//         const { id  } = req.body;
//         await Post.findOneAndUpdate({_id:id},{
//             UsersSaved:[]
//         })
//         return res.send({error: { msg: "Successfully added" }});
//     }catch(err){
//         return res.status(500).send({error: { msg: "Server Error" }});
//     }
// })

router.delete("/:id", auth, async (req,res)=>{
    try{
        const id = req.params["id"];
        const uname = req.userInfo.uname;
        const user = await User.findOne({UserName:uname});
        const exists = await Post.findById(id);
        if(!exists){
            return res.status(400).send({error:{msg:"Post doesn't exist"}});
        }
        if(!user.Subs.includes(exists.Sub)){
            return res.status(400).send({error:{msg:"Unauthorized Access"}});
        }
        for(let i=0;i<exists.Reports.length; i++){
            await Sub.updateOne({Name:exists.Sub},{$pull:{Reports:exists.Reports[i]}});
            await Report.findByIdAndDelete(exists.Reports[i]);
        }
        for(let i=0;i<exists.Comments.length;i++){
            await Comment.findByIdAndDelete(exists.Comments[i]);
        }
        for(let i=0; i<exists.UsersSaved.length;i++){
            await User.updateOne({UserName:UsersSaved[i]},{$pull:{SavedPosts:id}});
        }
        await Sub.updateOne({Name:exists.Sub}, {$pull:{Posts:id}});
        await Post.findByIdAndDelete(id);
        return res.send({error:{msg:"Successfully Removed"}});
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.get("/save", auth, async (req,res)=>{
    try{
        const uname = req.userInfo.uname;
        const user = await User.findOne({UserName:uname});
        let out = [];
        for(let i=0; i<user.SavedPosts.length; i++){
            let post = await Post.findById(user.SavedPosts[i]);
            let sub = await Sub.findOne({Name:post.Sub});
            if(sub.BlockedFollowers.includes(uname)){
                post.Creator = "Blocked USer"
            }
            out.push(post);
        }
        return res.send(out);
    }catch(err){
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.post("/save", auth, async(req,res)=>{
    try{
        const { id } = req.body;
        const exists = await Post.findById(id);
        const user = await User.findById(req.userInfo._id);
        if(!exists){
            return res.status(400).send({error:{msg:"Post doesn't exist"}});
        }
        if(!user.SubsFollowing.includes(exists.Sub) && !user.Subs.includes(exists.Sub)){
            return res.status(400).send({error:{msg:"Unauthorized access"}});
        }
        if(user.SavedPosts.includes(id)){
            return res.status(400).send({error:{msg:"Already Saved"}});
        }
        await User.updateOne({UserName:req.userInfo.uname},{$push:{SavedPosts:id}});
        await Post.updateOne({_id: id},{$push:{UsersSaved:req.userInfo.uname}});
        return res.send("Saved successfully");
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.post("/removesaved", auth, async(req,res)=>{
    try{
        const { id } = req.body;
        const exists = await Post.findById(id);
        const user = await User.findById(req.userInfo._id);
        if(!exists){
            return res.status(400).send({error:{msg:"Post doesn't exist"}});
        }
        if(!user.SavedPosts.includes(id)){
            return res.status(400).send({error:{msg:"Post not saved"}});
        }
        await User.updateOne({UserName:req.userInfo.uname},{$pull:{SavedPosts:id}});
        await Post.updateOne({_id: id},{$pull:{UsersSaved:req.userInfo.uname}});
        return res.send("Removed successfully");
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.get("/:subName", auth, async (req,res) => {
    try{
        const uname = req.userInfo.uname;
        const subName = req.params["subName"];
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error:{msg:"Sub doesn't exist"}});
        }
        if(exists.Creator != uname && !exists.Followers.includes(uname) && !exists.BlockedFollowers.includes(uname)){
            return res.status(400).send({error:{msg:"Unauthorized access"}});
        }
        let posts = [];
        for(let i=0;i<exists.Posts.length;i++){
            const p = await Post.findById(exists.Posts[i]);
            let sub = await Sub.findOne({Name:p.Sub});
            if(sub.BlockedFollowers.includes(p.Creator)){
                p.Creator = "Blocked User"
            }
            // console.log(p);
            posts.push(p);
        }
        return res.send(posts);
    }catch(err){
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.post("/",auth,async (req,res) => {
    try{
        const uname = req.userInfo.uname;
        const { subName, text, title } = req.body;
        const exists = await Sub.findOne({ Name: subName });
        if(!exists){
            return res.status(400).send({error:{msg:"Sub doesn't exist"}});
        }
        if(exists.Creator != uname && !exists.Followers.includes(uname) && !exists.BlockedFollowers.includes(uname)){
            return res.status(400).send({error:{msg:"Unauthorized access"}});
        }
        const regex = new RegExp(exists.BannedKeywords.join("|"),"gi");
        let text1 = text.replaceAll(regex, match=>"*".repeat(match.length));
        const post = new Post({Creator: uname, Sub: subName, Title:title, Text: text1, Upvotes:[uname], Downvotes:[], Comments:[], Reports:[]})
        post.save(async (err, doc) => {
            Sub.updateOne({Name:subName},{$push:{Posts:doc._id}}, (err, doc)=>{
                if(err){
                    return res.status(400).send({error:{msg:err}});
                }
            });
            if(err){
                return res.status(400).send({error:{msg:err}});
            }
        });
        return res.send({error:{msg:"Successfully sent"}});
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.post("/upvote",auth,async (req, res)=>{
    try{
        const uname = req.userInfo.uname;
        const { id } = req.body;
        const exists = await Post.findById(id);
        if(!exists){
            return res.status(400).send({error: { msg: "Sub doesn't exist"}});
        }
        const user = await User.findOne({UserName:uname});
        if(!user){
            return res.status(400).send({error: { msg: "User doesn't exist" }});
        }
        if(exists.Upvotes.includes(uname)){
            await Post.updateOne({_id:id},{$pull:{Upvotes:uname}});
            return res.send("Upvoted successfully");
        }
        if(exists.Downvotes.includes(uname)){
            await Post.updateOne({_id:id},{$pull:{Downvotes:uname}});
        }
        await Post.updateOne({_id:id},{$push:{Upvotes:uname}});
        return res.send("Updated successfully");
    }catch(err){
        return res.status(500).send({error: { msg: "Internal Server Error" }});
    }
});

router.post("/downvote",auth,async (req, res)=>{
    try{
        const uname = req.userInfo.uname;
        const { id } = req.body;
        const exists = await Post.findById(id);
        if(!exists){
            return res.status(400).send({error: { msg: "Sub doesn't exist"}});
        }
        const user = await User.findOne({UserName:uname});
        if(!user){
            return res.status(400).send({error: { msg: "User doesn't exist" }});
        }
        if(exists.Downvotes.includes(uname)){
            await Post.updateOne({_id:id},{$pull:{Downvotes:uname}});
            return res.send("Upvoted successfully");
        }
        if(exists.Upvotes.includes(uname)){
            await Post.updateOne({_id:id},{$pull:{Upvotes:uname}});
        }
        await Post.updateOne({_id:id},{$push:{Downvotes:uname}});
        return res.send("Updated successfully");
    }catch(err){
        return res.status(500).send({error: { msg: "Internal Server Error" }});
    }
});

export default router;