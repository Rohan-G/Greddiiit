import express from "express";
// const express = require("express")
import connectDB from "./utils/connectDB.js";
import UserRouter from "./routes/users.js";
import AuthRouter from "./routes/auth.js";
import SubRouter from "./routes/subs.js";
import PostRouter from "./routes/posts.js";
import ComRouter from "./routes/comments.js";
import RepRouter from "./routes/reports.js"
import cors from "cors";
const app = express()

app.use(cors());

connectDB()

// middleware
// sessions

app.use(express.json())
app.use('/api/user', UserRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/subs',SubRouter);
app.use('/api/posts',PostRouter);
app.use('/api/comments',ComRouter);
app.use("/api/report",RepRouter);

const PORT=8000;

app.listen(PORT,()=>{
    console.log(`Server started on port: ${PORT}`);
})