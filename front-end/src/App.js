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
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';


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

  // function checkLogin() {
  //   console.log("?");
  //   return axios.get(VALIDATE_LOGIN_URL).then(res => {
  //     if (res.status == 200) {
  //       setUser(res.data.data);
  //     }
  //     console.log("WTF");
  //   }).catch(err => {
  //     console.error(err);
  //   });
  // }

  // async function checkMatch() {
  //   return axios.get(MATCH_GET_INTERVIEW_URL, {
  //     params : {email: userRef.current.email}
  //   }).then(res => {
  //     if (res.status == 200 && res.data.status == "success") {
  //       setMatch(res.data.data);
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }).catch(err => {})
  // }

  function redirectToPractice() {
    history.push({ pathname: '/practice' });
  }

  const EndInterViewToastMsg = () => (<p>Interview successfully resumed. Click <b>End Interview</b> to find another match.</p>)

  useEffect(() => {
    axios.get(VALIDATE_LOGIN_URL).then(res => {
      if (res.status == 200) {
        setUser(res.data.data);
      }
      setIsLoading(false);
      console.log("WTF");
    }).catch(err => {
      console.log("Ho");
      console.log(err);
    }).then(res => {
      if (userRef.current === null) {
        return
      }
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
      }).catch(err => {
        console.log("huh");
      });
    }).catch(err => {});
  }, []);
  // useEffect(() => {
  //   checkLogin().then(res => {
  //     if (userRef.current !== null) {
  //       return checkMatch();
  //     }
  //   }).then(hasMatch => {
  //     if (hasMatch) {
  //       console.log("yea");
  //       toast.success(EndInterViewToastMsg);
  //       redirectToPractice();
  //     }
  //     console.log("booya");
  //     setIsLoading(false);
  //   })
  // }, []);

  return (
    <>
        <AppContext.Provider value={context}>
          <PeerPrepNav />
          <ToastContainer pauseOnFocusLoss={false}/>
          <Switch>
            <Route exact path='/' render={props => <Home/>} />
            <Route path='/login' render={props => <Login />} />
            <Route path="/practice" render={props => isLoading ? <Redirect to="/" /> : <Practice/>} />
            <Route path="/register" render={props => <Login isRegister={true} />} />
          </Switch>
        </AppContext.Provider>
    </>
  );
}

export default App;