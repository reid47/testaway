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

function TestSuite({ depth = 0, suiteName, tests, suites }) {
  const isRoot = depth === 0;

  return (
    <div className={`test-suite ${isRoot ? 'test-file' : ''}`}>
      <div className={`test-suite-name ${isRoot ? 'test-file-name' : ''}`}>
        {isRoot ? (
          <File className="test-suite-icon" size="1em" />
        ) : (
          <Square className="test-suite-icon" size="1em" />
        )}
        {suiteName}
      </div>
      <ul className="test-list">
        {tests.map(test => {
          const testName = test.name.pop();
          return <Test key={testName} testName={testName} />;
        })}
        {suites.length > 0 && (
          <li className="test-list-item">
            {suites.map(({ name, suites, tests }) => {
              const suiteName = name.pop();
              return (
                <TestSuite
                  key={suiteName}
                  depth={depth + 1}
                  suiteName={suiteName}
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

function TestFile({ fileName, fileDefinition }) {
  if (!fileDefinition) return null;

  const { root } = fileDefinition;
  const { tests, suites } = root;
  return <TestSuite suiteName={fileName} tests={tests} suites={suites} />;
}

export default TestFile;
