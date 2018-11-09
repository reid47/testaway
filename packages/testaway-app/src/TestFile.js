import React from 'react';
import File from 'react-feather/dist/icons/file';
import Square from 'react-feather/dist/icons/square';
import Circle from 'react-feather/dist/icons/circle';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import XCircle from 'react-feather/dist/icons/x-circle';
import './TestFile.css';

function Test({ id, fileResults, testName, category }) {
  const results = fileResults[id];
  const passed = results && results.status === 'passed';
  const failed = results && results.status === 'failed';
  const Icon = passed ? CheckCircle : failed ? XCircle : Circle;
  const color = passed ? 'green' : failed ? 'red' : '#000';

  const error = results && results.error;

  return (
    <li className="test test-list-item">
      <div className="test-name">
        <Icon className="test-icon" size="1em" color={color} />
        {testName}
      </div>
      {error && <pre className="test-error">{error}</pre>}
    </li>
  );
}

function TestSuite({ fileResults, runFile, depth = 0, name, tests, suites }) {
  const isRoot = depth === 0;

  return (
    <div className={`test-suite ${isRoot ? 'test-file' : ''}`}>
      <div className={`test-suite-name ${isRoot ? 'test-file-name' : ''}`}>
        {isRoot ? (
          <File className="test-suite-icon" size="1em" />
        ) : (
          <Square className="test-suite-icon" size="1em" />
        )}
        {name}
        {isRoot && <button onClick={() => runFile(name)}>run file</button>}
      </div>
      <ul className="test-list">
        {tests.map(({ id, name }) => {
          const testName = name[name.length - 1];
          return <Test key={id} id={id} fileResults={fileResults} testName={testName} />;
        })}
        {suites.length > 0 && (
          <li className="test-list-item">
            {suites.map(({ name, suites, tests }) => {
              const key = name.join('>>');
              const suiteName = name[name.length - 1];
              return (
                <TestSuite
                  key={key}
                  fileResults={fileResults}
                  depth={depth + 1}
                  name={suiteName}
                  tests={tests}
                  suites={suites}
                />
              );
            })}
          </li>
        )}
      </ul>
    </div>
  );
}

function TestFile({ fileName, fileDefinition, fileResults = {}, runFile }) {
  if (!fileDefinition) return null;
  const { root } = fileDefinition;
  const { tests, suites } = root;

  return (
    <TestSuite
      fileResults={fileResults}
      runFile={runFile}
      name={fileName}
      tests={tests}
      suites={suites}
    />
  );
}

export default TestFile;
