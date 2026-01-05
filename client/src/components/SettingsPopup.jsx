import React, { useEffect, useRef, useState } from 'react';
import './SettingsPopup.css';
import { parse as parseCookie } from 'cookie';

export const SettingsPopup = (props) => {
  const blocks = props.blocks;
  const title = props.title;
  const [unlisted, setUnlisted] = useState(false);
  const [turbo, setTurbo] = useState(props.settings?.hyperspeed || false);
  const settings = props.settings;
  const setSettings = props.setSettings;
  const favorited = props.favorited;

  const saveScript = props.saveScript;

  useEffect(() => {
    setTurbo(settings.hyperspeed || false);
  }, [settings.hyperspeed]);


  return (
    <div className="settings-popup" role="dialog" aria-label="Settings">
      <div className="settings-header">
        <strong>Settings</strong>
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
          /> Turbo Mode:
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={unlisted} 
            onChange={(e) => setUnlisted(e.target.checked)} 
          /> Unlisted
        </label>

        <button onClick={saveScript}>Upload Script</button>
      </div>
    </div>
  );
};

export default SettingsPopup;
