import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const socketPort = process.env.TESTAWAY_SERVER_PORT || 4700;

ReactDOM.render(<App socketPort={socketPort} />, document.getElementById('root'));
