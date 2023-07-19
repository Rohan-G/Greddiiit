import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function Logout(props){
    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.removeItem('user'); 
        props.changeUser(); 
        navigate("/");
    },[]);

    return(
        <Typography component="h1" variant="h3">
            Logging Out
        </Typography>
    );
}