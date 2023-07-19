import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SubNavbar from  "./SubGNav.js"
import { Typography } from '@mui/material';
import SubUsers from './SubUsers.js';

export default function MySubRender(props){
    let { subName } = useParams();
    return(
        <>
            <Typography component="h1" variant="h1" color="orangered"
            sx={{
            }}>{subName}</Typography>
            <SubNavbar SubName={subName}/>
        </>
    );
}
