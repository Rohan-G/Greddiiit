import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "./Navbar.js"
import { CircularProgress, Icon, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActions } from '@mui/material';
import Logo from "./reddit.png"
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { TextField } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import CommentIcon from '@mui/icons-material/Comment';

export default function AllSubsRenderer(props) {
    let { subName } = useParams();
    const navigate = useNavigate();
    const [posts, SetPosts] = useState();
    const [subData, setSubData] = useState();
    const [gotData, setGotData] = useState();
    const [title,setTitle] = useState();
    const [text,setText] = useState();
    const [open,setOpen] = useState(false);
    const [openComment, setOpenComment] = useState(false);
    const [comments, setComments] = useState([]);
    const [comVal, setComVal] = useState();
    const [currPost, setCurrPost] = useState();
    const [openRep, setOpenRep] = useState(false);
    const [repDet, setRepDet] = useState();

    function dispForm(){
        setOpen(true);
    }
    
    function handleClose(){
        setTitle();
        setText();
        setOpen(false);
    }

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
            const res = await axios.get(`http://localhost:8000/api/posts/${subName}`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                console.log(res.data);
                SetPosts(res.data);
                const subs = await axios.get(`http://localhost:8000/api/subs/one/${subName}`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
                if(subs.status==200){
                    console.log(subs.data);
                    setSubData(subs.data);
                    setGotData(true);
                }
            }

        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    async function handleSubmit() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/posts', {subName: subName, text: text, title: title}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                setOpen(false);
                setText();
                setTitle();
                fetchData();
                alert("Posted Successfully");
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    async function getComs(id){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try {
            const res = await axios.get(`http://localhost:8000/api/comments/${id}`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                console.log(res.data);
                setComments(res.data);
                setCurrPost(id);
                setOpenComment(true);
            }
        } catch (err) {
            console.log(err);
            alert(err.response.data.error.msg);
        }
    }

    async function postCom(){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/comments', {id: currPost, text:comVal}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                setComVal("");
                // console.log("Successful")?
                getComs(currPost);
            }
        }catch(err){
            console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    async function postRep(){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/report', {postID: currPost, details:repDet}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                setRepDet("");
                setOpenRep(false);
                console.log("Successful");
                // getComs(currPost);
            }
        }catch(err){
            console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }
    
    async function save(id){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.post('http://localhost:8000/api/posts/save', {id: id}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if(res.status==200){
                fetchData();
                alert("Saved Successfully");
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    useEffect(() => {
        console.log(subName);
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
                    <div style={{ display: "flex", height:"100vh" }}>
                        {
                            subData.Image ?
                                <div style={{ width:"50vw",overflow:"hidden" }}>
                                    <img src={subData.Image} style={{ position: "fixed", top: "25vh", left: "10vw" }} />
                                </div>
                            :
                                <div style={{ width:"50vw",overflow:"hidden" }}>
                                    <img src={Logo} style={{ position: "fixed", top: "25vh", left: "10vw" }} />
                                </div>
                        }
                        <div style={{position:"relative", width: "50vw", overflowY:"scroll"}}>
                            <Typography component="h1" variant='h1' color="orangered"
                                sx={{
                                    position: 'relative',
                                    top: "15vh",
                                    left: "5vw"
                                }}>{subName} Page</Typography>
                            <div style={{ display: "flex", flexDirection: "column", flexWrap: "no-wrap", gap: "5vw", position: "absolute", top: "30vh", left: "5vw", right: "5vw", paddingBottom: "10vh"}}>
                                {posts.length > 0 ?
                                    posts.map((subData) => (
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
                                            </CardContent>
                                            <CardActions>
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{upVote(subData._id)}}>< ArrowUpwardIcon/></IconButton>{subData.Upvotes.length}
                                            <IconButton sx={{color:"blue"}} onClick={()=>{downVote(subData._id)}}>< ArrowDownwardIcon/></IconButton>{subData.Downvotes.length}
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{follow(subData.Creator)}}><PersonAddAltIcon /></IconButton>
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{getComs(subData._id)}}><CommentIcon /></IconButton>{subData.Comments.length}
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{setOpenRep(true); setCurrPost(subData._id)}}><ReportProblemIcon /></IconButton>
                                            <IconButton sx={{color:"orangered"}} onClick={()=>{save(subData._id)}}><BookmarkAddIcon /></IconButton>
                                            </CardActions>
                                        </Card>
                                    ))
                                    :
                                    <></>
                                }
                                <Dialog open={openComment} onClose={()=>{setOpenComment(false); setComments([])}}>
                                    <DialogTitle>
                                        Comments
                                        <IconButton onClick={()=>{setOpenComment(false); setComments([])}} sx={{ position: "absolute", top: 0, right: 0 }}><CloseIcon /></IconButton>
                                    </DialogTitle>
                                    <DialogContent>
                                        <>
                                            {
                                                comments.length>0 ? 
                                                    comments.map((comData)=>(
                                                        <p>
                                                            <Typography><b>{comData.Commentor}</b></Typography>
                                                            {comData.Content}
                                                        </p>
                                                    ))
                                                :
                                                <>
                                                    <Typography><b>No comments yet.</b></Typography>
                                                </>
                                            }
                                            <TextField
                                                fullWidth
                                                onChange={(value) => { setComVal(value.target.value) }}
                                                multiline
                                                value={comVal}
                                                label="Comment"
                                                variant="standard"
                                            />
                                        </>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button disabled={comVal == undefined} onClick={postCom}>Post</Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openRep} onClose={()=>{setOpenRep(false); setRepDet("")}}>
                                    <DialogTitle>
                                        Comments
                                        <IconButton onClick={()=>{setOpenRep(false); setRepDet("")}} sx={{ position: "absolute", top: 0, right: 0 }}><CloseIcon /></IconButton>
                                    </DialogTitle>
                                    <DialogContent>
                                        <>
                                            <TextField
                                                fullWidth
                                                onChange={(value) => { setRepDet(value.target.value) }}
                                                multiline
                                                value={repDet}
                                                label="Reason"
                                                variant="standard"
                                            />
                                        </>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button disabled={repDet == undefined} onClick={postRep}>Submit</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                        <div style={{ color: "orangered", backgroundColor: "white", borderRadius: "50vw", display: "flex", alignItems: "center", justifyContent: "center", height: "3vw", width: "3vw", cursor: 'pointer', position: "fixed", left: "95vw", top: "90vh" }}>
                            <IconButton color="inherit" onClick={dispForm} sx={{ width: "3vw", height: "3vw" }}><AddIcon /></IconButton>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>
                                    New Post
                                    <IconButton onClick={handleClose} sx={{ position: "absolute", top: 0, right: 0 }}><CloseIcon /></IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <TextField
                                        fullWidth
                                        onChange={(value) => { setTitle(value.target.value) }}
                                        label="Title"
                                        variant="standard"
                                    />
                                    <TextField
                                        fullWidth
                                        onChange={(value) => { setText(value.target.value) }}
                                        multiline
                                        label="Text"
                                        variant="standard"
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button disabled={title == undefined || text == undefined} onClick={handleSubmit}>Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
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