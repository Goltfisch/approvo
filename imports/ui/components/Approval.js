import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { ApprovalStates } from '/imports/api/approvals/approvalStates/approvalStates.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

import States from './States.js';

export class Approval extends Component {
    approvalSetNextState(event) {
        event.preventDefault();
        this.approvalGetNextState();

        const actualState = ApprovalStates.findOne({value: this.props.approval.state});
        if(actualState.number == 5) {
            return
        } else {
            var newStateNumber = actualState.number += 1;
            if(newStateNumber >= 5) {
                newStateNumber = 6;
            }
        }
        const newState = ApprovalStates.findOne({number: newStateNumber});

        var approval = Approvals.findOne(this.props.approval._id);

        approval.state = newState.value;
        approval.lastEditBy = this.props.currentUser.name;
        
        Meteor.call('Approvals.update', {
            _id: approval._id,
            ...approval
        });

        const owner = Meteor.users.findOne({ name: this.props.approval.owner })

        if(newState.number == 2) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Admin ' + this.props.currentUser.name + ' hat die Anfrage ' + this.props.approval.name + ' von ' + owner.name + ' Freigegeben.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);
        }else if(newState.number == 3) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Einkauf ' + this.props.currentUser.name + ' hat die Freigabe ' + this.props.approval.name + ' von ' + owner.name + ' Bestellt.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);
        }else if(newState.number == 4) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Einkauf ' + this.props.currentUser.name + ' hat die Freigabe ' + this.props.approval.name + ' von ' + owner.name + ' Abgeschlossen.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);
        }
    }

    approvalGetNextState() {
        const actualState = ApprovalStates.findOne({value: this.props.approval.state});
        if(actualState) {
            if(actualState.number == 5) {
                return 'Abgelehnt';
            } else {
                var newStateNumber = actualState.number += 1;
                if(newStateNumber >= 5) {
                    newStateNumber = 6;
                }
            }
            const newState = ApprovalStates.findOne({number: newStateNumber});
            const state = newState.name;

            return state;
        }
        return;
    }

    deleteApproval(event) {
        event.preventDefault();

        const newLog = {
            date: moment(new Date()).format('DD.MM.YYYY'),
            time: moment(new Date()).format('H:m:s'),
            user: this.props.currentUser.name,
            action: 'Admin ' + this.props.currentUser.name + ' hat die Freigabe ' + this.props.approval.name + ' von ' + owner.name + ' Gelöscht.',
            createdAt: new Date()
        }

        Meteor.call('Logs.insert', newLog);

        Meteor.call('Approvals.update', {
            _id: this.props.approval._id,
            deleted: true
        });
    }

    renderStates() {
        return <States key={this.props.approval._id} approval={this.props.approval}/>
    }

    render() {
        return (
            <tr>
                <td><a href={this.props.approval.link}>{ this.props.approval.name }</a></td>
                <td>{ this.props.approval.amount }€</td>
                <td>{ this.props.approval.reason }</td>
                <td className="approvals-table-state-column">
                    <div className="approvals-state-change">
                        { this.props.approval.state == 'decline' ?
                            <button onClick={this.approvalSetNextState.bind(this)} className="approvals-state-change-button-state-decline">{this.approvalGetNextState()}</button> :
                            <button onClick={this.approvalSetNextState.bind(this)} className="approvals-state-change-button">{this.approvalGetNextState()}</button>
                        }
                        {this.renderStates()}
                    </div>
                </td>
                <td className="approvals-delete-column">
                    <button onClick={this.deleteApproval.bind(this)} className="delete-approvals-button">Löschen</button>
                </td>
            </tr>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('dashboard.approvals');
    Meteor.subscribe('dashboard.approvals.states');
    Meteor.subscribe('Usermanagement.users');
  
    return {
        approvals: Approvals.find().fetch(),
        approvalStates: ApprovalStates.find().fetch(),
        currentUser: Meteor.user(),
        emails: EmailTemplates.find().fetch()
    };
})(Approval);