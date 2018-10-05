import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { ApprovalStates } from '/imports/api/approvals/approvalStates/approvalStates.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

export class States extends Component {
    getStates() {
        var states = this.props.approvalStates;
        delete states[0];
        return states;
    }
    
    renderStates() {
        return this.getStates().map((state) => {
            if(state.value == this.props.approval.state) {
                return <option key={state._id} value={state.value}>{state.name}</option>;
            } else {
                return <option key={state._id} value={state.value}>{state.name}</option>;
            }
        });
    }

    selectState(event) {
        event.preventDefault();

        var approval = this.props.approval;

        const approvalState = ApprovalStates.findOne({value: approval.state});

        if(approvalState.number >= 5) {
            return alert('Der Status von abgelehnten oder beendeten Freigaben darf nicht mehr geändert werden!');
        }

        approval.state = this.refs.stateSelect.value;

        Meteor.call('Approvals.update', {
            _id: approval._id,
            ...approval
        });

        const newApprovalState = ApprovalStates.findOne({value: approval.state});

        if(newApprovalState.number == 2) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Admin ' + this.props.currentUser.name + ' hat die Anfrage ' + this.props.approval.name + ' von ' + owner.name + ' Freigegeben.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);
        }else if(newApprovalState.number == 3) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Einkauf ' + this.props.currentUser.name + ' hat die Freigabe ' + this.props.approval.name + ' von ' + owner.name + ' Bestellt.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);
        }else if(newApprovalState.number == 4) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Einkauf ' + this.props.currentUser.name + ' hat die Freigabe ' + this.props.approval.name + ' von ' + owner.name + ' Abgeschlossen.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);
        }else if(newApprovalState.number == 5) {
            const newLog = {
                date: moment(new Date()).format('DD.MM.YYYY'),
                time: moment(new Date()).format('H:m:s'),
                user: this.props.currentUser.name,
                action: 'Admin ' + this.props.currentUser.name + ' hat die Freigabe ' + this.props.approval.name + ' von ' + owner.name + ' Abgelehnt.',
                createdAt: new Date()
            }
    
            Meteor.call('Logs.insert', newLog);

            this.sendUserDeclineEmail();
        }else if(newApprovalState.number == 6) {
            
        }
    }

    render() {
        return (
            <select className="approvals-state-dropdown" value={this.props.approval.state} ref="stateSelect" onChange={this.selectState.bind(this)}>
                <option></option>
                {this.renderStates()}
            </select>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('dashboard.approvals');
    Meteor.subscribe('dashboard.approvals.states');
  
    return {
      approvals: Approvals.find().fetch(),
      approvalStates: ApprovalStates.find().fetch(),
      currentUser: Meteor.user(),
      emails: EmailTemplates.find().fetch()
    };
})(States);