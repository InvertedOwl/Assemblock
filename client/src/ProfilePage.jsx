import './ProfilePage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ScriptList from './components/ScriptList';

export const ProfilePage = () => {
    // Get scripts from server with pagination
    const [scripts, setScripts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
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

    // fetch more handler
    const loadMore = async () => {
        const next = page + 1;
        if (next > totalPages) return;
        const res = await fetch(`/scripts/?page=${next}&page_size=${pageSize}`, { credentials: 'same-origin' });
        const data = await res.json();
        setScripts(prev => [...prev, ...(data.scripts || [])]);
        setPage(data.page || next);
        setTotalPages(data.total_pages || totalPages);
    }


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
            {page < totalPages ? (
                <div style={{textAlign: 'center', marginTop: 12}}>
                    <button onClick={loadMore} className='action-button'>Load more</button>
                </div>
            ) : null}
        </div>
    );
}