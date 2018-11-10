import React, { useState } from 'react';
import File from 'react-feather/dist/icons/file';
import CollapseIcon from 'react-feather/dist/icons/minus-square';
import ExpandIcon from 'react-feather/dist/icons/plus-square';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import XCircle from 'react-feather/dist/icons/x-circle';
import PlayIcon from 'react-feather/dist/icons/play';
import './TestFile.css';

const flexGrow = <div style={{ flexGrow: 1 }} />;

function countTests(tests, suites) {
  const testCount = tests.length;
  if (!suites || !suites.length) return testCount;
  return testCount + suites.reduce((acc, suite) => acc + countTests(suite.tests, suite.suites), 0);
}

function Test({ id, fileResults, testName, category }) {
  const results = fileResults[id];
  const passed = results && results.status === 'passed';
  const failed = results && results.status === 'failed';
  const Icon = passed ? CheckCircle : failed ? XCircle : null;
  const color = passed ? 'green' : failed ? 'red' : '#000';

  const error = results && results.error;

  return (
    <li className="test test-list-item">
      <div className="test-name">
        {Icon && <Icon className="test-icon" size="1em" color={color} />}
        {testName}
      </div>
      {error && <pre className="test-error">{error}</pre>}
    </li>
  );
}

function TestSuite({ fileResults, runFile, depth = 0, name, tests, suites }) {
  const isRoot = depth === 0;
  const [expanded, setExpanded] = useState(isRoot);
  const testCount = countTests(tests, suites);

  const toggleButton = (
    <button className="TestSuite-toggle" onClick={() => setExpanded(!expanded)}>
      {expanded ? <CollapseIcon size={16} /> : <ExpandIcon size={16} />}
    </button>
  );

  return (
    <div className={`TestSuite ${isRoot ? 'test-file' : ''}`}>
      {!isRoot && (
        <div className={`TestSuite-name ${isRoot ? 'test-file-name' : ''}`}>
          {toggleButton}
          {name}
          <span className="TestSuite-count">({testCount} tests)</span>
        </div>
      )}
      {expanded && (
        <ul className={`TestSuite-list ${isRoot ? '' : 'nested'}`}>
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
      )}
    </div>
  );
}

function TestFile({ fileName, fileDefinition, fileResults = {}, runFile }) {
  if (!fileDefinition) return null;
  const { root } = fileDefinition;
  const { tests, suites } = root;

  return (
    <div className="TestFile">
      <div className="TestFile-header">
        <File className="TestFile-icon" size={12} />
        {fileName}
        {flexGrow}
        <button className="TestFile-run-button" onClick={() => runFile(fileName)}>
          run file
          <PlayIcon size="1em" />
        </button>
      </div>
      <div className="TestFile-tests">
        <TestSuite
          fileResults={fileResults}
          runFile={runFile}
          name={fileName}
          tests={tests}
          suites={suites}
        />
      </div>
    </div>
  );
}

export default TestFile;
