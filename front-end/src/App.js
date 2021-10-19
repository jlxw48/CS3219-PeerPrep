import './css/App.css';
import React from 'react';
import { useState } from 'react';
import PeerPrepNav from './components/PeerPrepNav';
import Home from './components/home/Home';
import Login from './components/login/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import APIErrorNotification from './components/ApiErrorNotification';
import Practice from './components/practice/Practice';
import ReactTimeAgo from 'react-time-ago'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ErrorContext = React.createContext();

function App() {
  // Pass around an array of errors
  const [errors, setErrors] = useState([]);
  const addError = (err) => {
    setErrors(old => [...old, err]);
  }
  const removeError = (idx) => {
    const currErrors = errors;
    let newErrors = []
    for (let i = 0; i < currErrors.length; i++) {
      if (i == idx) {
        continue;
      }
      newErrors.push(currErrors[i]);
    }
    setErrors(newErrors);
  }
  const errorsContextValue = {
    errors,
    addError: addError,
    removeError: removeError
  };

  return (
    <>
      
      <Router>
      
        <PeerPrepNav />
        <ErrorContext.Provider value={errorsContextValue}>
          <APIErrorNotification />
        </ErrorContext.Provider>
        <Switch>
          <Route exact path='/'>
            <ErrorContext.Provider value={errorsContextValue}>
              <Home />
            </ErrorContext.Provider>
          </Route>
          <Route path='/login'>
            <ErrorContext.Provider value={errorsContextValue}>
              <Login />
            </ErrorContext.Provider>
          </Route>
          <Route path="/practice">
            <ErrorContext.Provider value={errorsContextValue}>
              <Practice />
            </ErrorContext.Provider>
          </Route>
          <Route path="/register" >
            <ErrorContext.Provider value={errorsContextValue}>
              <Login isRegister={true} />
            </ErrorContext.Provider>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;