import express from "express";
import Report from "../models/Report.js";
import Post from "../models/Post.js";
import Sub from "../models/Sub.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req,res)=>{
    try{
        const user = req.userInfo.uname;
        const { postID, details } = req.body;
        const exists = await Post.findById(postID);
        if(!exists){
            return res.status(400).send("Post doesn't exist");
        }
        const subg = await Sub.findOne({Name: exists.Sub});
        if(!subg.Followers.includes(user) && subg.Creator!=user && !subg.BlockedFollowers.includes(user)){
            return res.status(400).send("Unauthorized Access");
        }
        const report = new Report({Reporter:user, Post:postID, Reported:exists.Creator, Text:exists.Text, Details:details});
        report.save(async (err,doc)=>{
            await Post.findByIdAndUpdate(postID, {$push:{Reports:doc._id}});
            await Sub.updateOne({Name: exists.Sub}, {$push:{Reports:doc._id}});
            if(err){
                return res.status(400).send({error:{msg:err}});
            }
        });
        return res.send({error:{msg:"Reported Successfully"}});
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
});

router.get("/:subName", auth, async (req, res)=>{
    try{
        const user = req.userInfo.uname;
        const subName = req.params['subName'];
        const exists = await Sub.findOne({Name:subName});
        if(!exists){
            return res.status(400).send("No such Sub");
        }
        if(user!=exists.Creator){
            return res.status(400).send("Unauthorized access");
        }
        let reports=[];
        let dels = [];
        const second = 1000;
        const min = second*60;
        const hour = min*60;
        const day = hour*24;
        const month = day*30;
        const year = day*365;
        for(let i=0; i<exists.Reports.length;i++){
            let ts = exists.Reports[i].getTimestamp();
            let t = ts.getTime();
            let ts1 = new Date();
            let t1 = ts1.getTime();
            let x = (t1-t)/day;
            if(x>10){
                dels.push(exists.Reports[i]);
                continue;
            }
            reports.push(await Report.findById(exists.Reports[i]));
        }
        for(let i=0; i<dels.length;i++){
            let rep = await Report.findById(dels[i]);
            await Sub.updateOne({Name: subName}, {$pull:{Reports:dels[i]}});
            await Post.updateOne({_id:rep.Post},{$pull:{Reports:dels[i]}});
            await Report.findByIdAndDelete(dels[i]);
        }
        return res.send(reports);
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.delete("/:id", auth, async (req, res)=>{
    try{
        const user = req.userInfo.uname;
        const repID = req.params['id'];
        const exists = await Report.findById(repID);
        if(!exists){
            return res.status(400).send({error:{msg:"Report doesn't exist"}});
        }
        const post = await Post.findById(exists.Post);
        const sub = await Sub.findOne({Name: post.Sub});
        if(sub.Creator!=user){
            return res.status(400).send("Unauthorized access");
        }
        await Sub.updateOne({Name: post.Sub}, {$pull:{Reports:repID}});
        await Post.updateOne({_id:exists.Post},{$pull:{Reports:repID}});
        await Report.findByIdAndDelete(repID);
        return res.send("Successfully Deleted");
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

router.post("/block", auth, async (req, res)=>{
    try{
        const user = req.userInfo.uname;
        const { repID } = req.body;
        const exists = await Report.findById(repID);
        if(!exists){
            return res.status(400).send({error:{msg:"Report doesn't exist"}});
        }
        const post = await Post.findById(exists.Post);
        if(!post){
            return res.status(400).send({error:{msg:"Post doesn't exist"}});
        }
        const subg = await Sub.findOne({Name: post.Sub});
        if(!subg.Creator == user){
            return res.status(400).send({error:{msg:"Unauthorized Access"}})
        }
        if(subg.BlockedFollowers.includes(exists.Reported)){
            return res.status(400).send({error:{msg:"Already Blocked"}});
        }
        if(!subg.Followers.includes(exists.Reported) && subg.Creator!=exists.Reported){
            return res.status(400).send({error:{msg:"User not a follower anymore"}});
        }
        await Sub.updateOne({Name: subg.Name}, {$pull:{Followers:exists.Reported}, $push:{BlockedFollowers:exists.Reported}});
        return res.send({error:{msg:"Blocked Successfully"}});
    }catch(err){
        console.log(err);
        return res.status(500).send({error:{msg:"Internal Server Error"}});
    }
})

export default router;