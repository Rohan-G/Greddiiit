import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubNavbar from  "./SubGNav.js"
import { Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CircularProgress} from '@mui/material';


export default function SubUsers(props){
    const navigate = useNavigate();
    const [blocked,setBlocked] = useState([]);
    const [notBlocked, setNotBlocked] = useState([]);
    const [fetched, setFetched] = useState(false);
    let { subName } = useParams()

    async function fetchData() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.get(`http://localhost:8000/api/subs/users/${subName}`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                setBlocked(res.data.Blocked);
                setNotBlocked(res.data.Normal);
                setFetched(true);
            }
        } catch (err) {
            // console.log(err.response.data);
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
                    <div style={{display:"flex", flexDirection:"column", flexWrap:"no-wrap", gap:"2vh", position:"absolute",top:"30vh",left:"5vw", right:"5vw"}}>
                        <Typography color={"orangered"} variant="h1">Not Blocked:</Typography>
                        {notBlocked.length > 0 ?
                            notBlocked.map((userData, index) => (
                                <Card key={index} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"orange"}}>
                                    <CardContent>
                                        <Typography variant = "h4" component="h2">
                                            {userData}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                            :
                                <Typography variant="h3" color="orangered">No UnBlocked Followers</Typography>
                        }
                    </div>
                    <div style={{display:"flex", flexDirection:"column", flexWrap:"no-wrap", gap:"2vh", position:"absolute",top:"30vh",left:"60vw", right:"5vw"}}>
                        <Typography color={"orangered"} variant="h1">Blocked:</Typography>
                        {blocked.length > 0 ?
                            blocked.map((userData, index) => (
                                <Card key={index} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red"}}>
                                    <CardContent>
                                        <Typography variant = "h4" component="h2">
                                            {userData}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                            :
                                <Typography variant="h3" color="orangered">No Blocked Followers</Typography>
                        }
                    </div>
                    <SubNavbar SubName = {subName} />
                </>
                :
                    <div style={{ color: "orangered", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress color='inherit' />
                        <Typography color="orangered">Loading</Typography>
                    </div>
            }
        </>
    )
}