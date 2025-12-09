import './CollectionPage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ScriptList from './components/ScriptList';

export const CollectionPage = () => {
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
        <div className="collection-page">
            <h1>Your Scripts</h1>
            <p>Discover and browse scripts shared by the community.</p>
            <br />
            <ScriptList scripts={scripts.filter(script => script.is_owner)} />
        
            <h1>Your Favorites</h1>        
            <p>Scripts you have marked as favorites.</p>
            <ScriptList scripts={scripts.filter(script => script.is_favorited)} />
        
        </div>
    );
}