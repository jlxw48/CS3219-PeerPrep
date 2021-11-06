import React from 'react';
import { useEffect } from 'react';
import useState from 'react-usestateref';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './css/App.css';
import { VALIDATE_LOGIN_URL, MATCH_GET_INTERVIEW_URL, JWT_TOKEN_NAME, VALIDATE_ADMIN_URL } from './constants';
import PeerPrepNav from './components/PeerPrepNav';
import Home from './components/home/Home';
import LoginRegister from './components/login/LoginRegister';
import LoadingScreen from './components/LoadingScreen';
import Practice from './components/practice/Practice';
import Tutorial from "./components/tutorial/Tutorial";
import InvalidRoute from './components/InvalidRoute';
import ManageQuestions from './components/manage_questions/ManageQuestions';

export const AppContext = React.createContext();

function App() {
  // Determines whether to show loading spinner
  const [isLoading, setIsLoading] = useState(true);
  // Maintains state of user details
  const [user, setUser, userRef] = useState(null);
  // Maintains a state of whether user is an admin
  const [isAdmin, setIsAdmin, isAdminRef] = useState(false);
  // Maintains state of user's ongoing match, if any.
  const [match, setMatch, matchRef] = useState(null);

  const history = useHistory();
  
  // The existing token in storage, if any.
  let token = localStorage.getItem(JWT_TOKEN_NAME);
  axios.defaults.headers.common['Authorization'] = token;

  // These are passed around throughout the different components
  let context = {
    user,
    setUser,
    userRef,
    isAdmin,
    setIsAdmin,
    isAdminRef,
    match,
    matchRef,
    setMatch
  }

  const checkLogin = () => {
    return axios.get(VALIDATE_LOGIN_URL).then(res => res.data.data).then(data => {
      setUser(data);
      return true;
    }).catch(err => false); // No JWT token or invalid JWT token.
  }

  const checkIsAdmin = () => {
    return axios.get(VALIDATE_ADMIN_URL).then(res => setIsAdmin(true)).catch(err => setIsAdmin(false));
  }

  function redirectToPractice() {
    history.push({ pathname: '/practice' });
  }

  const checkIfUserInMatch = () => {
    const EndInterViewToastMsg = () => (<p>Interview successfully resumed. Click <b>End Interview</b> to find another match.</p>)
    return axios.get(MATCH_GET_INTERVIEW_URL + `?email=${userRef.current.email}`).then(res => {
      setMatch(res.data.data);
      toast.success(EndInterViewToastMsg);
      redirectToPractice();
      return true;
    }).catch(err => false); // Not in match
  }

  // Upon page load, check if user is logged in then check if user is already in a match.
  useEffect(() => {
    // Check if user is logged in
    checkLogin().then(isLoggedIn => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return
      }

      checkIsAdmin();
      
      checkIfUserInMatch().then(isInMatch => {
          setIsLoading(false);
      });
    }).catch(err => {});
  }, []);

  return (
    <>
      <AppContext.Provider value={context}>
        <PeerPrepNav />
        <ToastContainer pauseOnFocusLoss={false} />
        <Switch>
          <Route exact path='/' render={props => <Home />} />
          <Route exact path="/tutorial"><Tutorial /></Route>
          <Route exact path='/login' render={props => isLoading ? <LoadingScreen /> : <LoginRegister />} />
          <Route exact path="/practice" render={props => isLoading ? <LoadingScreen /> : <Practice />} />
          <Route exact path="/register" render={props => isLoading ? <LoadingScreen /> : <LoginRegister isRegister={true} />} />
          <Route exact path="/manage_questions" render={props => isLoading ? <LoadingScreen /> : user === null ? <InvalidRoute/> : <ManageQuestions />}/>
          <Route path="/*"><InvalidRoute /></Route>
        </Switch>
      </AppContext.Provider>
    </>
  );
}

export default App;