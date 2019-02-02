import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import accounting from 'accounting';

import { Rules } from '/imports/api/rules/rules.js';
import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';
import { Tags } from '/imports/api/tags/tags.js';

import EditRuleModal from "/imports/ui/modals/EditRuleModal.js";
import Table from '/imports/rainbow-ui/Table.js';
import Form from '/imports/rainbow-ui/Form.js';
import Button from "/imports/rainbow-ui/Button.js";
import Modal from "/imports/rainbow-ui/Modal.js";

import '/imports/ui/css/rules.css';

export class RulesPage extends Component {
    constructor(props) {
        super(props);

        this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            modals: [
                {
                    id: "rulesEditRuleModal",
                    content: (
                        <EditRuleModal cancelButtonClick={this.closeModal} />
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
                key: 'roleLabel',
                content: 'Rolle',
                relationData: 'roleId',
                relationalTable: 'UserRoles',
                col: '3'
            },
            {
                key: "tagLabel",
                content: "Tag",
                relationData: 'tagId',
                relationalTable: 'Tags',
                col: "3"
            },
            {
                key: "budget",
                content: "Budget",
                col: "3"
            },
            {
                key: "actions",
                content: "Aktion",
                col: "1"
            }
        ];
    }

    getTableContentRows() {
        let { rules } = this.props;

        let buttonActions = {};

        return rules.map(rule => {
            buttonActions = this.getRuleActions(rule._id);

            return Object.assign({}, rule, buttonActions);
        });
    }

    getRuleActions(ruleId) {
        return {
            actions: (
                <div className="icon-btn-wrapper">
                    <Button
                        className="btn icon-btn warning-btn"
                        documentId={ruleId}
                        action='edit'
                        handleClick={this.handleEditButtonClick}
                    >
                        <i className="fas fa-edit" />
                    </Button>
                    <Button
                        className="btn icon-btn danger-btn"
                        documentId={ruleId}
                        action='delete'
                        handleClick={this.handleDeleteButtonClick}
                    >
                        <i className="fas fa-trash" />
                    </Button>
                </div>
            )
        };
    }

    handleEditButtonClick(documentId) {
        const { roles, tags } = this.props;
        let rule = Rules.findOne(documentId);
        
        if(rule && rule._id) {
            this.setState((state) => {
                return state.modals.map((modal, index) => {
                    if(modal.id === 'rulesEditRuleModal') {
                        modal.visible = true;
                        modal.data = {
                            rule: rule,
                            roles: roles,
                            tags: tags
                        };
                    } else {
                        modal.visible = false;
                    }
    
                    return modal;
                });
            });
        }else {
            return false;
        }
    }

    handleDeleteButtonClick(documentId) {
        Meteor.call("Rules.remove", documentId, (error, result) => {
            if (error) {
                return Bert.alert(error.reason, "danger", "growl-top-right");
            }

            Bert.alert("Regel wurde gelöscht!", "info", "growl-top-right");
        });
    }

    handlePageClick(page) {
        this.props.setCurrentPage(page);
    }

    getFormConfiguration() {
        const { roles, tags } = this.props;

        let roleOptions = [];
        roles.forEach(function(role) {
            roleOptions.push({
                label: role.name,
                value: role._id
            });
        });

        let tagOptions = [];
        tags.forEach(function(tag) {
            tagOptions.push({
                label: tag.name,
                value: tag._id
            });
        });

        return {
            id: 'new-rules-form',
            headline: 'Neue Regel',
            inputs: [
                { label: 'Rolle', name: 'roleId', type: 'select', placeholder: 'Rolle', options: roleOptions },
                { label: 'Tag', name: 'tagId', type: 'select', placeholder: 'Tag', options: tagOptions },
                { label: 'Budget', name: 'budget', type: 'text', placeholder: 'Budget' },
            ],
            buttons: [
                {
                    label: 'Hinzufügen',
                    type: 'submit',
                    className: 'primary',
                    onClick: (formData) => {
                        formData.budget = accounting.unformat(formData.budget, ',');
                        Meteor.call('Rules.insert', formData, (error, response) => {
                            if(error) {
                                Bert.alert(error.reason, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Rolle wurde erstellt!', 'info', 'growl-top-right');
                        });

                        formData.budget = '';
                    }
                }
            ],
        }
    }

    renderModals() {
        const { modals } = this.state;

        return modals.map((modal, index) => {
            if(modal.visible) {
                return (
                    <Modal 
                        key={index} 
                        closeModal={this.closeModal} 
                        modalData={modal.data}
                    >
                        {modal.content}
                    </Modal>
                );
            }
        })
    }

    closeModal() {
        this.setState(state => {
            return state.modals.map((modal, index) => {
                if (modal.id === "rulesEditRuleModal") {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    render() {
        const { ruleCount, currentPage } = this.props;

        return (
            <div className='rules-page'>
                {this.renderModals()}
                <div className='content-rules-actions'>
                    <div className='content-rules-actions-left'>
                        <h2>Regelmanagement</h2>
                    </div>

                    <div className="table-content-rules">
                        <Table 
                            head={this.getTableHeader()}
                            rows={this.getTableContentRows()}
                            totalCount={ruleCount}
                            handlePageClick={this.handlePageClick}
                            currentPage={currentPage}
                        />
                    </div>

                    <div className="form-content-rules">
                        <Form configuration={this.getFormConfiguration()} />
                    </div>
                </div>
            </div>
        )
    }
}

export default withTracker(props => {
    p = {};

    if (props.currentPage) {
        p = props.currentPage;
    }

    Meteor.subscribe("rules", p);
    Meteor.subscribe("tags");
    Meteor.subscribe("user.roles");

    const rules = Rules.find({}, { sort: { createdAt: -1 } }).fetch();
    const roles = UserRoles.find().fetch();
    const tags = Tags.find().fetch();

    return {
        rules,
        roles,
        tags,
        ruleCount: Counts.get("RuleCount"),
        currentUser: Meteor.user()
    };
})(RulesPage);