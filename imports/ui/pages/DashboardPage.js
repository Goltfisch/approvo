import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import accounting from "accounting";
import { Counts } from "meteor/tmeasday:publish-counts";
import moment from "moment";

import { Approvals } from "/imports/api/approvals/approvals.js";
import { EmailTemplates } from "/imports/api/emailTemplates/emailTemplates.js";
import { Tags } from '/imports/api/tags/tags.js';
import { Rules } from '/imports/api/rules/rules.js';
import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';

import NewApprovalModal from "/imports/ui/modals/NewApprovalModal.js";
import EditApprovalModal from "/imports/ui/modals/EditApprovalModal.js";

import Table from "/imports/rainbow-ui/Table.js";
import Button from "/imports/rainbow-ui/Button.js";
import Search from "/imports/rainbow-ui/Search.js";
import Badge from "/imports/rainbow-ui/Badge.js";
import Modal from "/imports/rainbow-ui/Modal.js";

import "/imports/ui/css/dashboard.css";

export class DashboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleNewButtonClick = this.handleNewButtonClick.bind(this);
        this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            modals: [
                {
                    id: "dashboardAddApprovalModal",
                    content: (
                        <NewApprovalModal cancelButtonClick={this.closeModal} />
                    ),
                    visible: false,
                    data: {}
                },
                {
                    id: "dashboardEditApprovalModal",
                    content: (
                        <EditApprovalModal cancelButtonClick={this.closeModal} />
                    ),
                    visible: false,
                    data: {}
                }
            ]
        };
    }

    getTableHeader() {
        return [
            {
                key: "ownerName",
                content: "Benutzer",
                col: "1"
            },
            {
                key: "linkedName",
                content: "Name",
                col: "2"
            },
            {
                key: "amount",
                content: "Betrag",
                col: "1",
                cls: "bold-amount",
                renderer: item => {
                    return accounting.formatMoney(item, {
                        symbol: "€",
                        precision: 2,
                        thousand: ".",
                        decimal: ",",
                        format: {
                            pos: "%v %s",
                            neg: "%v %s",
                            zero: "%v %s"
                        }
                    });
                }
            },
            {
                key: "reason",
                content: "Grund",
                col: "4"
            },
            {
                key: "state",
                content: "Status",
                col: "1",
                renderer: item => {
                    switch (item) {
                        case "requested":
                            return <Badge>Angefragt</Badge>;
                        case "approve":
                            return <Badge type="success">Freigegeben</Badge>;
                        case "order":
                            return <Badge type="info">Bestellt</Badge>;
                        case "complete":
                            return (<Badge type="alternative">Abgeschlossen</Badge>);
                        case "decline":
                            return <Badge type="danger">Abgelehnt</Badge>;
                        case "shelved":
                            return <Badge type="warning">Zurückgestellt</Badge>;
                        default:
                            return <Badge>{item}</Badge>;
                    }
                }
            },
            {
                key: "date",
                content: "Datum",
                cal: "1",
                renderer: item => {
                    return moment(item).format("DD.MM.YYYY");
                }
            },
            {
                key: "actions",
                content: "Aktion",
                col: "1"
            }
        ];
    }

    getTableContentRows() {
        let { approvals, currentUser } = this.props;

        return approvals.map(approval => {
            let isAllowedToEdit = false;

            if(currentUser && (currentUser.userRole == 'admin' || currentUser._id == approval.owner)) {
                isAllowedToEdit = true;
            }

            approval.linkedName = (
                <div className="icon-btn-wrapper">
                    {isAllowedToEdit ?
                        <Button handleClick={ this.handleEditButtonClick } documentId={approval._id} className="icon-label">
                            <i className="far fa-edit"></i>
                            {approval.name}
                        </Button> 
                    : <div>{approval.name}</div>}
                    {approval.link ? <a href={approval.link} target="_blank" className="btn icon-btn primary-btn">
                        <i className="fas fa-external-link-square-alt"></i>
                    </a> : ''}
                </div>
            );

            let buttonActions = {};
            let currenUserRole = UserRoles.findOne({ value: currentUser.userRole });
            let userRule = false;
            let rules = [];
            
            if(currenUserRole && currenUserRole._id) {
                rules = Rules.find({ $or: [{ roleId: currenUserRole._id, budget: { $gte: approval.amount } }, { roleId: currenUserRole._id, budget: -1 }] }).fetch();
            }

            if(approval.tags && approval.tags.length >= 1 && rules && rules.length >= 1) {
                approval.tags.forEach(tag => {
                    rules.forEach(rule =>{
                        if(tag == rule.tagId) {
                            return userRule = true;
                        }
                    });
                });
            }

            if (currentUser.userRole == "admin" || currentUser.userRole == "shopping" || userRule && approval.state == 'requested' ) {
                buttonActions = this.getStateActions(approval.state, approval._id);
            }

            return Object.assign({}, approval, buttonActions);
        });
    }

    getStateActions(state, approvalId) {
        if (state == "complete" || state == "decline") {
            return [];
        } else {
            switch (state) {
                case "requested":
                    return {
                        actions: (
                            <div className="icon-btn-wrapper">
                                <Button
                                    className="btn icon-btn success-btn"
                                    documentId={approvalId}
                                    action='approve'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="fas fa-check" />
                                </Button>
                                <Button
                                    className="btn icon-btn danger-btn"
                                    documentId={approvalId}
                                    action='decline'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="fas fa-times" />
                                </Button>
                                <Button
                                    className="btn icon-btn warning-btn"
                                    documentId={approvalId}
                                    action='shelved'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="far fa-clock" />
                                </Button>
                            </div>
                        )
                    };
                case "shelved":
                    return {
                        actions: (
                            <div className="icon-btn-wrapper">
                                <Button
                                    className="btn icon-btn success-btn"
                                    documentId={approvalId}
                                    action='approve'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="fas fa-check" />
                                </Button>
                                <Button
                                    className="btn icon-btn danger-btn"
                                    documentId={approvalId}
                                    action='decline'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="fas fa-times" />
                                </Button>
                            </div>
                        )
                    };
                case "approve":
                    return {
                        actions: (
                            <div className="icon-btn-wrapper">
                                <Button
                                    className="btn icon-btn primary-btn"
                                    documentId={approvalId}
                                    action='order'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="fas fa-shopping-cart" />
                                </Button>
                            </div>
                        )
                    };
                case "order":
                    return {
                        actions: (
                            <div className="icon-btn-wrapper">
                                <Button
                                    className="btn icon-btn black-btn"
                                    documentId={approvalId}
                                    action='complete'
                                    handleClick={this.handleStateButtonClick}
                                >
                                    <i className="fas fa-shipping-fast" />
                                </Button>
                            </div>
                        )
                    };
            }
        }
    }

    handleStateButtonClick(documentId, action) {
        let emails = [];
        switch (action) {
            case "approve":
                Meteor.call("Approvals.approve", documentId, emails, (error, result) => {
                    if (error) {
                        return Bert.alert(error.reason, "danger", "growl-top-right" );
                    }

                    Bert.alert("Anfrage wurde freigegeben!", "success", "growl-top-right" );
                });

                break;

            case "order":
                Meteor.call("Approvals.order", documentId, emails, (error, result) => {
                    if (error) {
                        return Bert.alert(error.reason, "danger", "growl-top-right" );
                    }

                    Bert.alert("Artikel wurde bestellt!", "success", "growl-top-right" );
                });

                break;

            case "complete":
                Meteor.call( "Approvals.complete", documentId, emails, (error, result) => {
                    if (error) {
                        return Bert.alert(error.reason, "danger", "growl-top-right" );
                    }

                    Bert.alert("Freigabe wurde abgeschlossen!", "success", "growl-top-right" );
                });

                break;

            case "decline":
                Meteor.call("Approvals.decline", documentId, emails, (error, result) => {
                    if (error) {
                        return Bert.alert( error.reason, "danger", "growl-top-right" );
                    }

                    Bert.alert( "Anfrage wurde abgelehnt!", "success", "growl-top-right" );
                });

                break;
            case "shelved":
                Meteor.call("Approvals.shelved", documentId, emails, (error, result) => {
                    if (error) {
                        return Bert.alert(error.reason, "danger", "growl-top-right" );
                    }

                    Bert.alert("Anfrage wurde zurückgestellt!", "success", "growl-top-right" );
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
            if (modal.visible) {
                return (
                    <Modal key={index} closeModal={this.closeModal} modalData={modal.data}>
                        {modal.content}
                    </Modal>
                );
            }
        });
    }

    handleNewButtonClick() {
        const { tags } = this.props;

        this.setState(state => {
            return state.modals.map((modal, index) => {
                if (modal.id === "dashboardAddApprovalModal") {
                    modal.visible = true;
                    modal.data = { tags: tags };
                } else {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    handleEditButtonClick(documentId) {
        const { tags } = this.props;
        
        this.setState(state => {
            return state.modals.map((modal, index) => {
                if (modal.id === "dashboardEditApprovalModal") {
                    modal.visible = true;
                    modal.data = { approvalId: documentId, tags: tags };
                } else {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    closeModal() {
        this.setState(state => {
            return state.modals.map((modal, index) => {
                if (modal.id === "dashboardAddApprovalModal" || modal.id === "dashboardEditApprovalModal") {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    render() {
        const { approvalsCount, currentPage } = this.props;

        return (
            <div className="dashboard-page">
                {this.renderModals()}
                <div className="content-approvals">
                    <div className="content-approvals-actions">
                        <div className="content-approvals-actions-left">
                            <h2>Freigaben</h2>
                            <Button className="btn primary-btn" handleClick={this.handleNewButtonClick} action="new">
                                <i className="fa fa-plus" />
                            </Button>
                        </div>
                        <div className="content-approvals-actions-right">
                            <Search handleSearchInputChange={ this.handleSearchInputChange } />
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
        );
    }
}

export default withTracker(props => {
    q = {};
    p = {};

    if (props.searchQuery) {
        q = props.searchQuery;
    }

    if (props.currentPage) {
        p = props.currentPage;
    }

    Meteor.subscribe("dashboard.approvals", q, p);
    Meteor.subscribe("Usermanagement.users");
    Meteor.subscribe("user.roles");
    Meteor.subscribe("tags");
    Meteor.subscribe("rules");

    const approvals = Approvals.find({}, { sort: { createdAt: -1 } }).fetch();
    const tags = Tags.find().fetch();

    approvals.forEach(approval => {
        let owner = Meteor.users.findOne(approval.owner);

        if (owner && owner._id) {
            approval.ownerName = owner.name;
        }
    });

    return {
        approvals,
        approvalsCount: Counts.get("dashboardApprovalsCount"),
        currentUser: Meteor.user(),
        emails: EmailTemplates.find().fetch(),
        tags
    };
})(DashboardPage);