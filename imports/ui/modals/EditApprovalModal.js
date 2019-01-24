import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import moment from 'moment';
import accounting from 'accounting';

import { Approvals } from "/imports/api/approvals/approvals.js";

import Form from '/imports/rainbow-ui/Form.js';

class EditApprovalModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        const { approval, currentUser } = props;

        const formattedAmount = accounting.formatMoney(approval.amount, {
            precision: 2,
            thousand: ".",
            decimal: ",",
            format: {
                pos: "%v",
                neg: "%v",
                zero: "%v"
            }
        });

        let formConfiguration = {
            id: 'edit-approval-form',
            headline: 'Freigabe bearbeiten',
            description: 'Bearbeite die Fragen "'+ approval.name +'"',
            inputs: [
                { label: 'Name', type: 'text', name: 'name', defaultValue: approval.name, placeholder: 'Was benötigst du?' },
                { label: 'Betrag', type: 'text', name: 'amount', defaultValue: formattedAmount, placeholder: 'Wie hoch ist der Beitrag?' },
                { label: 'Grund', type: 'text', name: 'reason', defaultValue: approval.reason, placeholder: 'Was ist der Grund für den Kauf?' },
                { label: 'Datum', type: 'date', name: 'date', placeholder: 'Welcher Tag ist heute?', defaultValue: moment(approval.date).format('YYYY-MM-DD') },
                { label: 'Link', type: 'text', name: 'link', defaultValue: approval.link, placeholder: 'Wo kann der Artikel eingesehen werden?' }
            ],
            buttons: [
                {
                    label: 'Abbrechen',
                    type: 'cancel',
                    className: 'secondary',
                    onClick: () => {
                        props.cancelButtonClick();
                    } 
                },
                {
                    label: 'Speichern', 
                    type: 'submit',
                    className: 'primary',
                    onClick: (formData) => {
                        formData.amount = accounting.unformat(formData.amount, ',');

                        Meteor.call('Approvals.update', {
                            _id: approval._id,
                            ...formData
                        }, (error, response) => {
                            if(error) {
                                Bert.alert(error.reason, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Freigabe wurde bearbeitet!', 'info', 'growl-top-right');
                            props.cancelButtonClick();
                        });
                    }
                }
            ],
        };

        if(currentUser && currentUser.userRole == 'admin') {
            const { users } = this.props;

            let userOptions = [];
            users.forEach(function(user) {
                userOptions.push({
                    label: user.name,
                    value: user._id
                });
            });

            let stateOptions = [
                {
                    label: 'Angefragt',
                    value: 'requested'
                },
                {
                    label: 'Freigegeben',
                    value: 'approve'
                },
                {
                    label: 'Bestellt',
                    value: 'order'
                },
                {
                    label: 'Abschlossen',
                    value: 'complete'
                },
                {
                    label: 'Abgelehnt',
                    value: 'decline'
                },
                {
                    label: 'Zurückgestellt',
                    value: 'shelved'
                },
            ];

            formConfiguration.inputs.push({
                label: 'Status', type: 'select', name: 'state', options: stateOptions, defaultValue: approval.state
            });

            formConfiguration.inputs.push({
                label: 'Benutzer', type: 'select', name: 'owner', options: userOptions, defaultValue: approval.owner
            });
        };

        return formConfiguration;
    }

    render() {
        return (
            <div className="content-approval-form">
                <Form configuration={this.getFormConfiguration()} />
            </div>
        )
    }
}

export default withTracker((props) => {

    const approvalId = props.modalData.approvalId;

    Meteor.subscribe("dashboard.approval", approvalId);
    Meteor.subscribe('Usermanagement.users', {}, {});
    
    const approval = Approvals.findOne(approvalId);
    const users = Meteor.users.find({}, { sort: { createdAt: -1 }}).fetch();

    return {
        approval,
        users,
        currentUser: Meteor.user()
    };
})(EditApprovalModal);