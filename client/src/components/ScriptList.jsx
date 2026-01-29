import React from 'react';
import './ScriptList.css';

const ScriptList = ({ scripts }) => {

    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [scriptToDelete, setScriptToDelete] = React.useState(null);

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

    function truncateWithEllipsis(str, maxLength) {
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength - 3) + "...";
    }

    return (
        <div className='scripts-list'>
            <div className='confirmation-dialog' style={{ display: showConfirmation ? 'block' : 'none' }}>
                <span style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <h2>Are you sure you want to delete a script?</h2> <br/>
                    This action cannot be undone.
                </span>

                <div className='dialog-buttons'>
                    <button className='dialog-button' onClick={(e) => {deleteScript(scriptToDelete, e); setShowConfirmation(false);}}>Delete</button>
                    <button className='dialog-button' onClick={() => {setShowConfirmation(false); setScriptToDelete(null);}}>Cancel</button>
                </div>
            </div>


            {scripts.length === 0 ? (
                <p>Loading...</p>
            ) : (
                scripts.map((script, index) => (
                    <div key={index} className="script-card" onClick={sendToScriptPage.bind(null, script.id)}>
                        <div className='top-container'>
                            <h2>{truncateWithEllipsis(script.title || "Untitled", 20)}</h2>
                            <h3 className='owner'>{script.owner}</h3>
                            <p className="date">{new Date(script.updated_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className='bottom-container'>
                            

                            
                            <div className='favorites-number'>
                                <div className={"material-icons favorite favorite-active"} aria-label="Favorite">favorite</div> <p>{script.favorited}</p>
                            </div>
                            {script.is_owner ? <button className='small-button' onClick={(e) => {setShowConfirmation(true); e.stopPropagation(); setScriptToDelete(script.id);}}>Delete</button> : null}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ScriptList;