import React, { useEffect, useRef } from 'react';
import './SettingsPopup.css';

export const SettingsPopup = () => {

  return (
    <div className="settings-popup" role="dialog" aria-label="Settings">
      <div className="settings-header">
        <strong>Settings</strong>
      </div>
      <div className="settings-body">
        <label>
            <input type="range" min="1" max="100" value="50" />
        </label>
        <label>
          <input type="checkbox" /> Enable feature B
        </label>

        <button>Save Script</button>
      </div>
    </div>
  );
};

export default SettingsPopup;
