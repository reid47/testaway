import React, { PureComponent } from 'react';
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
        {fileNames.map(file => (
          <section key={file} className="test-file">
            <h2 className="test-file-name">{file}</h2>
            <button onClick={() => this.run(file)}>click to run</button>
            {this.renderSuite(fileDefinitions[file].root, true)}
          </section>
        ))}
      </div>
    );
  }
}

export default App;
