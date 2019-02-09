import React, { useState } from 'react';
import Disconnected from './Disconnected';
import Main from './Main';
import SocketClient from './SocketClient';
import './App.scss';

function App(props) {
  const { socketPort } = props;

  const [runFilesOnChange, setRunFilesOnChange] = useState(true);

  const settings = {
    runFilesOnChange,
    setRunFilesOnChange
  };

  return (
    <SocketClient socketPort={socketPort}>
      {props =>
        props.connected ? <Main {...props} settings={settings} /> : <Disconnected {...props} />
      }
    </SocketClient>
  );
}

export default App;
