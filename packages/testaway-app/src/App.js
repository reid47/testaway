import React from 'react';
import Disconnected from './Disconnected';
import Main from './Main';
import SocketClient from './SocketClient';
import './App.css';

function App(props) {
  const { socketPort } = props;

  return (
    <SocketClient socketPort={socketPort}>
      {props => (props.connected ? <Main {...props} /> : <Disconnected {...props} />)}
    </SocketClient>
  );
}

export default App;
