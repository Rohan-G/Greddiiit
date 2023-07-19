import jwt from "jsonwebtoken";

export default function auth(req, res, next){
    try{
        const token = req.header("x-auth-token");
        try{
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.userInfo = decoded.user;
            // console.log(decoded.user);
            next();
        }catch(err){
            // console.log(token);
            return res.status(400).send({error:{msg:"Invalid token"}});
        }
    }catch(err){
        console.error(err);
        return res.send({error:{msg:"Error"}});
    }
}