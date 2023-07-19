import mongoose from "mongoose"

const ReportSchema = new mongoose.Schema({
    Reporter:{
        type:String,
        required:true
    },
    Post:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    Reported:{
        type:String,
        required:true
    },
    Text:{
        type:String,
        required:true
    },
    Details:{
        type:String,
        required:true
    }
})

const Report = mongoose.model('report', ReportSchema);
export default Report