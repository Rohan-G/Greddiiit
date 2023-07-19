import React from 'react';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import Reddit from '@mui/icons-material/Reddit'
import Typography from '@mui/material/Typography';
import BookmarkIcon from '@mui/icons-material/Bookmark';

function Navbar() {
  console.log("Navbar")
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
          <th align="right" style={{paddingRight:"0.53vw"}}>
            <Reddit />
          </th>
          <td align="left">
            <Typography variant="h6">
            Greddiit
          </Typography></td>
          <td><IconButton edge="start" color="inherit" href="/all-subgrediits">
            <HomeIcon />
          </IconButton></td>
          <td><IconButton edge="start" color="inherit" href="/my-subgrediits">
            <ListIcon />
          </IconButton></td>
          <td><IconButton edge="start" color="inherit" href="/profile">
            <PersonIcon />
          </IconButton></td>
          <td><IconButton edge="start" color="inherit" href="/saved">
            <BookmarkIcon />
          </IconButton></td>
          <td><IconButton edge="start" color="inherit" href="/logout">
            <ExitToAppIcon />
          </IconButton></td>
        </tr>
      </table>
    </div>
  );
}

export default Navbar;