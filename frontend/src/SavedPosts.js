import { React, useEffect, useState } from 'react';
import Navbar from "./Navbar.js"
import { CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActions } from '@mui/material';
import { IconButton } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import CommentIcon from '@mui/icons-material/Comment';

export default function SavedPost(props) {
    const navigate = useNavigate();
    const [gotData, setGotData] = useState(false);
    const [savedData, setSavedData] = useState();

    async function follow(uname){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/user/follow', {uname: uname}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    async function upVote(id) {
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/posts/upvote', {id: id}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }
    async function downVote(id) {
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/posts/downvote', {id: id}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    async function fetchData() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.get(`http://localhost:8000/api/posts/save`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                // console.log(res.data);
                setSavedData(res.data);
                setGotData(true);
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }
    
    async function Unsave(id){
        console.log(id);
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/posts/removesaved', {id: id}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                fetchData();
                alert("Removed Successfully");
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    useEffect(() => {
        console.log("Saved Posts");
        if (localStorage.getItem('user') == null) {
            navigate("/login");
        }
        else {
            fetchData();
        }
    }, [])

    return (
        <>
            {
                gotData ?
                        <>
                            <Typography component="h1" variant='h1' color="orangered"
                                sx={{
                                    position: 'absolute',
                                    top: "15vh",
                                    left: "35vw"
                                }}>Saved Posts</Typography>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "5vw", position: "absolute", top: "30vh", left: "5vw", right: "5vw", paddingBottom: "10vh"}}>
                                {savedData.length > 0 ?
                                    savedData.map((subData) => (
                                        <Card key={subData._id} sx={{ position: "relative", width: "26vw", bgcolor: "#202224", color: "red" }}>
                                            <CardContent>
                                                <Typography variant="h3" component="h2">
                                                    {subData.Title}
                                                </Typography>
                                                <p>
                                                    <Typography><b>OP:</b></Typography>
                                                    <Typography>{subData.Creator}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Text:</b></Typography>
                                                    <Typography>{subData.Text}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>SubGreddiit:</b></Typography>
                                                    <Typography>{subData.Sub}</Typography>
                                                </p>
                                            </CardContent>
                                            <CardActions>
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{upVote(subData._id)}}>< ArrowUpwardIcon/></IconButton>{subData.Upvotes.length}
                                            <IconButton sx={{color:"blue"}} onClick={()=>{downVote(subData._id)}}>< ArrowDownwardIcon/></IconButton>{subData.Downvotes.length}
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{follow(subData.Creator)}}><PersonAddAltIcon /></IconButton>
                                            <IconButton sx={{color:"orangered"}}><CommentIcon /></IconButton>
                                            <IconButton sx={{color:"orangered"}}><ReportProblemIcon /></IconButton>
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{Unsave(subData._id)}}><BookmarkRemoveIcon /></IconButton>
                                            </CardActions>
                                        </Card>
                                    ))
                                    :
                                    <></>
                                }
                            </div>
                        </>
                    :
                    <>
                        <div style={{ color: "orangered", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CircularProgress color='inherit' />
                            <Typography color="orangered">Loading</Typography>
                        </div>
                    </>
            }
            <Navbar />
        </>
    );
}