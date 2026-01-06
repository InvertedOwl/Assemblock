import React, { useEffect, useRef, useState } from 'react';
import './SettingsPopup.css';
import { parse as parseCookie } from 'cookie';

export const SettingsPopup = (props) => {
  const [unlisted, setUnlisted] = useState(props.settings?.unlisted || false);
  const [turbo, setTurbo] = useState(props.settings?.hyperspeed || false);
  const settings = props.settings;
  const setSettings = props.setSettings;
  const saveScript = props.saveScript;

  useEffect(() => {
    setTurbo(settings.hyperspeed || false);
  }, [settings.hyperspeed]);

  useEffect(() => {
    setUnlisted(settings.unlisted || false);
    console.log("unlisted setting changed to ", settings);
  }, [settings.unlisted]);


  return (
    <div className="settings-popup" role="dialog" aria-label="Settings">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-body">
        <label>
            Run Speed:
            <br />
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={settings.executionSpeed} 
              onChange={(e) => setSettings({ ...settings, executionSpeed: e.target.value })} 
            />
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={turbo} 
            onChange={(e) => {
              const v = e.target.checked;
              setTurbo(v);
              setSettings({ ...settings, hyperspeed: v });
            }} 
          /> Turbo Mode (beta)
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={unlisted} 
            onChange={(e) => {
              const v = e.target.checked;
              setUnlisted(v);
              setSettings({ ...settings, unlisted: v });
            }} 
          /> Unlisted
        </label>
        <button onClick={saveScript}>Upload Script</button>
      </div>
    </div>
  );
};

export default SettingsPopup;
