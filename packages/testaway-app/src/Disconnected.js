import React from 'react';
import Activity from 'react-feather/dist/icons/activity';
import './App.css';

function Disconnected(props) {
  const { socketPort } = props;

  return (
    <div className="App not-connected">
      <div>
        <Activity size={64} />
        <h2>not connected to testaway server</h2>
        <h3>attempting to connect on port {socketPort}</h3>
      </div>
    </div>
  );
}

export default Disconnected;
