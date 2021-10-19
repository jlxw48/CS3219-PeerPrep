import './css/App.css';
import React from 'react';
import { useState } from 'react';
import PeerPrepNav from './components/PeerPrepNav';
import Home from './components/home/Home';
import Login from './components/login/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Practice from './components/practice/Practice';
import ReactTimeAgo from 'react-time-ago'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <PeerPrepNav />
        <ToastContainer />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path="/practice">
            <Practice />
          </Route>
          <Route path="/register" >
            <Login isRegister={true} />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;