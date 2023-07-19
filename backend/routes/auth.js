import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ UserName : username});

        if(!user){
            return res.status(400).send({error:{
                msg: "User Not Found"
            }});
        }
        else{
            const checker = await user.checkPass(password);
            if(checker){
                console.log("Successfull login");
                const token = user.genTok();
                return res.send({ token });
            }
            else{
                return res.status(400).send({error:{
                    msg: "Invalid Password"
                }});
            }
        }
    }catch(err){
        return res.status(500).send({error: {msg: err}});
    }
})

export default router;