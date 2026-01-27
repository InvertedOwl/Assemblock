import React from 'react';
import './ScriptList.css';

const ScriptList = ({ scripts }) => {

    const sendToScriptPage = (scriptId) => {
        // Reload the page with the script ID in the cookie
        document.cookie = `script_id=${scriptId}; path=/;`;
        window.location.href = '/';
    }

    const deleteScript = (scriptId, e) => {
        e.stopPropagation();
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
        const csrftoken = getCookie('csrftoken');

        const res = fetch(`/script/`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken || ''
            },
            body: JSON.stringify({ id: scriptId })
        });

        res.then(response => {
            if (response.ok) {
                console.log('Script deleted successfully');
                window.location.reload();
            } else {
                console.error('Failed to delete script');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='scripts-list'>
            {scripts.length === 0 ? (
                <p>Loading...</p>
            ) : (
                scripts.map((script, index) => (
                    <div key={index} className="script-card" onClick={sendToScriptPage.bind(null, script.id)}>
                        <h2>{script.title || "Untitled"}</h2>
                        <h3>{script.owner}</h3>
                        <p className="date">{new Date(script.updated_at).toLocaleDateString()}</p>
                        
                        <div className='bottom-container'>
                            <p>Favorites: {script.favorited}</p>
                            {script.is_owner ? <button onClick={(e) => deleteScript(script.id, e)}>Delete</button> : null}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ScriptList;