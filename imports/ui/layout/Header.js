import React, { Component } from 'react';

import AccountsUIWrapper from '/imports/ui/layout/AccountsUIWrapper.js';
import Navbar from '/imports/ui/layout/Navbar.js';

import '/imports/ui/layout/header.css';

export default class Header extends Component {
    render() {
        return (
            <header className="header">
                <div className="header-brand">
                    <img className="logo" src="images/logo.png" alt="Logo"/>
                </div>

                <div className="wrapper">
                    <Navbar />
                </div>

                <div className="header-login">
                    <AccountsUIWrapper />
                </div>
            </header>
        )
    }
}