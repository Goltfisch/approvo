import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Roles from '/imports/ui/components/Roles.js';

export class User extends Component {
    deleteUser(event) {
        event.preventDefault();

        var user = this.props.user;

        Meteor.call('User.delete', {
            _id: user._id,
            ... user
        });
    }

    renderRoles() {
        return <Roles user={this.props.user}/>
    }

    changeUserPassword(event) {
        event.preventDefault();

        var user = this.props.user;
        user.password = this.refs.newUserPassword.value;

        Meteor.call('User.updatePassword', {
            _id: user._id,
            ... user
        });

        this.refs.newUserPassword.value = ' ';
    }

    render() {
        return (
            <tr>
                <td>{ this.props.user.name }</td>
                <td>{ this.props.user.username }</td>
                <td>{ this.props.user.emails[0].address }</td>
                <td>
                    <input type="text" ref="newUserPassword" />
                    <button className="change-user-password-button" onClick={this.changeUserPassword.bind(this)}></button>
                </td>
                <td>
                    <div className="user-role-change">
                        {this.renderRoles()}
                    </div>
                </td>
                <td className="user-action-column">
                    <button onClick={this.deleteUser.bind(this)} className="delete-user-button">Löschen</button>
                </td>
            </tr>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('Usermanagement.users');
    return {
        users: Meteor.users.find().fetch(),
        currentUser: Meteor.user(),
    };
})(User);