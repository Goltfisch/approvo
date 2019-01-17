import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import accounting from 'accounting';
import { Counts } from 'meteor/tmeasday:publish-counts';
import moment from 'moment';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

import '/imports/ui/css/dashboard.css';

import NewApprovalModal from '/imports/ui/modals/NewApprovalModal.js';

import Table from '/imports/rainbow-ui/Table.js';
import SplitButton from '/imports/rainbow-ui/SplitButton.js';
import Button from '/imports/rainbow-ui/Button.js';
import Search from '/imports/rainbow-ui/Search.js';
import Badge from '/imports/rainbow-ui/Badge.js';
import Modal from '/imports/rainbow-ui/Modal.js';

export class DashboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleNewButtonClick = this.handleNewButtonClick.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            modals: [
                {
                    id: 'dashboardAddApprovalModal',
                    content: <NewApprovalModal cancelButtonClick={this.closeModal} />,
                    visible: false
                }
            ]
        }
    }
 
    getTableHeader() {
        return [
            {
                key: 'ownerName',
                content: 'Benutzer',
                col: '2'
            },
            {
                key: 'linkedName',
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
                col: '4'
            },
            {
                key: 'state',
                content: 'Status',
                col: '1',
                renderer: (item) => {
                    switch(item) {
                        case 'requested':
                           return <Badge>Angefragt</Badge>
                        case 'approve':
                           return <Badge type='success'>Freigegeben</Badge>
                        case 'order':
                           return <Badge type='info'>Bestellt</Badge>
                        case 'complete':
                           return <Badge type='alternative'>Abgeschlossen</Badge>
                        case 'decline':
                           return <Badge type='danger'>Abgelehnt</Badge>
                        case 'reset':
                           return <Badge type='warning'>Zurückgestellt</Badge>
                        default:
                            return <Badge>{item}</Badge>
                    }
                }
            },
            {
                key: 'date',
                content: 'Datum',
                cal: '1',
                renderer: (item) => {
                    return moment(item).format('DD.MM.YYYY');
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
        let { approvals, currentUser } = this.props;

        return approvals.map((approval) => {
            if(approval.link) {
                approval.linkedName = <a href={approval.link} target="_blank">{approval.name}</a>;
            } else {
                approval.linkedName = approval.name;
            }

            let splitButtonActions = {};

            if(currentUser.userRole == 'admin' || currentUser.userRole == 'shopping') {
                splitButtonActions = {
                    actions: <SplitButton documentId={approval._id} handleClick={this.handleStateButtonClick} actions={this.getStateActions(approval.state)} />
                }
            }

            return Object.assign({}, approval, splitButtonActions);
        });
    }

    getStateActions(state) {

        return [
            {
                label: 'Freigeben',
                key: 'approve',
                isMain: state == 'requested',
            },
            {
                label: 'Bestellen',
                key: 'order',
                isMain: state == 'approve'
            },
            {
                label: 'Abschließen',
                key: 'complete',
                isMain: state == 'order'
            },
            {
                label: 'Ablehnen',
                key: 'decline',
                isMain: false
            },
            {
                label: 'Zurückstellen',
                key: 'reset',
                isMain: false
            }
        ];
    }

    handleStateButtonClick(documentId, action) {
        let emails = [];
        switch(action) {
            case 'approve':
                Meteor.call('Approvals.approve', documentId, emails, (error, result) => {
                    if(error) {
                        Bert.alert(error.reason, 'danger', 'growl-top-right');
                        return;
                    }
                    
                    Bert.alert('Anfrage wurde freigegeben!', 'success', 'growl-top-right');
                });

                break;

            case 'order':
                Meteor.call('Approvals.order', documentId, emails, (error, result) => {
                    if(error) {
                        Bert.alert(error.reason, 'danger', 'growl-top-right');
                        return;
                    }
                    
                    Bert.alert('Artikel wurde bestellt!', 'success', 'growl-top-right');
                });

                break;

            case 'complete':
                Meteor.call('Approvals.complete', documentId, emails, (error, result) => {
                    if(error) {
                        Bert.alert(error.reason, 'danger', 'growl-top-right');
                        return;
                    }
                    
                    Bert.alert('Freigabe wurde abgeschlossen!', 'success', 'growl-top-right');
                });

                break;
                
            case 'decline':
                Meteor.call('Approvals.decline', documentId, emails, (error, result) => {
                    if(error) {
                        Bert.alert(error.reason, 'danger', 'growl-top-right');
                        return;
                    }
                    
                    Bert.alert('Anfrage wurde abgelehnt!', 'success', 'growl-top-right');
                });

                break;
            case 'reset':
                Meteor.call('Approvals.reset', documentId, emails, (error, result) => {
                    if(error) {
                        Bert.alert(error.reason, 'danger', 'growl-top-right');
                        return;
                    }
                    
                    Bert.alert('Anfrage wurde zurückgestellt!', 'success', 'growl-top-right');
                });

                break;
        }
    }

    handleSearchInputChange(searchQuery) {
        this.props.setSearchQuery(searchQuery);
    }

    handlePageClick(page) {
        this.props.setCurrentPage(page);
    }

    renderModals() {
        const { modals } = this.state;

        return modals.map((modal, index) => {
            if(modal.visible) {
                return (<Modal key={index} closeModal={this.closeModal}>
                    {modal.content}
                </Modal>);
            }
        });
    }

    handleNewButtonClick() {
        this.setState((state) => {
            return state.modals.map((modal, index) => {
                if(modal.id === 'dashboardAddApprovalModal') {
                    modal.visible = true;
                } else {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    closeModal() {
        this.setState((state) => {
            return state.modals.map((modal, index) => {
                if(modal.id === 'dashboardAddApprovalModal') {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }
    
    render() {
        const { approvalsCount, currentPage } = this.props;

        return (
            <div className='dashboard-page'>
                {this.renderModals()}
                <div className="content-approvals">
                    <div className='content-approvals-actions'>
                        <div className='content-approvals-actions-left'>
                            <h2>Freigaben</h2>
                            <Button className="btn primary-btn" handleClick={this.handleNewButtonClick} action='new'><i className="fa fa-plus"></i></Button>
                        </div>
                        <div className='content-approvals-actions-right'>
                            <Search handleSearchInputChange={this.handleSearchInputChange} />
                        </div>
                    </div>
                    <Table 
                        head={this.getTableHeader()}
                        rows={this.getTableContentRows()}
                        totalCount={approvalsCount}
                        handlePageClick={this.handlePageClick}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        )
    }
}

export default withTracker((props) => {
    q = {};
    p = {};

    if(props.searchQuery) {
        q = props.searchQuery;
    }

    if(props.currentPage) {
        p = props.currentPage;
    }

    Meteor.subscribe('dashboard.approvals', q, p);

    const approvals = Approvals.find({}, { sort: { date: -1 }}).fetch();

    approvals.forEach(approval => {
        let owner = Meteor.users.findOne(approval.owner);

        if(owner && owner._id) {
            approval.ownerName = owner.name
        }
    });

    return {
      approvals,
      approvalsCount: Counts.get('dashboardApprovalsCount'),
      currentUser: Meteor.user(),
      emails: EmailTemplates.find().fetch()
    };
})(DashboardPage);