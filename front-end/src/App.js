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
import 'react-toastify/dist/ReactToastify.css';
import useState from 'react-usestateref';


export const AppContext = React.createContext();


function App() {
  let userStored = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [user, setUser, userRef] = useState(userStored);
  let context = {
    user: user,
    setUser: setUser,
    userRef: userRef
  }

  return (
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