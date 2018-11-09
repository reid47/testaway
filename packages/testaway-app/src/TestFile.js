import React from 'react';
import File from 'react-feather/dist/icons/file';
import Square from 'react-feather/dist/icons/square';
import Circle from 'react-feather/dist/icons/circle';
import './TestFile.css';

function Test({ testName, category }) {
  return (
    <li className="test test-list-item">
      <div className="test-name">
        <Circle className="test-icon" size="1em" />
        {testName}
      </div>
    </li>
  );
}

function TestSuite({ runFile, depth = 0, name, tests, suites }) {
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
        {tests.map(({ name }) => {
          const key = name.join('>>');
          const testName = name.pop();
          return <Test key={key} testName={testName} />;
        })}
        {suites.length > 0 && (
          <li className="test-list-item">
            {suites.map(({ name, suites, tests }) => {
              const key = name.join('>>');
              const suiteName = name.pop();
              return (
                <TestSuite
                  key={key}
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

function TestFile({ fileName, fileDefinition, runFile }) {
  if (!fileDefinition) return null;

  const { root } = fileDefinition;
  const { tests, suites } = root;
  return <TestSuite runFile={runFile} name={fileName} tests={tests} suites={suites} />;
}

export default TestFile;
