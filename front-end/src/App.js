import './css/App.css';
import React from 'react';
import { useEffect } from 'react';
import PeerPrepNav from './components/PeerPrepNav';
import Home from './components/home/Home';
import Login from './components/login/Login';
import { BrowserRouter, Router, Switch, Route } from 'react-router-dom';
import Practice from './components/practice/Practice';
import ReactTimeAgo from 'react-time-ago'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import useState from 'react-usestateref';
import axios from 'axios';
import { VALIDATE_LOGIN_URL, MATCH_GET_INTERVIEW_URL } from "./Api.js"
import { useHistory } from "react-router-dom";
import LoadingScreen from './components/LoadingScreen';


export const AppContext = React.createContext();


function App() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser, userRef] = useState(null);
  const [match, setMatch, matchRef] = useState(null);
  let context = {
    user: user,
    setUser: setUser,
    userRef: userRef,
    match: match,
    matchRef: matchRef,
    setMatch: setMatch
  }

  function redirectToPractice() {
    history.push({ pathname: '/practice' });
  }

  function redirectToHome() {
    history.push({ pathname: '/' });
  }

  const EndInterViewToastMsg = () => (<p>Interview successfully resumed. Click <b>End Interview</b> to find another match.</p>)

  function checkLogin() {
    return axios.get(VALIDATE_LOGIN_URL).then(res => {
      if (res.status == 200) {
        setUser(res.data.data);
      }
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    }); // No JWT cookie or invalid JWT cookie
  }

  function checkIfUserInMatch() {
    axios.get(MATCH_GET_INTERVIEW_URL + `?email=${userRef.current.email}`).then(res => {
      if (res.status == 200 && res.data.status == "success") {
        setMatch(res.data.data);
        return true;
      } else {
        return false;
      }
    }).then(hasMatch => {
      if (hasMatch) {
        console.log("yea");
        toast.success(EndInterViewToastMsg);
        redirectToPractice();
      }
    }).catch(err => {}); // Not in match
  }

  // Upon page load, check if user is logged in then check if user is already in a match.
  useEffect(() => {
    checkLogin().then(res => {
      if (userRef.current === null) {
        return
      }
      checkIfUserInMatch();
    }).catch(err => {});
  }, []);

  return (
    <>
        <AppContext.Provider value={context}>
          <PeerPrepNav />
          <ToastContainer pauseOnFocusLoss={false}/>
          <Switch>
            <Route exact path='/' render={props => <Home/>} />
            <Route path='/login' render={props => isLoading ? <LoadingScreen/> : <Login />} />
            <Route path="/practice" render={props => isLoading ? <LoadingScreen/> : <Practice/>} />
            <Route path="/register" render={props => <Login isRegister={true} />} />
            <Route path="/*" render={props => {
              toast.error("You have entered an invalid route.");
              return <Home/>
            }}></Route>
          </Switch>
        </AppContext.Provider>
    </>
  );
}

export default App;