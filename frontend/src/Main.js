import { React, useEffect, useState } from 'react';
import './App.css';
import './main.css';
import Logo from './reddit.png'
import { Link } from 'react-router-dom';

function Main(props) {
  useEffect(()=>{
    console.log("Main");
    console.log(props.user);
  },[])
    return (
        <>
          <div id = "logo">
              <img src = {Logo} alt="redditLogo" />
              <p id = "name">greddiit</p>
              <Link to="/login"><button id="li">Log In/Sign Up</button></Link> 
          </div>
        </>
      );
}
export default Main;