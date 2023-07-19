import React from 'react';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import Reddit from '@mui/icons-material/Reddit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function SubNavbar(props) {
    const navigate = useNavigate();
  console.log("SubNavbar");
  return (
    <div style={{position:"sticky", top:0}}>
      <table style={{
        color: "orangered",
        backgroundColor: "white", 
        position: 'fixed',
        width: '100vw',
        height: '8vh',
        top: 0,
        left: 0
      }}>
        <tr>
          <th align="right" style={{paddingRight:"0.53vw"}} rowSpan={2}>
            <Reddit />
          </th>
          <td align="left" rowSpan={2}>
            <Typography variant="h6">
            Greddiit
          </Typography></td>
          <td rowSpan={2} align="center"><IconButton edge="start" color="inherit" href="/all-subgrediits">
            <HomeIcon />
          </IconButton></td>
          <td colspan={4} align="center"><IconButton edge="start" color="inherit" href="/my-subgrediits">
            <ListIcon />
          </IconButton></td>
          <td rowSpan={2} align="center"><IconButton edge="start" color="inherit" href="/profile">
            <PersonIcon />
          </IconButton></td>
          <td rowSpan={2} align="center"><IconButton edge="start" color="inherit" href="/saved">
            <BookmarkIcon />
          </IconButton></td>
          <td rowSpan={2} align="center"><IconButton edge="start" color="inherit" href="/logout">
            <ExitToAppIcon />
          </IconButton></td>
        </tr>
        <tr>
          <td align="center"><IconButton edge="start" color="inherit" onClick={()=>{navigate(`/subgrediits/${props.SubName}/users`)}}>
            <PeopleIcon />
          </IconButton></td>
          <td align="center"><IconButton edge="start" color="inherit" onClick={()=>{navigate(`/subgrediits/${props.SubName}/join`)}}>
            <PersonAddIcon />
          </IconButton></td>
          <td align="center"><IconButton edge="start" color="inherit" onClick={()=>{navigate(`/subgrediits/${props.SubName}/stats`)}}>
            <AnalyticsIcon />
          </IconButton></td>
          <td align="center"><IconButton edge="start" color="inherit" onClick={()=>{navigate(`/subgrediits/${props.SubName}/reports`)}}>
            <ReportIcon />
          </IconButton></td>
        </tr>
      </table>
    </div>
  );
}