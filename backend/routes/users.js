import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import auth from "../middleware/auth.js"

const router = express.Router();

router.patch("/addSubs", async(req,res)=>{
    try{
        const { uname  } = req.body;
        await User.findOneAndUpdate({UserName:uname},{
            SubsLeft:[],
            SavedPosts:[]
        })
        return res.send({error: { msg: "Successfully added" }});
    }catch(err){
        return res.status(500).send({error: { msg: "Server Error" }});
    }
})

router.get("/", auth, async (req, res) => {
    try{
        // console.log(req.userInfo);
        const id = req.userInfo._id;
        const users = await User.findById(id);
        // also User.findOne()
        if(!users){
            return res.status(400).send({error: {msg: "No such user"}})
        }
        return res.send(users);
    }catch(err){
        // console.log(err);
        return res.status(500).send({ error: [{ msg: "Server Error" }] });
    }
})

router.post("/follow", auth, async (req, res) => {
    try{
        const id = req.userInfo._id;
        const { uname } = req.body;
        // console.log(uname);
        const curr = await User.findOne({UserName:uname});
        // console.log(curr);
        if(!curr){
            return res.status(400).send({ error: { msg: "User doesn't exist" }});
        }
        const check = await User.findOne({Following:uname});
        if(check){
            // console.log("Already");
            return res.status(400).send({error: { msg: "Already Following" }});
        }
        await User.updateOne({_id:id}, {$push:{Following: uname}}, {new: true});
        // console.log(ret);
        await User.updateOne({UserName:uname}, {$push:{Followers:req.userInfo.uname}}, {new:true});
        return res.status(200).send({error: { msg: "Successfully Followed" }});
    }catch(err){
        return res.status(500).send({error: { msg: "Server Error" }});
    }
})

router.patch("/follow", auth, async (req, res) => {
    try{
        const id = req.userInfo._id;
        const { uname, from } = req.body;
        if(from == 0){
            const check = await User.findOne({Followers:uname});
            if(!check){
                // console.log("Impossible");
                return res.status(400).send({error: { msg: "Not a Follower" }});
            }
            await User.updateOne({_id:id},{$pull:{Followers:uname}});
            await User.updateOne({UserName:uname},{$pull:{Following:req.userInfo.uname}});
            return res.send({error: [{msg: "Removed Successfully"}]});
        }
        else{
            const check = await User.findOne({Following:uname});
            if(!check){
                // console.log("Impossible");
                return res.status(400).send({error: { msg: "Not Following" }});
            }
            await User.updateOne({_id:id},{$pull:{Following:uname}});
            await User.updateOne({UserName:uname},{$pull:{Followers:req.userInfo.uname}});
            return res.send({error: [{msg: "Removed Successfully"}]});
        }
    }catch(err){
        return res.status(500).send({error: [{ msg: "Server Error" , errors: err}]})
    }
})

router.post("/", async (req, res) => {
    try{
        const { fname, lname, uname, email, age, cn, pass } = req.body;

        let user = await User.findOne({ UserName: uname});
        if(user){
            return res.status(400).send({error : { msg: "Username already exists."} });
            // console.log(user);
        }

        user = await User.findOne({ EMail: email});
        if(user){
            return res.status(400).send({error : { msg: "EMail already exists."} });
            // console.log(user);
        }
        else{
            user = new User({FirstName: fname, LastName: lname, UserName: uname, EMail: email, Age: age, ContactNumber: cn, Password: pass, Followers:[], Following: [], Subs: [], SubsFollowing: [], SavedPosts: []});
            // also User.findOneAndUpdate, User.findOneAndRemove
            // mongoose find and update increment -> $inc

            const salt = await bcrypt.genSalt();
            user.Password = await bcrypt.hash(pass, salt);

            await user.save();
            return res.status(200).json({error:{msg : "Created Successfully", user: user}});
        }
    }catch(err){
        return res.status(500).send({ error: [{ msg: "Server Error" }], error: err });
        // console.log(err);
    }
})

router.patch("/", auth, async (req, res) => {
    try{
        const { fname, lname, uname, email, age, cn } = req.body;
        let curr = await User.findById(req.userInfo._id);
        if(uname != curr.UserName){
            return res.status(400).json({error:{msg: "Username is not editable"}});
        }
        if(email != curr.EMail){
            return res.status(400).json({error:{msg: "EMail ID is not editable"}});
        }

        await User.findByIdAndUpdate(req.userInfo._id,{
            FirstName: fname,
            LastName: lname,
            UserName: uname,
            EMail: email,
            Age: age,
            ContactNumber: cn
        });
        return res.status(200).json({error:{msg : "Updated Successfully"}});
    }catch(err){
        return res.status(500).json({error:{msg:"Internal Server Error", error :err}})
    }
})

export default router