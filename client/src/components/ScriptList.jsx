import React from 'react';
import './ScriptList.css';

const ScriptList = ({ scripts }) => {

    const sendToScriptPage = (scriptId) => {
        // Reload the page with the script ID in the cookie
        document.cookie = `script_id=${scriptId}; path=/;`;
        window.location.href = '/';
    }

    return (
        <div className='scripts-list'>
            {scripts.length === 0 ? (
                <p>Loading...</p>
            ) : (
                scripts.map((script, index) => (
                    <div key={index} className="script-card" onClick={sendToScriptPage.bind(null, script.id)}>
                        <h2>{script.title}</h2>
                        <h3>{script.owner}</h3>
                        <p className="date">{new Date(script.updated_at).toLocaleDateString()}</p>
                        
                        <div className='bottom-container'>
                            <p>Favorites: {script.favorited}</p>
                            {script.is_owner ? <button>Delete</button> : null}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ScriptList;