import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import NavigationBar from '/imports/rainbow-ui/NavigationBar.js';
import Footer from '/imports/rainbow-ui/Footer.js';

import '/imports/ui/css/layout.css';

class Layout extends Component {
    getListItems() {
        return [
            {
                id: 1,
                to: '/',
                name: 'Dashboard',
            },
            {
                id: 2,
                to: '/settings',
                name: 'Einstellungen',
            },
            {
                id: 3,
                to: '/usermanagement',
                name: 'Benuterverwaltung',
            },
            {
                id: 4,
                to: '/log',
                name: 'Log',
            },
            {
                id: 5,
                to: '/statistics',
                name: 'Statistiken',
            }
        ]
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
                        </div> : 'Bitte einloggen...'
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