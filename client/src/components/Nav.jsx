import { useEffect, useState } from "react";
import "./Nav.css";
import logo from "../assets/Light_Color_Logo.svg";
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
                <img src={logo} alt="Assemblock Logo" className="assemblock-logo"/>
                <h2 className="title-assemblock">Assemblock</h2>  
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
                    Explore Scripts
                </NavLink>
                <NavLink
                    to="/favorites/"
                    className={({ isActive }) =>
                        isActive ? "navlink navlink-active" : "navlink"
                    }
                >
                    Collection
                </NavLink>
            </div>

            <div className="nav-right">
                {user ? (
                    <span>                <NavLink
                    to="/profile/"
                    className={({ isActive }) =>
                        isActive ? "navlink navlink-active" : "navlink"
                    }
                >
                    {user.first_name + " " + user.last_name}
                </NavLink></span>
                ) : (
                    <a href="/registration/login">Login</a>
                )}
            </div>


        </div>
    );
};