import React from 'react';

class SocketClient extends React.PureComponent {
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
    const { socketPort, children } = this.props;
    const { connected, fileNames, fileDefinitions, fileResults } = this.state;

    return children({
      socketPort,
      connected,
      fileNames,
      fileDefinitions,
      fileResults
    });
  }
}

export default SocketClient;
