import { React, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Typography, CircularProgress, CardActions } from '@mui/material';
import Navbar from './Navbar.js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardContent} from '@mui/material';
import Delete from '@mui/icons-material/Delete';


function Subs(props) {
    const navigate = useNavigate();
    const [gotData, updateGotData] = useState(false);
    const [mySubs, updateSubs] = useState([]);
    const [open, setOpen] = useState(false);
    const [subName, setSubName] = useState();
    const [tags, setTags] = useState();
    const [desc, setDesc] = useState();
    const [bk, setBK] = useState();
    const [image, setImage] = useState();
    const [b64img, setB64Img] = useState();
    const [dis, setDis] = useState(false);

    function dispForm() {
        setOpen(true);
    }
    function handleClose() {
        setSubName();
        setTags();
        setDesc();
        setBK();
        setImage(null);
        setOpen(false);
    }
    async function delSub(sName){
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try{
            // console.log(String(localStorage.getItem('user')));
            const res = await axios.delete('http://localhost:8000/api/subs', { headers: { 'x-auth-token': String(localStorage.getItem('user')) } , data: { subName: sName } })
            if(res.status == 200){
                alert("Deleted successfully");
                fetchData();
            }
        } catch(err){
            alert(err.response.data.error.msg);
        }
    }
    async function handleSubmit() {
        // console.log(subName);
        // console.log(tags);
        // console.log(desc);
        // console.log(bk);
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        try {
            const res = await axios.post('http://localhost:8000/api/subs', { name: subName, description: desc, tags: tags, bannedKeywords: bk, img: b64img }, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } })
            if (res.status == 200) {
                alert("Successfully Added");
                window.location.reload(true);
            }
        } catch (err) {
            alert(err.response.data.error.msg);

        }
    }

    useEffect(()=>{
        if(bk!=null){
            if(bk[bk.length - 1].trim().indexOf(' ') >= 0){
                alert("Banned Keywords cannot have multiple words");
                setDis(true);
            }
            else{
                setDis(false);
            }
        }
    },[bk])

    useEffect(()=>{
        if(tags!=null){
            if(tags[tags.length - 1].trim().indexOf(' ') >= 0){
                alert("Tags cannot have multiple words");
                setDis(true);
            }
            else{
                setDis(false);
            }
            if(tags[tags.length - 1] === tags[tags.length - 1].toLowerCase()){
                setDis(false);
            }
            else{
                alert("Tags must be lower case");
                setDis(true);
            }
        }
    },[tags]);

    function toBase64(file){
        if(file.size/1024 > 50){
            console.log(file.size);
            alert("Image too big. Choose another one");
            setImage(null);
            return null;
        }
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (err) => {
                reject(err);
            }
        })
    }

    async function fetchData() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.get('http://localhost:8000/api/subs/my', { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                console.log(res.data);
                updateSubs(res.data);
                updateGotData(true);
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    useEffect(() => {
        console.log("MySubs");
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
                                top: '13vh',
                                left: '25vw'
                            }}>My SubGreddiits Page</Typography>
                        <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"5vw", position:"absolute",top:"30vh",left:"5vw", right:"5vw"}}>
                            {mySubs.length > 0 ?
                                mySubs.map((subData) => (
                                    <Card key={subData._id} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red"}}>
                                        <CardContent>
                                            <Typography variant = "h3" component="h2">
                                                {subData.Name}
                                            </Typography>
                                            <IconButton onClick={()=>delSub(subData.Name)} color="inherit" sx={{ position: "absolute", top: "1.5vh", right: "1vw" }}><Delete /></IconButton>
                                            <p>
                                                <Typography><b>Description:</b></Typography>
                                                <Typography>{subData.Description}</Typography>
                                            </p>
                                            <p>
                                                <Typography><b>Number of people:</b></Typography>
                                                <Typography>{subData.Followers.length}</Typography>
                                            </p>
                                            <p>
                                                <Typography><b>Number of posts:</b></Typography>
                                                <Typography>{subData.Posts.length}</Typography>
                                            </p>
                                            <p>
                                                <Typography><b>Banned Keywords:</b></Typography>
                                                <Typography>{subData.BannedKeywords.join(', ')}</Typography>
                                            </p>
                                            <CardActions>
                                                <Button onClick={()=>{navigate(`/subgrediits/${subData.Name}`)}}>Open {subData.Name}</Button>
                                            </CardActions>
                                        </CardContent>
                                    </Card>
                                ))
                                :
                                    <Typography variant="h3" color="orangered">No SubGreddiits</Typography>
                            }
                        </div>
                        <div style={{ color: "orangered", backgroundColor: "white", borderRadius: "50vw", display: "flex", alignItems: "center", justifyContent: "center", height: "3vw", width: "3vw", cursor: 'pointer', position: "fixed", left: "95vw", top: "90vh" }}>
                            <IconButton color="inherit" onClick={dispForm} sx={{ width: "3vw", height: "3vw" }}><AddIcon /></IconButton>
                            <Dialog fullScreen open={open} onClose={handleClose}>
                                <DialogTitle>
                                    New SubGreddiit
                                    <IconButton onClick={handleClose} sx={{ position: "absolute", top: 0, right: 0 }}><CloseIcon /></IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <TextField
                                        fullWidth
                                        onChange={(value) => { setSubName(value.target.value) }}
                                        label="Name"
                                        variant="standard"
                                    />
                                    <TextField
                                        fullWidth
                                        onChange={(value) => { setDesc(value.target.value) }}
                                        multiline
                                        label="Description"
                                        variant="standard"
                                    />
                                    <TextField
                                        fullWidth
                                        onChange={(value) => { setTags((value.target.value.trim()).split(",")) }}
                                        label="Tags (separated by commas)"
                                        variant="standard"
                                    />
                                    <TextField
                                        fullWidth
                                        maxWidth="sm"
                                        onChange={(value) => { setBK((value.target.value.trim()).split(",")) }}
                                        label="Banned Keywords (separated by commas)"
                                        variant="standard"
                                    />
                                    <br />
                                    <br />
                                    <Typography>Image:</Typography>
                                    <Button><input type="file" accept="image/*" onChange={async (e)=>{setImage(e.target.files[0]); setB64Img(await toBase64(e.target.files[0]))}} /></Button>
                                    <br />
                                    <br />
                                    {
                                        b64img ?
                                        <>
                                            <img src = {b64img} />
                                        </>
                                        :
                                        <></>
                                    }
                                </DialogContent>
                                <DialogActions>
                                    <Button disabled = {subName==undefined || desc==undefined || dis} onClick={handleSubmit}>Submit</Button>
                                </DialogActions>
                            </Dialog>
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

export default Subs;