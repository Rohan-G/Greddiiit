import express, { request } from "express";
import Sub from "../models/Sub.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comments.js";

const router = express.Router();

router.post("/", auth, async (req, res)=>{
    try{
        const uname = req.userInfo.uname;
        const { id, text } = req.body;
        const exists = await Post.findById(id);
        if(!exists){
            return res.status(400).send("Post doesn't exist");
        }
        const comment = new Comment({Commentor:uname, Post:id, Content: text });
        // console.log(uname, id, text);
        comment.save(async (err, doc) => {
            // console.log(doc);
            Post.updateOne({_id:id},{$push:{Comments:doc._id}}, (err, doc1)=>{
                if(err){
                    // console.log(err);
                    return res.status(400).send({error:{msg:err}});
                }
            });
            if(err){
                // console.log("Hello",err);
                return res.status(400).send({error:{msg:err}});
            }
        });
        return res.send("Posted Successfully");
    }catch(err){
        console.log(err);
        res.status(500).send({error:{msg:"Internal Server Error"}})
    }
})

router.get("/:id", auth, async (req,res)=>{
    try{
        const id = req.params["id"];
        const user = await User.findById(req.userInfo._id);
        const exists = await Post.findById(id);
        if(!exists){
            return res.status(400).send({error:{msg:"Post doesn't exists"}})
        }
        if(!user.SubsFollowing.includes(exists.Sub) && !user.Subs.includes(exists.Sub) && !user.SavedPosts.includes(id)){
            return res.status(400).send({error:{msg:"Cannot access this post"}});
        }
        let comments = [];
        for(let i=0; i<exists.Comments.length; i++){
            comments.push(await Comment.findById(exists.Comments[i]));
        }
        return res.send(comments);
    }catch(err){
        res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

export default router;