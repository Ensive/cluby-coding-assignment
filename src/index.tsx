import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// source code
import App from './App';
import AlertProvider from './components/AlertProvider';
import reportWebVitals from './reportWebVitals';

// styles
import 'reset-css/reset.css';
import './global/index.css';

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <AlertProvider>
      <App />
    </AlertProvider>
  </Router>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
