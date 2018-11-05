import React, { PureComponent } from 'react';
import './App.css';

class App extends PureComponent {
  socket = null;
  state = { files: [] };

  componentDidMount() {
    this.socket = new WebSocket('ws://localhost:3000/socket');

    this.socket.onopen = event => {
      console.log('Connected to test server...');
    };

    this.socket.onmessage = event => {
      this.handleSocketEvent(JSON.parse(event.data));
    };
  }

  componentWillUnmount() {
    this.socket = null;
  }

  handleSocketEvent = event => {
    console.log(event);

    if (event.type === 'list_files') {
      this.setState({ files: event.files.sort() });
    }
  };

  render() {
    const { files } = this.state;

    return (
      <div className="App">
        {files.map(file => (
          <div key={file}>{file}</div>
        ))}
      </div>
    );
  }
}

export default App;
