import React, { PureComponent } from 'react';
import Activity from 'react-feather/dist/icons/activity';
import Toolbar from './Toolbar';
import TestFile from './TestFile';
import './App.css';

class App extends PureComponent {
  socket = null;

  state = {
    connected: false,
    fileNames: [],
    fileDefinitions: {},
    fileResults: {}
  };

  componentDidMount() {
    this.connect();
    this.connectInterval = setInterval(() => this.connect(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.connectInterval);
    this.socket = null;
  }

  connect = () => {
    const { socketPort } = this.props;
    this.socket = new WebSocket(`ws://localhost:${socketPort}/socket`);
    this.socket.onopen = this.handleConnect.bind(this);
    this.socket.onclose = this.handleDisconnect.bind(this);
    this.socket.onmessage = this.handleSocketEvent.bind(this);
  };

  handleConnect = () => {
    console.clear();
    clearInterval(this.connectInterval);
    this.setState({ connected: true });
  };

  handleDisconnect = () => {
    clearInterval(this.connectInterval);
    this.setState({ connected: false });
    this.connectInterval = setInterval(() => this.connect(), 3000);
  };

  handleSocketEvent = message => {
    const event = JSON.parse(message.data);

    if (event.type === 'connected') {
      const { fileNames, fileDefinitions, fileResults } = event;
      this.setState({ fileNames, fileDefinitions, fileResults });
      return;
    }

    if (event.type === 'fileAnalyzed') {
      const { fileName, data } = event;
      this.setState(({ fileDefinitions, fileResults }) => ({
        fileResults: {
          ...fileResults,
          [fileName]: {}
        },
        fileDefinitions: {
          ...fileDefinitions,
          [fileName]: data
        }
      }));
      return;
    }

    if (event.type === 'testFinished') {
      const { fileName, data } = event;
      this.setState(({ fileResults }) => ({
        fileResults: {
          ...fileResults,
          [fileName]: {
            ...fileResults[fileName],
            [data.testId]: data
          }
        }
      }));
      return;
    }

    console.log(event);
  };

  notifyServer = message => this.socket.send(JSON.stringify(message));

  runFile = fileName => {
    if (!fileName) return;
    this.notifyServer({ type: 'testRunRequested', fileName });
  };

  render() {
    const { socketPort } = this.props;
    const { connected, fileNames, fileDefinitions, fileResults } = this.state;

    if (!connected) {
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

    return (
      <div className="App">
        <Toolbar />
        <main>
          {fileNames.map(fileName => (
            <TestFile
              key={fileName}
              runFile={this.runFile}
              fileName={fileName}
              fileDefinition={fileDefinitions[fileName]}
              fileResults={fileResults[fileName]}
            />
          ))}
        </main>
      </div>
    );
  }
}

export default App;
