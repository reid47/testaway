import React, { PureComponent } from 'react';
import TestFile from './TestFile';
import './App.css';

class App extends PureComponent {
  socket = null;

  state = {
    fileNames: [],
    fileDefinitions: {}
  };

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

    if (event.type === 'connected') {
      const { fileNames, fileDefinitions } = event;
      this.setState({ fileNames, fileDefinitions });
      return;
    }

    if (event.type === 'fileAnalyzed') {
      const { fileName, data } = event;
      this.setState(({ fileDefinitions }) => ({
        fileDefinitions: {
          ...fileDefinitions,
          [fileName]: data
        }
      }));
    }
  };

  run = file => {
    if (!file) return;
    console.log('running file:', file);
    this.socket.send(JSON.stringify({ type: 'run_test_file', file }));
  };

  renderTest = ({ name, category }) => {
    const testName = name.join(' > ');
    return <div key={testName}>{testName + `(${category})`}</div>;
  };

  renderSuite = ({ name, tests, suites }, atRoot) => {
    const suiteName = name.join(' > ');
    const empty = !tests.length && !suites.length;

    return (
      <div key={atRoot ? '_root_suite_' : suiteName}>
        <div>{suiteName}</div>
        {empty && 'No tests defined'}
        {tests.map(this.renderTest)}
        {suites.map(this.renderSuite)}
      </div>
    );
  };

  render() {
    const { fileNames, fileDefinitions } = this.state;

    return (
      <div className="App">
        {fileNames.map(fileName => (
          <TestFile key={fileName} fileName={fileName} fileDefinition={fileDefinitions[fileName]} />
        ))}
      </div>
    );
  }
}

export default App;
