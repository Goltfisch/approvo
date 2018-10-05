import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Logs } from '/imports/api/logs/logs.js';

export class Log extends Component {
    render() {
        return (
            <tr>
                <td>{ this.props.log.date }</td>
                <td>{ this.props.log.time }</td>
                <td>{ this.props.log.user }</td>
                <td>{ this.props.log.action }</td>
            </tr>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('Usermanagement.users');
    Meteor.subscribe('Logs');

    return {
        users: Meteor.users.find().fetch(),
        currentUser: Meteor.user(),
        logs: Logs.find({}, {sort: { createdAt: -1}}).fetch()
    };
})(Log);