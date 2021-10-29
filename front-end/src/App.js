import './css/App.css';
import React from 'react';
import { useEffect } from 'react';
import PeerPrepNav from './components/PeerPrepNav';
import Home from './components/home/Home';
import Login from './components/login/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Practice from './components/practice/Practice';
import ReactTimeAgo from 'react-time-ago'
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import useState from 'react-usestateref';
import axios from 'axios';
import { VALIDATE_LOGIN_URL, MATCH_GET_INTERVIEW_URL } from "./Api.js"
import { useHistory } from "react-router-dom";

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

  // Runs upon route change
  useEffect(() => {
    // setUser if user is logged in.
    axios.get(VALIDATE_LOGIN_URL).then(res => {
      if (res.status == 200) {
        setUser(res.data.data);
      }
    }).catch(err => {});

    // setMatch if user is logged in and in a match (interview).
    if (userRef.current !== null) {
      axios.get(MATCH_GET_INTERVIEW_URL, {
        email: user.email
      }).then(res => {
        if (res.status === 200 && res.data.status === "success") {
          setMatch(res.data.data);
          toast.success("Interview successfully resumed. Please click \"End Interview\" to find another match.");
          history.push({ pathname: '/practice' });
        }
      }).catch(err => {});
    }

    setIsLoading(false);
  }, [history]);

  return isLoading ? <></> : (
    <>
      <Router>
        <AppContext.Provider value={context}>
          <PeerPrepNav />
          <ToastContainer pauseOnFocusLoss={false}/>
          <Switch>
            <Route exact path='/' render={props => <Home/>} />
            <Route path='/login' render={props => <Login />} />
            <Route path="/practice" render={props => <Practice/>} />
            <Route path="/register" render={props => <Login isRegister={true} />} />
          </Switch>
        </AppContext.Provider>
      </Router>
    </>
  );
}

export default App;