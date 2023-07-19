import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubNavbar from  "./SubGNav.js"
import { Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CircularProgress, CardActions} from '@mui/material';
import Button from '@mui/material/Button';

export default function RepPost(props){
    const navigate = useNavigate();
    const [reqs,setReqs] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [blockDisabled, setDisable] = useState(false);
    const [currDisable, setCurr] = useState();
    const [tLeft, setTLeft] = useState(3);
    const [tID, setTID] = useState();
    let { subName } = useParams();

    async function fetchData() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.get(`http://localhost:8000/api/report/${subName}`, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                setReqs(res.data);
                setFetched(true);
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    async function ignore(id){
        try{
            const res = await axios.delete(`http://localhost:8000/api/report/${id}`,{ headers: { 'x-auth-token': String(localStorage.getItem('user'))}});
            if(res.status==200) {
                fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    async function del(id){
        try{
            const res = await axios.delete(`http://localhost:8000/api/posts/${id}`,{ headers: { 'x-auth-token': String(localStorage.getItem('user'))}});
            if(res.status==200) {
                fetchData();
            }
        }catch(err){
            alert(err.response.data.error.msg);
        }
    }

    useEffect(()=>{
        console.log(tLeft);
        if(tLeft==0){
            console.log(tLeft);
            setTLeft(3);
            clearInterval(tID);
            setDisable(false);
            callBlock(currDisable);
        }
    },[tLeft]);

    async function block(id){
        setDisable(true);
        setCurr(id);
        let ret = setInterval(()=>{
            setTLeft(prevVal => prevVal - 1);
        },1000);
        setTID(ret);
    }

    async function callBlock(id){
        try{
            const res = await axios.post(`http://localhost:8000/api/report/block`, {repID:id}, { headers: { 'x-auth-token': String(localStorage.getItem('user'))}});
            if(res.status==200){
                fetchData();
                console.log("Blocked");
            }
        }catch(err){
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
                    <Typography variant = "h3" color="orangered" sx={{position:"absolute", top:"15vh", left:"45vw"}}>Reports</Typography>
                    <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"5vw", position:"absolute",top:"30vh",left:"5vw", right:"5vw"}}>
                        {reqs.length > 0 ?
                            reqs.map((userData, index) => (
                                <Card key={index} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"orange"}}>
                                    <CardContent>
                                        <p>
                                            <Typography><b>Reporter</b></Typography>
                                            <Typography>
                                                {userData.Reporter}
                                            </Typography>
                                        </p>
                                        <p>
                                            <Typography><b>Reported</b></Typography>
                                            <Typography>
                                                {userData.Reported}
                                            </Typography>
                                        </p>
                                        <p>
                                            <Typography><b>Content Reported</b></Typography>
                                            <Typography>
                                                {userData.Text}
                                            </Typography>
                                        </p>
                                        <p>
                                            <Typography><b>Reason</b></Typography>
                                            <Typography>
                                                {userData.Details}
                                            </Typography>
                                        </p>
                                    </CardContent>
                                    <CardActions>
                                        {
                                            blockDisabled ?
                                                userData._id==currDisable ?
                                                    <Button onClick={()=>{clearInterval(tID); setTLeft(3); setDisable(false);}}>Cancel in {tLeft}</Button>
                                                :
                                                    <Button onClick={()=>{block(userData._id)}} disabled="true">Block</Button>
                                            :
                                            <Button onClick={()=>{block(userData._id)}}>Block</Button>
                                        }
                                        <Button onClick={()=>(del(userData.Post))}>Delete</Button>
                                        <Button onClick={()=>{ignore(userData._id)}}>Ignore</Button>
                                    </CardActions>
                                </Card>
                            ))
                            :
                                <Typography variant="h5" color="orangered">No Reports</Typography>
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