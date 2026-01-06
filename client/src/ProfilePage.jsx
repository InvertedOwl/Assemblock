import './ProfilePage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ScriptList from './components/ScriptList';

export const ProfilePage = () => {
    // Get scripts from server
    const [scripts, setScripts] = useState([]);
    
    useEffect(() => {
        const fetchScripts = async () => {
            const res = await fetch('/scripts/', {
                credentials: 'same-origin'
            });
            const data = await res.json();
            setScripts(data.scripts || []);
        };

        fetchScripts();
    }, []);


    const handleLogout = async () => {
        await fetch('/registration/logout', {
            method: 'GET',
            credentials: 'same-origin'
        });
        window.location.href = '/';
    }

    return (
        <div className="profile-page">
            <h1>Profile</h1>

            <div>
                <button onClick={() => {handleLogout()}} className='action-button'>Logout</button>
            </div>
            <p>Manage your profile and view your scripts.</p>
            <br />


            <h2>Your Scripts</h2>
            <ScriptList scripts={scripts} />
        </div>
    );
}