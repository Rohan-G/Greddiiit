import { React, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogIn(props) {

    const [uname, setUname] = useState();
    const [pass, setPass] = useState();
    const [mode, setMode] = useState("Login");
    const[SuUname,setSuUname] = useState();
    const[SuPass,setSuPass] = useState();
    const[fn,setFn] = useState();
    const[ln,setLn] = useState();
    const[email,setEmail] = useState();
    const[phNo,setPhNo] = useState();
    const[ag,setAg] = useState();

    const navigate = useNavigate();

    axios.defaults.headers.common['Content-Type'] = 'application/json';

    useEffect(()=>{
        if(localStorage.getItem('user')!=null){
            navigate("/profile");
        }
    },[])

    async function submission() {
        try{
            // const rawRes = await fetch('http://localhost:8000/api/auth',{method:'POST', headers:{ 'Content-Type' : 'application/json' } ,body: JSON.stringify({username: uname, password: pass})})
            // const res = await rawRes.json();
            const res = await axios.post('http://localhost:8000/api/auth', {username: uname, password: pass})
            if(res.status==200){
                console.log("Successful Login!");
                localStorage.setItem('user',res.data.token);
                navigate("/profile");
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
        // if (uname === "admin" && pass === "admin") {
        //     props.changeUser(uname);
        //     navigate("/profile");
        // }
        // else {
        //     alert("Incorrect Username/Password");
        // }
    }

    async function SuSubmission() {
        try{
            const res = await axios.post('http://localhost:8000/api/user', {fname: fn, lname: ln, uname: SuUname, email: email, age: ag, cn: phNo, pass: SuPass});
            if(res.status==200){
                console.log("Successful SignUp!");
                setUname(SuUname);
                setPass(SuPass);
                setMode("Login");
                alert("Successful Sign Up!\nLog In to Continue");
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    return (
        <Box
            sx={{
                top: '5vh',
                width: '30vw',
                height: '90vh',
                backgroundColor: '#ffecec',
                borderRadius: 15,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <ToggleButtonGroup color="primary" value={mode} exclusive onChange={(event, newMode) => { if (newMode != null) { setMode(newMode) } }}
                sx={{
                    margin: 5,
                    position: 'absolute',
                    top: '3vh'
                }} >
                <ToggleButton value="Login">Log in</ToggleButton>
                <ToggleButton value="Signup">Sign Up</ToggleButton>
            </ToggleButtonGroup>
            {
                mode === "Login" ?
                    <>
                        <Typography component='h1' variant='h2'
                            sx={{
                                color: '#F6472C'
                            }}>Log In</Typography>
                        <TextField id="outlined basics" label="Username" variant="outlined" size="medium" margin='normal' onChange={(uname) => { setUname(uname.target.value) }} value={uname}
                            sx={{
                                color: '#F6472C',
                                position: 'relative'
                            }} />
                        <TextField id="outlined basics" label="Password" variant="outlined" type="password" size="medium" margin='normal' onChange={(pass) => { setPass(pass.target.value) }} disabled={(uname == undefined || uname.trim() == "")} value={pass}
                            sx={{
                                position: 'relative'
                            }} />
                        <Button type="submit" variant="contained" onClick={submission} disabled={(pass == undefined || pass == "")}
                            sx={{
                                mt: 2,
                                backgroundColor: "orangered"
                            }}>Submit</Button>
                    </>
                    :
                    <>
                        <Typography component='h1' variant='h2'
                            sx={{
                                position: 'absolute',
                                top: '18vh',
                                color: '#F6472C'
                            }}>Sign Up</Typography>
                        <TextField id="outlined basics" label="First Name (*)" variant="outlined" size="medium" margin='normal' onChange={(fn) => { setFn(fn.target.value) }} value={fn}
                            sx={{
                                width: "10vw",
                                position: 'absolute',
                                top: "24.8vh",
                                left: "4vw"
                            }} />
                        <TextField id="outlined basics" label="Last Name" variant="outlined" size="medium" margin='normal' onChange={(ln) => { setLn(ln.target.value) }} value={ln}
                            sx={{
                                width: "10vw",
                                position: 'absolute',
                                top: "24.8vh",
                                left: "16vw"
                            }} />
                        <TextField id="outlined basics" label="Age (*)" variant="outlined" size="medium" margin='normal' type="number" onChange={(ag) => { setAg(ag.target.value) }} value={ag}
                            sx={{
                                width: "4vw",
                                position: 'absolute',
                                top: "32.8vh",
                                left: "7vw"
                            }} />
                        <TextField id="outlined basics" label="Contact Number (*)" variant="outlined" size="medium" margin='normal' type="number" onChange={(phNo) => { setPhNo(phNo.target.value) }} value={phNo}
                            sx={{
                                width: "13vw",
                                position: 'absolute',
                                top: "32.8vh",
                                left: "13vw"
                            }} />
                        <TextField id="outlined basics" label="Email (*)" variant="outlined" size="medium" margin='normal' onChange={(email) => { setEmail(email.target.value) }} value={email}
                            sx={{
                                width: "12vw",
                                position: 'absolute',
                                top: "40.8vh",
                                left: "9vw"
                            }} />
                        <TextField id="outlined basics" label="Username (*)" variant="outlined" size="medium" margin='normal' onChange={(uname) => { setSuUname(uname.target.value) }} value={SuUname}
                            sx={{
                                width: "12vw",
                                position: 'absolute',
                                top: "48.8vh"
                            }} />
                        <TextField id="outlined basics" label="Password (*)" variant="outlined" size="medium" margin='normal' type="password" onChange={(pass) => { setSuPass(pass.target.value) }} value={SuPass}
                            sx={{
                                width: "12vw",
                                position: 'absolute',
                                top: "56.8vh"
                            }} />
                        <Button type="submit" variant="contained" onClick = {SuSubmission} disabled = {(SuPass=="" || SuPass==undefined) || (SuUname.trim()=="" || SuUname==undefined) || (email.trim()=="" || email==undefined) || (phNo.trim()=="" || phNo==undefined) || (ag.trim()=="" || ag==undefined) || (fn.trim()=="" || fn==undefined)}
                            sx={{
                                mt: 2,
                                backgroundColor: "orangered",
                                position: "absolute",
                                top: "64.8vh"
                            }}>Submit</Button>
                    </>
            }
        </Box>
    );
}

export default LogIn;