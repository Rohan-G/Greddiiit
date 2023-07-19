import { React, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Av from './avatar.png'
import { Grid } from '@mui/material';
import { Backdrop } from '@mui/material';
import axios from 'axios';
import Navbar from "./Navbar.js";
import {
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText
  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// const Folers=[
//     {id: 1, content: "Follower1"},
//     {id: 2, content: "Follower2"},
//     {id: 3, content: "Follower3"}
// ]

// const Foling=[
//     {id: 1, content: "Following1"},
//     {id: 2, content: "Following2"},
//     {id: 3, content: "Following3"}
// ]

function Profile(props){
    const navigate = useNavigate();
    const[currtok, updateTok] = useState(localStorage.getItem('user'));
    const[editable, makeEditable] = useState(false);
    const [buttVal, changeButtVal] = useState("Edit Profile");
    const[isLoggedIn,updateLogInInfo] = useState(false);
    const[uname,setUname] = useState(props.user);
    const[fn,setFn] = useState("admin");
    const[ln,setLn] = useState("admin");
    const[email,setEmail] = useState("admin@iiit.ac.in");
    const[phNo,setPhNo] = useState("0123456789");
    const[ag,setAg] = useState("19");
    const[Folers, setFolers] = useState([]);
    const[Foling, setFoling] = useState([]);
    const[fers,setFers] = useState(false);
    const[fing,setFing] = useState(false);

    async function removeFromFoling(uname,index){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.patch('http://localhost:8000/api/user/follow', {from: 1, uname: uname}, {headers: {'x-auth-token':String(currtok)}});
            if(res.status==200){
              alert("Successfully Removed");
              fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    async function removeFromFolers(uname,index){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            const res = await axios.patch('http://localhost:8000/api/user/follow', {from: 0, uname: uname}, {headers: {'x-auth-token':String(currtok)}});
            if(res.status==200){
              alert("Successfully Removed");
              fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    async function fetchData(){
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try{
            const res = await axios.get('http://localhost:8000/api/user', {headers: {'x-auth-token':String(currtok)}});
            if(res.status==200){
                setFn(res.data.FirstName);
                setLn(res.data.LastName);
                setUname(res.data.UserName);
                setEmail(res.data.EMail);
                setAg(res.data.Age);
                setPhNo(res.data.ContactNumber);
                setFolers(res.data.Followers);
                setFoling(res.data.Following);
                updateLogInInfo(true);
            }
        }catch(err){
            console.log(currtok);
            alert(err.response.data.error.msg);
            localStorage.removeItem('user');
            navigate('/login');
        }
    }

    async function Func(){
        if(editable){
            makeEditable(false);
            
            try{
                const res = await axios.patch('http://localhost:8000/api/user', {fname: fn, lname: ln, uname: uname, email: email, age: ag, cn: phNo}, {headers:{'x-auth-token':String(currtok)}});
                if(res.status==200){
                    alert("Successfully Updated");
                    changeButtVal("Edit Profile")
                }
                console.log(res.status);
            }catch(err){
                alert(err.response.data.error.msg);
                makeEditable(true);
                fetchData();
            }
        }
        else{
            makeEditable(true);
            changeButtVal("Save");
        }
    }

    useEffect(()=>{
        console.log("Profile");
        if(localStorage.getItem('user')==null){
            navigate("/login");
        }
        else{
            console.log(localStorage.getItem('user'));
            updateTok(localStorage.getItem('user'));
            // console.log(currtok);
            fetchData();
        }
    },[])

    return(
        <>
        {
            isLoggedIn ?
            <>
                <Typography component="h1" variant='h1' color="orangered"
                sx={{
                    position: 'absolute',
                    top: '13vh',
                    left: '40vw'
                }}>Profile Page</Typography>
                <img alt="Avatar" src={Av} 
                style={{
                    position: 'absolute',
                    width: '25vw',
                    height: '62vh',
                    top: '30vh',
                    left: '6vw'
                }} />
                <Box
                sx={{
                    position: 'absolute',
                    width: '60vw',
                    height: '47vh',
                    top: '25vh',
                    left: '31vw',
                    backgroundColor: '#202224',
                    borderRadius: '4vw',
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 3
                }}>
                    <Grid container spacing={3} justify="center" alignItems="center" sx={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Grid item xs={4} sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography component = "h5" variant="h3" sx={{
                                color: "orangered"
                            }}><u>Userame</u><br /></Typography>
                            <TextField id="outlined basics" variant="outlined" size="medium" margin='normal' onChange={(uname) => { false && setUname(uname.target.value) }} value={uname} sx={{width:'15vw', input:{color:"orangered", fontSize:'1.5vw'}, color:"orangered"}}/>
                        </Grid>
                        <Grid item xs={4} sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography component = "h5" variant="h3" sx={{
                                color: "orangered"
                            }}><u>Email</u><br /></Typography>
                            <TextField id="outlined basics" variant="outlined" size="medium" margin='normal' onChange={(uname) => { false && setEmail(uname.target.value) }} value={email} sx={{width:'15vw', input:{color:"orangered", fontSize:'1.5vw'}}}/>
                        </Grid>
                        <Grid item xs={4} sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography component = "h5" variant="h3" sx={{
                                color: "orangered"
                            }}><u>First Name</u><br /></Typography>
                            <TextField id="outlined basics" variant="outlined" size="medium" margin='normal' onChange={(fn) => { editable && setFn(fn.target.value) }} value={fn} sx={{width:'15vw',input:{color:"orangered", fontSize:'1.5vw'}}}/>
                        </Grid>
                        <Grid item xs={4} sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography component = "h5" variant="h3" sx={{
                                color: "orangered"
                            }}><u>Last Name</u><br /></Typography>
                            <TextField id="outlined basics" variant="outlined" size="medium" margin='normal' onChange={(fn) => { editable && setLn(fn.target.value) }} value={ln} sx={{width:'15vw',input:{color:"orangered", fontSize:'1.5vw'}}}/>
                        </Grid>
                        <Grid item xs={4} sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography component = "h5" variant="h3" sx={{
                                color: "orangered"
                            }}><u>Age</u><br /></Typography>
                            <TextField id="outlined basics" variant="outlined" size="medium" margin='normal' onChange={(fn) => { editable && setAg(fn.target.value) }} value={ag} sx={{width:'15vw',input:{color:"orangered", fontSize:'1.5vw'}}}/>
                        </Grid>
                        <Grid item xs={4} sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <Typography component = "h5" variant="h3" sx={{
                                color: "orangered"
                            }}><u>Contact Number</u><br /></Typography>
                            <TextField id="outlined basics" variant="outlined" size="medium" margin='normal' onChange={(fn) => { editable && setPhNo(fn.target.value) }} value={phNo} sx={{width:'15vw',input:{color:"orangered", fontSize:'1.5vw'}}}/>
                        </Grid>
                    </Grid>
                </Box>
                <table style={{position:'absolute', height:'30vh', width:'60vw', left:'31vw', top:'63vh' }}>
                    <tr align="center">
                        <td>
                            <Button size="Large" onClick={()=>{setFers(true)}} sx={{
                                backgroundColor:"orangered",
                                color:"white",
                                fontSize:"larger"
                            }}>{Folers.length}<br />Followers</Button>
                        </td>
                        <td>
                        <Button size="Large" onClick={()=>{setFing(true)}} sx={{
                                backgroundColor:"orangered",
                                color:"white",
                                fontSize:"larger",
                            }}>{Foling.length}<br />Following</Button>
                        </td>
                        <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={fers||fing}
                        onClick={()=>{setFers(false); setFing(false)}}
                        >
                            {
                                    <Box 
                                    sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
                                    >
                                        {
                                            fers ?
                                                // <RenderFolers />
                                                <List dense sx={{color: "orangered"}}>
                                                        {Folers.map((item, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={item} />
                                                            <ListItemSecondaryAction>
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() => {removeFromFolers(item,index)}}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        ))}
                                                    </List>
                                            :
                                                fing ?
                                                    // <RenderFoling />
                                                    <List dense sx={{color: "orangered"}}>
                                                        {Foling.map((item, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText primary={item} />
                                                            <ListItemSecondaryAction>
                                                            <IconButton
                                                                edge="end"
                                                                aria-label="delete"
                                                                onClick={() => {removeFromFoling(item,index)}}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        ))}
                                                    </List>
                                                :
                                                    <></>
                                        }
                                    </Box>
                            }
                        </Backdrop>
                    </tr>
                </table>
                <Button size="Large" onClick={Func} disabled = {(editable) && (uname.trim()=="" || uname==undefined) || (email.trim()=="" || email==undefined) || (fn.trim()=="" || fn==undefined)} sx={{
                    backgroundColor:"red",
                    color: "white",
                    position: "absolute",
                    fontSize: "2.5vw",
                    top: "87vh",
                    left: '55vw'
                }}>{buttVal}</Button>
            </>
            :
                <>
                    <div style={{color:"orangered"}}>
                        <CircularProgress color='inherit' />
                        <Typography color="orangered">Loading</Typography>
                    </div>
                </>
        }
        <Navbar />
        </>
    );
}

export default Profile;