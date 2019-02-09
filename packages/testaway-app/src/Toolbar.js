import React, { useState } from 'react';
import SettingsIcon from 'react-feather/dist/icons/settings';
import './Toolbar.scss';

function Toolbar({ settings }) {
  const [expanded, setExpanded] = useState(true);
  const { runFilesOnChange, setRunFilesOnChange } = settings;

  return (
    <header className="Toolbar">
      <div className="Toolbar-row">
        <h1>testaway</h1>
        <button className="Toolbar-button" onClick={() => setExpanded(!expanded)}>
          <SettingsIcon />
          settings
        </button>
      </div>
      {expanded && (
        <div className="Toolbar-row">
          <input
            type="checkbox"
            checked={runFilesOnChange}
            onChange={() => setRunFilesOnChange(!runFilesOnChange)}
          />
          <label>run files on change</label>
        </div>
      )}
      <div className="Toolbar-row">{expanded && <div>wow</div>}</div>
    </header>
  );
}

export default Toolbar;
