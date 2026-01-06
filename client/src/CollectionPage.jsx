import './CollectionPage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ScriptList from './components/ScriptList';

export const CollectionPage = () => {
    // Get scripts from server
    const [scripts, setScripts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchScripts = async (pageToLoad = 1) => {
            const res = await fetch(`/scripts/?page=${pageToLoad}&page_size=${pageSize}`, {
                credentials: 'same-origin'
            });
            const data = await res.json();
            if (pageToLoad === 1) setScripts(data.scripts || []);
            else setScripts(prev => [...prev, ...(data.scripts || [])]);
            setPage(data.page || 1);
            setTotalPages(data.total_pages || 1);
        };

        fetchScripts(1);
    }, []);

    const loadMore = async () => {
        const next = page + 1;
        if (next > totalPages) return;
        const res = await fetch(`/scripts/?page=${next}&page_size=${pageSize}`, { credentials: 'same-origin' });
        const data = await res.json();
        setScripts(prev => [...prev, ...(data.scripts || [])]);
        setPage(data.page || next);
        setTotalPages(data.total_pages || totalPages);
    }

    return (
        <div className="collection-page">
            <h1>Your Scripts</h1>
            <p>Discover and browse scripts shared by the community.</p>
            <br />
            <ScriptList scripts={scripts.filter(script => script.is_owner)} />
            {page < totalPages ? (
                <div style={{textAlign: 'center', marginTop: 12, marginBottom: 12}}>
                    <button onClick={loadMore} className='action-button'>Load more</button>
                </div>
            ) : null}
        
            <h1>Your Favorites</h1>        
            <p>Scripts you have marked as favorites.</p>
            <ScriptList scripts={scripts.filter(script => script.is_favorited)} />
        
        </div>
    );
}