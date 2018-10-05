import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';
import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';

export class Roles extends Component {
    getRoles() {
        const roles = this.props.roles;

        return roles;
    }
    
    renderRoles() {
        return this.getRoles().map((role) => {
            if(role.value == this.props.user.userRole) {
                return <option key={role._id} value={role.value}>{role.name}</option>;
            } else {
                return <option key={role._id} value={role.value}>{role.name}</option>;
            }
        });
    }

    selectRole(event) {
        event.preventDefault();
        var user = this.props.user;

        const oldRole = user.userRole;
        const newState = this.refs.roleSelect.value;

        user.userRole = newState;
        user.oldRole = oldRole
        user.lastEditBy = this.props.currentUser.name;

        Meteor.call('User.update', {
            _id: user._id,
            ...user
        });
    }

    render() {
        return (
            <select className="user-role-dropdown" value={this.props.user.userRole} ref="roleSelect" onChange={this.selectRole.bind(this)}>
                <option></option>
                {this.renderRoles()}
            </select>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('user.roles');
    Meteor.subscribe('EmailTemplates');

    return {
        users: Meteor.users.find().fetch(),
        currentUser: Meteor.user(),
        roles: UserRoles.find().fetch(),
        emails: EmailTemplates.find().fetch()
    };
})(Roles);