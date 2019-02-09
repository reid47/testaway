import React from 'react';
import Toolbar from './Toolbar';
import TestFile from './TestFile';
import './App.scss';

function Main(props) {
  const { fileNames, runFile, fileDefinitions, fileResults, settings } = props;

  return (
    <div className="App">
      <Toolbar settings={settings} />
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
