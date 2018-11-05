import React, { Component } from 'react';
import AccountsUIWrapper from '/imports/rainbow-ui/AccountsUIWrapper.js';
import { NavLink } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import './css/navigation-bar.css';

export class NavigationBar extends Component {
    renderListItems() {
        return this.props.listItems.map((listItem) => (
            <li key={listItem.id}>
                <NavLink to={listItem.to} exact activeClassName="active">{listItem.name}</NavLink>
            </li>
        ));
    }

    render() {
        return (
            <nav className='navigation-bar'>
                <div className='logo'>
                    <a href='/'><img src={this.props.logo} alt="Logo"/> </a>
                </div>
                <div className='navigation-list'>
                    <ul>
                        {this.renderListItems()}
                    </ul>
                </div>
                <div className='navigation-login'>
                    <AccountsUIWrapper />
                </div>
            </nav>
        )
    }
}

export default withTracker(() => {
    return {
        
    }
})(NavigationBar);