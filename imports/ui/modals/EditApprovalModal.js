import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import moment from 'moment';
import accounting from 'accounting';
import { WithContext as ReactTags } from "react-tag-input";

import { Approvals } from "/imports/api/approvals/approvals.js";
import { Tags } from '/imports/api/tags/tags.js';

import Form from '/imports/rainbow-ui/Form.js';

import "/imports/ui/css/tags.css";

const KeyCodes = {
    enter: 13
};

const delimiters = [KeyCodes.enter];

class EditApprovalModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: this.getApprovalTags(),
            suggestions: this.getTags()
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    getApprovalTags() {
        const { approval } = this.props;
        let tagList = [];

        if(approval.tags && approval.tags.length >= 1) {
            approval.tags.forEach(tag => {
                tagList.push(Tags.findOne(tag));
            });
        }

        if(tagList) {
            tagList.forEach(item => {
                item.id = item._id;
                item.text = item.name;
            });

            return tagList;
        }else {
            return [];
        }
    }

    getTags() {
        const { newTags } = this.props;

        newTags.forEach(tag => {
            tag.id = tag._id;
            tag.text = tag.name;
        });

        return newTags;
    }

    handleDelete(i) {
        const { tags } = this.state;

        this.setState({
            tags: tags.filter((tag, index) => index !== i)
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    getFormConfiguration() {
        const props = this.props;
        const { tags } = this.state;

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
                        let newApprovalTags = [];

                        if(tags) {
                            tags.forEach(tag => {
                                newApprovalTags.push(tag._id);
                            });
                        }

                        formData.tags = newApprovalTags;
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
        const { tags, suggestions } = this.state;

        let placeholder = "Tags hinzufügen";

        return (
            <div className="content-approval">
                <div className="content-approval-form">
                    <Form configuration={this.getFormConfiguration()} />
                </div>

                <div className="content-approval-tags">
                    <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        delimiters={delimiters}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        )
    }
}

export default withTracker((props) => {

    const approvalId = props.modalData.approvalId;
    const newTags = props.modalData.tags;

    Meteor.subscribe("dashboard.approval", approvalId);
    Meteor.subscribe('Usermanagement.users', {}, {});
    
    const approval = Approvals.findOne(approvalId);
    const users = Meteor.users.find({}, { sort: { createdAt: -1 }}).fetch();

    return {
        approval,
        users,
        currentUser: Meteor.user(),
        newTags
    };
})(EditApprovalModal);