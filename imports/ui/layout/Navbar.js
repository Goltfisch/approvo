import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import '/imports/ui/layout/header.css';

export default class Navbar extends Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" exact activeClassName="active">Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" exact activeClassName="active">Einstellungen</NavLink>
                    </li>
                    <li>
                        <NavLink to="/usermanagement" exact activeClassName="active">Benutzerverwaltung</NavLink>
                    </li>
                    <li>
                        <NavLink to="/log" exact activeClassName="active">Log</NavLink>
                    </li>
                </ul>
            </nav>
        )
    }
}