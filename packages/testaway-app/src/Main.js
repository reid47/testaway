import React from 'react';
import Toolbar from './Toolbar';
import TestFile from './TestFile';
import './App.css';

function Main(props) {
  const { fileNames, runFile, fileDefinitions, fileResults } = props;

  return (
    <div className="App">
      <Toolbar />
      <main>
        {fileNames.map(fileName => (
          <TestFile
            key={fileName}
            runFile={runFile}
            fileName={fileName}
            fileDefinition={fileDefinitions[fileName]}
            fileResults={fileResults[fileName]}
          />
        ))}
      </main>
    </div>
  );
}

export default Main;
