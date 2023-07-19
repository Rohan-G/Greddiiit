import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubNavbar from  "./SubGNav.js"
import { Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { Card, CardContent, CircularProgress, CardActions} from '@mui/material';

export default function JoinReq(props){
    const navigate = useNavigate();
    const [reqs,setReqs] = useState([]);
    const [fetched, setFetched] = useState(false);
    let { subName } = useParams()

    async function fetchData() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.get(`http://localhost:8000/api/subs/joins/${subName}`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                setReqs(res.data.my_data);
                setFetched(true);
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    async function approve(uname) {
        console.log("here");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try {
            const res = await axios.post('http://localhost:8000/api/subs/join/approve', { subName: subName, uname:uname }, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } })
            if (res.status == 200) {
                alert("Successfully Approved");
                fetchData();
            }
        } catch (err) {
            alert(err.response.data.error.msg);

        }
    }

    async function reject(uname) {
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try {
            const res = await axios.post('http://localhost:8000/api/subs/join/reject', { subName: subName, uname:uname }, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } })
            if (res.status == 200) {
                alert("Successfully Rejected");
                fetchData();
            }
        } catch (err) {
            alert(err.response.data.error.msg);

        }
    }

    useEffect(()=>{
        console.log("SubUsers");
        if (localStorage.getItem('user') == null) {
            navigate("/login");
        }
        else {
            fetchData();
        }
    },[])

    return(
        <>
            {
                fetched ?
                <>
                    <Typography variant = "h3" color="orangered" sx={{position:"absolute", top:"15vh", left:"45vw"}}>Join Requests</Typography>
                    <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"2vh", position:"absolute",top:"30vh",left:"5vw", right:"5vw"}}>
                        {reqs.length > 0 ?
                            reqs.map((userData, index) => (
                                <Card key={index} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"orange"}}>
                                    <CardContent>
                                        <Typography variant = "h4" component="h2">
                                            {userData}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton sx = {{color:"green"}} onClick={()=>{approve(userData)}}><CheckIcon /></IconButton>
                                        <IconButton sx = {{color:"red"}} onClick={()=>{reject(userData)}}><CloseIcon /></IconButton>
                                    </CardActions>
                                </Card>
                            ))
                            :
                                <Typography variant="h5" color="orangered">No Join Requests</Typography>
                        }
                    </div>
                </>
                :
                    <div style={{ color: "orangered", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress color='inherit' />
                        <Typography color="orangered">Loading</Typography>
                    </div>
            }
            <SubNavbar SubName = {subName}/>
        </>
    )
}