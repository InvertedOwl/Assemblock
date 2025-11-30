import React, { useEffect, useRef } from 'react';
import './SettingsPopup.css';
import { parseCookie } from 'cookie';

export const SettingsPopup = (props) => {
  const blocks = props.blocks;

  const saveScript = () => {
    const scriptData = { "script_json": blocks, "title": "My Script", "id": 1 };
    const scriptJSON = JSON.stringify(scriptData, null, 2);

    fetch("/script/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": parseCookie(document.cookie).csrftoken
      },
      credentials: 'same-origin',
      body: scriptJSON,
    })
    console.log(scriptJSON);
  }

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

        <button onClick={saveScript}>Save Script</button>
      </div>
    </div>
  );
};

export default SettingsPopup;
