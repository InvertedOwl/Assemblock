import './ExplorePage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ScriptList from './components/ScriptList';

export const ExplorePage = () => {
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

    return (
        <div className="explore-page">
            <h1>Explore Scripts</h1>
            <p>Discover and browse scripts shared by the community.</p>
            <br />

            <ScriptList scripts={scripts} />
        </div>
    );
}