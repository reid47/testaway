import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const socketPort = process.env.TESTAWAY_SERVER_PORT || 4700;

ReactDOM.render(<App socketPort={socketPort} />, document.getElementById('root'));
