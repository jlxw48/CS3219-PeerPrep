import './css/App.css';
import PeerPrepNav from './PeerPrepNav';
import Home from './components/home/Home';
import Login from './components/login/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import APIErrorProvider from './common/providers/APIErrorProvider';
import APIErrorNotification from './components/ApiErrorNotification';
import Practice from './components/practice/Practice';


function App() {
  return (
    <>
      <APIErrorProvider>
        <Router>
          <PeerPrepNav />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path ="/practice" component={Practice} />
          </Switch>
        </Router>
        {/* <APIErrorNotification /> */}
      </APIErrorProvider>

    </>
  );
}

export default App;