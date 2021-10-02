import './css/App.css';
import PeerPrepNav from './PeerPrepNav';
import Home from './home/Home';
import Login from './login/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


function App() {
  return (
    <>
      
      <Router>
      <PeerPrepNav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
        </Switch>
      </Router>
    </>
    // <>
    //   <PeerPrepNav />
    //   <Login />
    // </>
  );
}

export default App;