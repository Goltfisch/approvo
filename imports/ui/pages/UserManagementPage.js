import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import User from '/imports/ui/components/User.js';

export class UserManagementPage extends Component {
    addNewUser(event) {
        event.preventDefault();

        const name = this.refs.newUserName.value;
        const username = this.refs.newUserUsername.value;
        const email = this.refs.newUserEmail.value;
        const password = this.refs.newUserPassword.value;
        const userRole = 'user';

        if(!name || !username || !email || !password) {
            this.refs.newUserName.value = '';
            this.refs.newUserUsername.value = '';
            this.refs.newUserEmail.value = '';
            this.refs.newUserPassword.value = '';

            return alert('Es müssen alle Felder ausgefüllt werden!');
        }

        const user = {
            name,
            username,
            email,
            password,
            userRole
        };

        Meteor.call('User.insert', user);

        this.refs.newUserName.value = '';
        this.refs.newUserUsername.value = '';
        this.refs.newUserEmail.value = '';
        this.refs.newUserPassword.value = '';
    }
    
    getUsers() {
        return this.props.users;
      }
    
    renderUsers() {
        return this.getUsers().map(((user) => (
            <User key={user._id} user={user}/>
        )));
    }
    
    render() {
        return (
            <div className='usermanagement-page'>
                { this.props.currentUser.userRole != 'admin' ?
                    <p>Du hast nicht die benötigten Rechte um diese Seite aufrufen zu können.</p> :
                    <div className='visible-access'>
                        <div className="content-user-form">
                            <form className="new-user">

                                <label className="form-new-user-name-label"> Name </label>
                                <input type="text" ref="newUserName" />

                                <label className="form-new-user-username-label"> Username </label>
                                <input type="text" ref="newUserUsername" />

                                <label className="form-new-user-email-label"> Email </label>
                                <input type="email" ref="newUserEmail" />

                                <label className="form-new-user-password-label"> Passwort </label>
                                <input type="password" ref="newUserPassword" />

                                <button className="add-user-button" onClick={this.addNewUser.bind(this)}></button>
                            </form>
                        </div>

                        <div className="content-user">
                            <table width="100%" border="1px">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Passwort ändern</th>
                                        <th>Rang</th>
                                        <th>Aktion</th>
                                    </tr>
                                    {this.renderUsers()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('Usermanagement.users');
    return {
        users: Meteor.users.find({}).fetch(),
        currentUser: Meteor.user(),
    };
})(UserManagementPage);