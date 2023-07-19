import mongoose from "mongoose";
import env from "dotenv";

env.config();

export default async function connectDB(){
    mongoose.set('strictQuery',true);
    try{
        await mongoose.connect(process.env.MONGO_URL);
        // console.log("DB connected");
    }catch(error){
        console.error("Error in connection:",error);
    }
}