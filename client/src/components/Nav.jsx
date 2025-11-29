import { useEffect, useState } from "react";
import "./Nav.css";
import { Link, NavLink } from "react-router-dom";

export const Nav = (props) => {
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const res = await fetch('/me/', {
            credentials: 'same-origin'
        });
        const data = await res.json();
        return data;
    };

    useEffect(() => {
        
        getUser().then((data) => {
            console.log(data);
            setUser(data.user);
        });
    }, []);
    
    return (
        <div className="nav-bar">
            <div className="nav-left">
                <h2>Assemblock</h2>  
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "navlink navlink-active" : "navlink"
                    }
                >
                    Script
                </NavLink>
                <NavLink
                    to="/shared-scripts/"
                    className={({ isActive }) =>
                        isActive ? "navlink navlink-active" : "navlink"
                    }
                >
                    Shared Scripts
                </NavLink>
                <NavLink
                    to="/favorites/"
                    className={({ isActive }) =>
                        isActive ? "navlink navlink-active" : "navlink"
                    }
                >
                    Favorites
                </NavLink>
            </div>

            <div className="nav-right">
                {/* Material symbol icon; the text content (icon name) is required. */}
                <span class="material-symbols-outlined settings">
                discover_tune
                </span>
                <span className="share">Share</span>

                {user ? (
                    <span><a href="">{user.first_name}</a></span>
                ) : (
                    <a href="/login/">Login</a>
                )}
            </div>


        </div>
    );
};