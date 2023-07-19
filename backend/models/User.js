import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String
    },
    UserName: {
        type: String,
        required: true,
        unique: true
    },
    EMail: {
        type: String,
        required: true,
        unique: true
    },
    Age: {
        type: Number
    },
    ContactNumber: {
        type: Number
    },
    Password: {
        type: String,
        required: true
    },
    Followers: {
        // type: [mongoose.Schema.Types.ObjectId],
        type: [String],
        required: true
    },
    Following: {
        // type:[mongoose.Schema.Types.ObjectId],
        type:[String],
        required:true
    },
    Subs: {
        type:[String],
        required:true
    },
    SubsFollowing: {
        type: [String],
        required: true
    },
    SubsLeft: {
        type: [String],
        required: true
    },
    SavedPosts:{
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    }
});

UserSchema.methods.checkPass = function(password){
    return bcrypt.compare(password, this.Password);
}

UserSchema.methods.genTok = function(){
    const payload = {
        'user':{
            'uname' : this.UserName,
            '_id' : this._id
        }
    }
    const sec = process.env.SECRET_KEY;
    const token = jwt.sign(payload, sec, { expiresIn: 360000 });

    return token;
}

const User = mongoose.model('user', UserSchema);

export default User;