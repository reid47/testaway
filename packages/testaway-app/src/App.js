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

  run = () => {
    const file = this.state.files[0];
    if (!file) return;
    console.log('running file:', file);
    this.socket.send(JSON.stringify({ type: 'run_test_file', file }));
  };

  render() {
    const { files } = this.state;

    return (
      <div className="App">
        {files.map(file => (
          <div key={file}>{file}</div>
        ))}
        <button onClick={this.run}>click to run</button>
      </div>
    );
  }
}

export default App;
