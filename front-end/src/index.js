import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeAgo from 'javascript-time-ago'
import axios from 'axios';

import en from 'javascript-time-ago/locale/en.json'
import { BrowserRouter, withRouter } from "react-router-dom";

// Attach jwt token to all request headers, if it exists.
const authToken = localStorage.getItem('cs3219-jwt-auth');
if (authToken) {
  axios.defaults.headers.common['Authorization'] = authToken;
}

TimeAgo.addDefaultLocale(en)
const WithRouterApp = withRouter(App);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <WithRouterApp />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
