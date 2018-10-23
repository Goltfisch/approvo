import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import '/imports/ui/css/usermanagement.css';

import NewUserModal from '/imports/ui/modals/NewUserModal.js';
import UpdatePasswordModal from '/imports/ui/modals/UpdatePasswordModal.js';

import Button from '/imports/rainbow-ui/Button.js';
import Search from '/imports/rainbow-ui/Search.js';
import Table from '/imports/rainbow-ui/Table.js';
import Modal from '/imports/rainbow-ui/Modal.js';

export class UserManagementPage extends Component {
    constructor(props) {
        super(props);

        this.handleNewButtonClick = this.handleNewButtonClick.bind(this);
        this.handlePasswordButtonClick = this.handlePasswordButtonClick.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            modals: [
                {
                    id: 'userManagementAddUserModal',
                    content: <NewUserModal cancelButtonClick={this.closeModal} />,
                    visible: false,
                },
                {
                    id: 'userManagementSetPasswordModal',
                    content: <UpdatePasswordModal cancelButtonClick={this.closeModal} />,
                    visible: false,
                    data: {}
                }
            ]
        }
    }
    
    getTableHeader() {
        return [
            {
                key: 'name',
                content: 'Name',
                col: '2'
            },
            {
                key: 'username',
                content: 'Benutzername',
                col: '2'
            },
            {
                key: 'emails',
                content: 'Email',
                col: '2',
                renderer: (item) => {
                    return item && item[0] && item[0].address;
                }
            },
            {
                key: 'password',
                content: 'Password',
                col: '2',
                renderer: (item) => {
                    return (<Button 
                                className='btn' 
                                handleClick={this.handlePasswordButtonClick}
                                documentId={item.userId}
                            >
                                <i className="fas fa-key"></i>
                            </Button>);
                }
            },
            {
                key: 'userRole',
                content: 'Benutzerrolle',
                col: '2'
            },
            {
                key: 'actions',
                content: 'Aktion',
                col: '2'
            },
        ];
    }

    getTableContentRows() {
        let { users } = this.props;

        return users.map((user) => {
            user.password = { userId: user._id };
            return Object.assign({}, user, {
                actions: <Button 
                            className='btn' 
                            handleClick={this.handleEditButtonClick}
                            action='edit'
                         ><i className="far fa-edit"></i></Button>
            })
        });
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

    handleNewButtonClick() {
        this.setState((state) => {
            return state.modals.map((modal, index) => {
                if(modal.id === 'userManagementAddUserModal') {
                    modal.visible = true;
                } else {
                    modal.visible = false;
                }

                return modal;
            });
        });
    }

    handlePasswordButtonClick(documentId, action) {
        this.setState((state) => {
            return state.modals.map((modal, index) => {
                if(modal.id === 'userManagementSetPasswordModal') {
                    modal.visible = true;
                    modal.data = { userId: documentId };
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
                modal.visible = false;

                return modal;
            });
        });
    }

    render() {  
        return (
            <div className='usermanagement-page'>
                {this.renderModals()}
                <div className='content-users'>
                    <div className='content-users-actions'>
                        <div className='content-users-actions-left'>
                            <h2>Benutzer</h2>
                            <Button 
                                className='btn primary-btn' 
                                handleClick={this.handleNewButtonClick}
                                action='new'
                            >
                                <i className='fa fa-plus'></i>
                            </Button>
                        </div>
                        <div className='content-users-actions-right'>
                            <Search handleSearchInputChange={this.handleSearchInputChange} />
                        </div>
                    </div>
                    <Table 
                        head={this.getTableHeader()}
                        rows={this.getTableContentRows()}
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

    // if(props.currentPage) {
    //     p = props.currentPage;
    // }

    Meteor.subscribe('Usermanagement.users', q, p);

    return {
        users: Meteor.users.find().fetch(),
        currentUser: Meteor.user(),
    };
})(UserManagementPage);