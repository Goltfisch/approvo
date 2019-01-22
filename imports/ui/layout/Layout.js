import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import NavigationBar from '/imports/rainbow-ui/NavigationBar.js';
import Footer from '/imports/rainbow-ui/Footer.js';

import '/imports/ui/css/layout.css';

class Layout extends Component {
    getListItems() {
        const { currentUser } = this.props;
        let navigationListItems = [];

        if(currentUser) {
            navigationListItems.push({
                id: 1,
                to: '/',
                name: 'Dashboard',
            });
            
            navigationListItems.push({
                id: 2,
                to: '/settings',
                name: 'Einstellungen',
            });

            if(currentUser.userRole == 'admin') {
                navigationListItems.push({
                    id: 3,
                    to: '/usermanagement',
                    name: 'Benuterverwaltung',
                });

                navigationListItems.push({
                    id: 4,
                    to: '/tags',
                    name: 'Tags',
                });
                
                navigationListItems.push({
                    id: 5,
                    to: '/log',
                    name: 'Log',
                });

                navigationListItems.push({
                    id: 6,
                    to: '/statistics',
                    name: 'Statistiken',
                });
            }
        }
    
        return navigationListItems;
    }
    
    render() {
        return (
            <div className='page'>
                <NavigationBar 
                    logo="images/logo.png"
                    listItems={this.getListItems()}
                />
                <div className='content'>
                    { this.props.currentUser ?
                        <div className='container'>
                            {this.props.children}
                        </div> : <div className='content-login-message'>Bitte einloggen...</div>
                    }
                </div>
                <Footer />
            </div>
        )
    }
}

export default withTracker(() => {
    return {
        currentUser: Meteor.user(),
    }
})(Layout);