import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import accounting from 'accounting';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

import NewApprovalModal from '/imports/ui/modals/NewApprovalModal.js';

import Table from '/imports/rainbow-ui/Table.js';
import SplitButton from '/imports/rainbow-ui/SplitButton.js';
import Button from '/imports/rainbow-ui/Button.js';
import Search from '/imports/rainbow-ui/Search.js';
import Badge from '/imports/rainbow-ui/Badge.js';
import Modal from '/imports/rainbow-ui/Modal.js';

export class DashboardPage extends Component {
    getTableHeader() {
        return [
            {
                key: 'name',
                content: 'Name',
                col: '2'
            },
            {
                key: 'amount',
                content: 'Betrag',
                col: '1',
                cls: 'bold-amount',
                renderer: (item) => {
                    return accounting.formatMoney(item, {
                        symbol: '€',
                        precision: 2,
                        thousand: '.',
                        decimal: ',',
                        format: {
                            pos : '%v %s',
                            neg : '%v %s',
                            zero: '%v %s',
                        }
                    });
                }
            },
            {
                key: 'reason',
                content: 'Grund',
                col: '5'
            },
            {
                key: 'state',
                content: 'Status',
                col: '1',
                renderer: (item) => {
                    switch(item) {
                        case 'approve':
                           return <Badge type='success'>{item}</Badge>
                           break;
                        default:
                            return <Badge>{item}</Badge>
                    }
                }
            },
            {
                key: 'actions',
                content: 'Aktion',
                col: '1'
            },
        ];
    }

    getTableContentRows() {
        let approvals = this.props.approvals;

        return approvals.map((approval) => {
            if(approval.link) {
                approval.name = <a href={approval.link} target="_blank">{approval.name}</a>;
            }

            return Object.assign(approval, {  
                actions: <SplitButton documentId={approval._id} handleClick={this.handleStateButtonClick} actions={this.getStateActions()}></SplitButton>
            });
        });
    }

    getStateActions() {
        return [
            {
                label: 'Freigeben',
                key: 'approve',
                isMain: true,
            },
            {
                label: 'Bestellen',
                key: 'order'
            },
            {
                label: 'Abschließen',
                key: 'complete'
            },
            {
                label: 'Ablehnen',
                key: 'decline'
            }
        ];
    }

    handleStateButtonClick(documentId, action) {
        let emails = [];
        switch(action) {
            case 'approve':
                emails.push({
                    to: 'michael.moor@goltfisch.de',
                    template: 'userApproveMsgEmail'
                });

                emails.push({
                    to: {
                        groupKey: 'shopping'
                    },
                    template: 'shoppingApproveMsgEmail'
                });

                Meteor.call('Approvals.approve', documentId, emails, (error, result) => {
                    
                });

                break;

            case 'order':
                emails.push({
                    to: 'michael.moor@goltfisch.de',
                    template: 'userOrderMsgEmail'
                });

                emails.push({
                    to: {
                        groupKey: 'admin'
                    },
                    template: 'adminOrderMsgEmail'
                });

                Meteor.call('Approvals.order', documentId, emails, (error, result) => {

                });

                break;

            case 'complete':
                emails.push({
                    to: 'michael.moor@goltfisch.de',
                    template: 'userCompleteMsgEmail'
                });

                emails.push({
                    to: {
                        groupKey: 'admin'
                    },
                    template: 'adminCompleteMsgEmail'
                });

                Meteor.call('Approvals.complete', documentId, emails, (error, result) => {

                });

                break;
                
            case 'decline':
                emails.push({
                    to: 'michael.moor@goltfisch.de',
                    template: 'userDeclineMsgEmail'
                });

                Meteor.call('Approvals.decline', documentId, emails, (error, result) => {

                });

                break;
        }
    }

    handleNewButtonClick() {
        console.log('NEW APPROVAL');
    }
    
    render() {
        return (
            <div className='dashboard-page'>
                <Modal>
                    <NewApprovalModal />
                </Modal>
                <div className="content-approvals">
                    <div className='content-approvals-actions'>
                        <Search />
                        <Button className="btn primary-btn" handleClick={this.handleNewButtonClick} action='new'><i className="fa fa-plus"></i></Button>
                    </div>
                    <Table head={this.getTableHeader()} rows={this.getTableContentRows()}/>
                </div>
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('dashboard.approvals');
    Meteor.subscribe('Usermanagement.users');
    Meteor.subscribe('EmailTemplates');

    return {
      approvals: Approvals.find({deleted: false}, {sort: { createdAt: -1}}).fetch(),
      currentUser: Meteor.user(),
      emails: EmailTemplates.find().fetch()
    };
})(DashboardPage);