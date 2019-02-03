import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Tags } from '/imports/api/tags/tags.js';

import EditTagModal from "/imports/ui/modals/EditTagModal.js";
import Table from '/imports/rainbow-ui/Table.js';
import Form from '/imports/rainbow-ui/Form.js';
import Button from "/imports/rainbow-ui/Button.js";
import Modal from "/imports/rainbow-ui/Modal.js";

import '/imports/ui/css/tags.css';

export class TagsPage extends Component {
    constructor(props) {
        super(props);

        this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            modals: [
                {
                    id: "tagsEditTagModal",
                    content: (
                        <EditTagModal cancelButtonClick={this.closeModal} />
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
                key: 'name',
                content: 'Tag',
                col: '6'
            },{
                key: "actions",
                content: "Aktion",
                col: "1"
            }
        ];
    }

    getTableContentRows() {
        let { tags } = this.props;

        let buttonActions = {};

        return tags.map(tag => {
            buttonActions = this.getTagActions(tag._id);

            return Object.assign({}, tag, buttonActions);
        });
    }

    getTagActions(tagId) {
        return {
            actions: (
                <div className="icon-btn-wrapper">
                    <Button
                        className="btn icon-btn warning-btn"
                        documentId={tagId}
                        action='edit'
                        handleClick={this.handleEditButtonClick}
                    >
                        <i className="fas fa-edit" />
                    </Button>
                    <Button
                        className="btn icon-btn danger-btn"
                        documentId={tagId}
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
        let tag = Tags.findOne(documentId);
        if(tag && tag._id) {
            this.setState((state) => {
                return state.modals.map((modal, index) => {
                    if(modal.id === 'tagsEditTagModal') {
                        modal.visible = true;
                        modal.data = { tag: tag };
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
        Meteor.call("Tags.remove", documentId, (error, result) => {
            if (error) {
                return Bert.alert(error.reason, "danger", "growl-top-right");
            }

            Bert.alert("Tag wurde gelöscht!", "info", "growl-top-right");
        });
    }

    handlePageClick(page) {
        this.props.setCurrentPage(page);
    }

    getFormConfiguration() {
        return {
            id: 'new-tags-form',
            headline: 'Neuer Tag',
            inputs: [
                { label: 'Tag', type: 'text', name: 'name', placeholder: 'Z.B. Büroartikel' },
            ],
            buttons: [
                {
                    label: 'Hinzufügen',
                    type: 'submit',
                    className: 'primary',
                    onClick: (formData) => {
                        Meteor.call('Tags.insert', formData, (error, response) => {
                            if(error) {
                                Bert.alert(error.reason, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Tag wurde erstellt!', 'info', 'growl-top-right');
                        });
                        
                        formData.name = '';
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
                if (modal.id === "tagsEditTagModal") {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    render() {
        const { tagCount, currentPage } = this.props;

        return (
            <div className='tags-page'>
                {this.renderModals()}
                <div className='content-tags-actions'>
                    <div className='content-tags-actions-left'>
                        <h2>Tags</h2>
                    </div>

                    <div className="table-content-tags">
                        <Table 
                            head={this.getTableHeader()}
                            rows={this.getTableContentRows()}
                            totalCount={tagCount}
                            handlePageClick={this.handlePageClick}
                            currentPage={currentPage}
                        />
                    </div>

                    <div className="form-content-tags">
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

    Meteor.subscribe("tags", p);

    const tags = Tags.find({}, { sort: { createdAt: -1 } }).fetch();

    return {
        tags,
        tagCount: Counts.get("TagCount"),
        currentUser: Meteor.user()
    };
})(TagsPage);