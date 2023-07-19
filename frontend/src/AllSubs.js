import { React, useEffect, useState } from 'react';
import { IconButton, Typography, CircularProgress, CardActions, TextField } from '@mui/material';
import Navbar from './Navbar.js';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent} from '@mui/material';
import Fuse from 'fuse.js';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

function AllSubs(props) {
    const navigate = useNavigate();
    const [gotData, updateGotData] = useState(false);
    const [mySubs, updateMySubs] = useState([]);
    const [subs, updateSubs] = useState([]);
    const [tags,setTags] = useState([]);
    const [dispSubs, updateDispSubs] = useState([]);
    const [searchVal, updateSearchVal] = useState("");
    const [lastFuzzy, updateLastFuzzy] = useState([]);
    const [tagFilter, setTagFilters] = useState([]);
    const [lastTag, setLastTag] = useState([]);
    const [sortType, setSortType] = useState(0);
    const [order, setOrder] = useState(0);

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setTagFilters(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    function nameAsc(a,b){
        return a.content.Name.localeCompare(b.content.Name);
    }
    function nameDesc(a,b){
        return b.content.Name.localeCompare(a.content.Name);
    }

    function folAsc(a,b){
        return a.content.Followers.length - b.content.Followers.length;
    }
    function folDesc(a,b){
        return b.content.Followers.length - a.content.Followers.length;
    }

    function dateAsc(a,b){
        return a.content.CreateDate - b.content.CreateDate;
    }
    function dateDesc(a,b){
        return b.content.CreateDate - a.content.CreateDate;
    }

    useEffect(()=>{
        console.log(dispSubs);
    },[dispSubs]);

    useEffect(()=>{
        updateDispSubs(subs);
        updateLastFuzzy(subs);
        // console.log(subs);
    },[subs])

    function updFuzzy(){
        if(searchVal==""){
            updateLastFuzzy(subs);
        }
        else{
            const options={
                keys:[
                    "content.Name"
                ]
            };
            // console.log(subs);
            const fuse = new Fuse(subs,options);
            const newArr = fuse.search(searchVal);
            let updatedArr = []
            for(let i=0;i<newArr.length;i++){
                updatedArr.push(newArr[i].item);
            }
            // console.log(updatedArr);
            updateLastFuzzy(updatedArr);
        }
    }

    function updTag(){
        if(tagFilter==null || tagFilter.length==0){
            setLastTag(lastFuzzy);
        }
        else{
            let newArr = lastFuzzy.slice();
            let updatedArr = [];
            // console.log(newArr);
            for(let i=0; i<newArr.length;i++){
                let c = 0;
                for(let j=0;j<newArr[i].content.Tags.length; j++){
                    if(tagFilter.includes(newArr[i].content.Tags[j])){
                        console.log(newArr[i].content.Tags[j]);
                        c = 1;
                        break;
                    }
                }
                if(c===1){
                    updatedArr.push(newArr[i]);
                }
            }
            // console.log(newArr);
            setLastTag(updatedArr);
        }
    }

    function updSort(){
        if(order==0 || sortType==0){
            updateDispSubs(lastTag);
        }
        else{
            let newArr = lastTag.slice();
            if(order==1){
                if(sortType==1){
                    newArr.sort(nameAsc);
                    console.log(newArr);
                }
                else if(sortType==2){
                    newArr.sort(folAsc);
                }
                else{
                    newArr.sort(dateAsc);
                }
            }
            else if(order==2){
                if(sortType==1){
                    newArr.sort(nameDesc);
                }
                else if(sortType==2){
                    newArr.sort(folDesc);
                }
                else{
                    newArr.sort(dateDesc);
                }
            }
            updateDispSubs(newArr);
        }

    }

    useEffect(()=>{
        if(order==0){
            updateDispSubs(lastTag);
        }
        else if(sortType==0){
            alert("Please choose a sorting schema first");
        }
        else{
            updSort();
        }
    },[order])

    useEffect(()=>{
        if(sortType==0){
            updateDispSubs(lastTag);
        }
        else if(order==0){
            alert("Please choose a sorting order");
        }
        else{
            updSort();
        }
    },[sortType]);

    useEffect(()=>{
        updTag();
    },[tagFilter]);

    useEffect(()=>{
        updSort();
    },[lastTag])

    // useEffect(()=>{
    //     console.log(tags);
    // },[tags])

    useEffect(()=>{
        updFuzzy();
    },[searchVal])

    useEffect(()=>{
        updTag();
    },[lastFuzzy]);

    async function fetchData() {
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.get('http://localhost:8000/api/subs/all', { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            updateSubs([]);
            setTags([]);
            if (res.status == 200) {
                for(let i=0;i<4;i++){
                    for(let j=0; j<res.data[i].length;j++){
                        updateSubs(prevVal=>[...prevVal, {Type:i, content:res.data[i][j]}]);
                        for(let k=0;k<res.data[i][j].Tags.length;k++){
                            setTags(prevVal=>[...prevVal, res.data[i][j].Tags[k]]);
                        }
                    }
                }
                console.log(res.data);
                updateMySubs(res.data);
                updateGotData(true);
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    async function Leave(subName){
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.post('http://localhost:8000/api/subs/leave', {subName:subName}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                fetchData();
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    async function Join(subName){
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        try {
            const res = await axios.post('http://localhost:8000/api/subs/join', {subName:subName}, { headers: { 'x-auth-token': String(localStorage.getItem('user')) } });
            if (res.status == 200) {
                fetchData();
            }
        } catch (err) {
            // console.log(err.response.data);
            alert(err.response.data.error.msg);
        }
    }

    useEffect(() => {
        console.log("All Subs");
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
                            }}>All SubGreddiits Page</Typography>

                        <Typography component="h4" color="orangered"></Typography>
                        <TextField label="Search" sx={{position:"absolute", top:"30vh", left:"5vw", bgcolor:"#ffffff", color:"orangered", width:"30vw", fontSize:"1.5vw"}} InputProps={{ style:{color:'orangered'} }} onChange={(value)=>{ updateSearchVal(value.target.value) }} value = {searchVal} />
                        <div>
                            <FormControl sx={{position: "absolute", top:"30vh", left: "42vw" ,width: "14vw", bgcolor:"#ffffff" }}>
                                <InputLabel>Tag Filters</InputLabel>
                                <Select
                                multiple
                                value={tagFilter}
                                onChange={handleChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(', ')}
                                >
                                {tags.map((name, index) => (
                                    <MenuItem key={index} value={name}>
                                    <Checkbox checked={tagFilter.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                        <FormControl sx={{ minWidth: "5vw", bgcolor:"#ffffff", position:"absolute", top:"30vh", left:"68vw" }}>
                            <InputLabel>Sort Type</InputLabel>
                            <Select
                            value={sortType}
                            onChange={(event)=>{setSortType(event.target.value)}}
                            autoWidth
                            label="Sort Type"
                            >
                            <MenuItem value={0}>None</MenuItem>
                            <MenuItem value={1}>Name</MenuItem>
                            <MenuItem value={2}>Followers</MenuItem>
                            <MenuItem value={3}>Creation Date</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: "5vw", bgcolor:"#ffffff", position:"absolute", top:"30vh", left:"75vw" }}>
                            <InputLabel>Sort Order</InputLabel>
                            <Select
                            value={order}
                            onChange={(event)=>{setOrder(event.target.value)}}
                            autoWidth
                            label="Sort Type"
                            >
                            <MenuItem value={0}>None</MenuItem>
                            <MenuItem value={1}>Ascending</MenuItem>
                            <MenuItem value={2}>Descending</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                        <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"5vw", position:"absolute",top:"50vh",left:"5vw", right:"5vw", paddingBottom: "10vh"}}>
                            {/* {mySubs[0].length > 0 ?
                                mySubs[0].map((subData) => (
                                    <Card key={subData._id} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red", '&:hover':{bgcolor:"red", color:"white", cursor:"pointer"}}} onClick = {()=>{navigate(`/all-subgrediits/${subData.Name}`)}}>
                                        <CardContent>
                                            <Typography variant = "h3" component="h2">
                                                {subData.Name}
                                            </Typography>
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
                                        </CardContent>
                                        <CardActions>
                                            <Button disabled="true">Leave SubGreddit</Button>
                                        </CardActions>
                                    </Card>
                                ))
                                :
                                <></>
                            }
                            {mySubs[1].length > 0 ?
                                mySubs[1].map((subData) => (
                                    <Card key={subData._id} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red", '&:hover':{bgcolor:"red", color:"white", cursor:"pointer"}}}>
                                        <CardContent  onClick = {()=>{navigate(`/all-subgrediits/${subData.Name}`)}}>
                                            <Typography variant = "h3" component="h2">
                                                {subData.Name}
                                            </Typography>
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
                                        </CardContent>
                                        <CardActions>
                                            <Button onClick={()=>{Leave(subData.Name)}}>Leave SubGreddit</Button>
                                        </CardActions>
                                    </Card>
                                ))
                                :
                                    <></>
                            }
                            {mySubs[2].length > 0 ?
                                mySubs[2].map((subData) => (
                                    <Card key={subData._id} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red"}}>
                                        <CardContent>
                                            <Typography variant = "h3" component="h2">
                                                {subData.Name}
                                            </Typography>
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
                                        </CardContent>
                                        <CardActions>
                                            <Button onClick={()=>{Join(subData.Name)}}>Join SubGreddit</Button>
                                        </CardActions>
                                    </Card>
                                ))
                                :
                                <></>
                            }
                            {mySubs[3].length > 0 ?
                                mySubs[3].map((subData) => (
                                    <Card key={subData._id} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red"}}>
                                        <CardContent>
                                            <Typography variant = "h3" component="h2">
                                                {subData.Name}
                                            </Typography>
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
                                        </CardContent>
                                        <CardActions>
                                            <Button onClick={()=>{alert("Left the Sub. Cannot request to join again")}}>Join SubGreddit</Button>
                                        </CardActions>
                                    </Card>
                                ))
                                :
                                <></>
                            } */}
                            {dispSubs.length > 0 ?
                                dispSubs.map((subData) => (
                                    <Card key={subData._id} sx={{position:"relative",width:"26vw", bgcolor:"#202224", color:"red", '&:hover':{bgcolor:"red", color:"white", cursor:"pointer"}}}>
                                    {
                                        subData.Type == 0 || subData.Type == 1 ?
                                            <CardContent  onClick = {()=>{navigate(`/all-subgrediits/${subData.content.Name}`)}}>    
                                                <Typography variant = "h3" component="h2">
                                                    {subData.content.Name}
                                                </Typography>
                                                <p>
                                                    <Typography><b>Description:</b></Typography>
                                                    <Typography>{subData.content.Description}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Number of people:</b></Typography>
                                                    <Typography>{subData.content.Followers.length}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Number of posts:</b></Typography>
                                                    <Typography>{subData.content.Posts.length}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Tags</b></Typography>
                                                    <Typography>{subData.content.Tags.join(', ')}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Banned Keywords:</b></Typography>
                                                    <Typography>{subData.content.BannedKeywords.join(', ')}</Typography>
                                                </p>
                                            </CardContent>
                                        :
                                            <CardContent onClick = {()=>{alert("Must Join Sub to view it")}}>
                                                <Typography variant = "h3" component="h2">
                                                    {subData.content.Name}
                                                </Typography>
                                                <p>
                                                    <Typography><b>Description:</b></Typography>
                                                    <Typography>{subData.content.Description}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Number of people:</b></Typography>
                                                    <Typography>{subData.content.Followers.length}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Number of posts:</b></Typography>
                                                    <Typography>{subData.content.Posts.length}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Tags</b></Typography>
                                                    <Typography>{subData.content.Tags.join(', ')}</Typography>
                                                </p>
                                                <p>
                                                    <Typography><b>Banned Keywords:</b></Typography>
                                                    <Typography>{subData.content.BannedKeywords.join(', ')}</Typography>
                                                </p>
                                            </CardContent>
                                    }
                                        <CardActions>
                                            {
                                                subData.Type == 3 ?
                                                    <Button onClick={()=>{alert("Left the Sub. Cannot request to join again")}}>Join SubGreddit</Button>
                                                :
                                                    subData.Type == 2 ?
                                                        <Button onClick={()=>{Join(subData.content.Name)}}>Join SubGreddit</Button>
                                                    :
                                                        subData.Type == 1 ?
                                                            <Button onClick={()=>{Leave(subData.content.Name)}}>Leave SubGreddit</Button>
                                                        :
                                                            <Button disabled="true">Leave SubGreddiit</Button>
                                            }
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

export default AllSubs;