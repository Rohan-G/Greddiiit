import { React, useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import LogIn from './LogIn.js';
import Main from './Main.js';
import Profile from './Profile.js';
import Logout from './Logout';
import Subs from './MySubs.js';
import MySubRender from './SpecSubs.js';
import SubUsers from './SubUsers.js';
import JoinReq from './joinReq.js';
import AllSubs from './AllSubs.js';
import AllSubsRenderer from './allSpecSubs.js';
import SavedPost from './SavedPosts.js';
import RepPost from './ReportedPosts.js';

function App() {
  const[user,setUser] = useState();
  
  useEffect(()=>{
    console.log("App");
    console.log(user);
  })
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Main user={user} changeUser={setUser} />} />
        <Route path="/login/" element={<LogIn user={user} changeUser={setUser}/>} />
        <Route path="/profile/" element={<Profile user={user} changeUser={setUser}/>} />
        <Route path="/logout/" element={<Logout user={user} changeUser={setUser}/>} />
        <Route path="/my-subgrediits/" element={<Subs user={user} changeUser={setUser}/>} />
        <Route path="/all-subgrediits/" element={<AllSubs user={user} changeUser={setUser}/>} />
        <Route path="/saved" element={<SavedPost user={user} changeUser={setUser} />} />
        <Route path="subgrediits/:subName/" element={<MySubRender user={user} changeUser={setUser}/>} />
        <Route path="subgrediits/:subName/users" element={<SubUsers/>}/>
        <Route path="subgrediits/:subName/join" element={<JoinReq />} />
        <Route path="/all-subgrediits/:subName" element={<AllSubsRenderer />} />
        <Route path="subgrediits/:subName/stats" />
        <Route path="subgrediits/:subName/reports" element={<RepPost />} />
      </Routes> 
    </>
  );
}

export default App;
