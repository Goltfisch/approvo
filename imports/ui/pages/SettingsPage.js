import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';

export class SettingsPage extends Component {
    getCreateMsgState() {
        if(this.props.currentUser) {
            if(this.props.currentUser.createMsgState == true) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    setCreateMsgState() {
        if(this.props.currentUser) {
            var user = this.props.currentUser;
            if(user.createMsgState == true) {
                user.createMsgState = false;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Erstellungsemail-Benachrichtigung deaktiviert.', 'info', 'growl-top-right' );
            } else if(user.createMsgState == false) {
                user.createMsgState = true;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Erstellungsemail-Benachrichtigung aktiviert.', 'info', 'growl-top-right' );
            }
        }
    }

    getApproveMsgState() {
        if(this.props.currentUser) {
            if(this.props.currentUser.approveMsgState == true) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    setApproveMsgState() {
        if(this.props.currentUser) {
            var user = this.props.currentUser;
            if(user.approveMsgState == true) {
                user.approveMsgState = false;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Freigabeemail-Benachrichtigung deaktiviert.', 'info', 'growl-top-right' );
            } else if(user.approveMsgState == false) {
                user.approveMsgState = true;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Freigabeemail-Benachrichtigung aktiviert.', 'info', 'growl-top-right' );
            }
        }
    }

    getOrderMsgState() {
        if(this.props.currentUser) {
            if(this.props.currentUser.orderMsgState == true) {
                return true;
            } else {
                return false;
            }
        }
    }

    setOrderMsgState() {
        if(this.props.currentUser) {
            var user = this.props.currentUser;
            if(user.orderMsgState == true) {
                user.orderMsgState = false;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });
                
                Bert.alert( 'Du hast die Bestellungsemail-Benachrichtigung deaktiviert.', 'info', 'growl-top-right' );
            } else if(user.orderMsgState == false) {
                user.orderMsgState = true;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Bestellungsemail-Benachrichtigung aktiviert.', 'info', 'growl-top-right' );
            }
        }
    }

    getCompleteMsgState() {
        if(this.props.currentUser) {
            if(this.props.currentUser.completeMsgState == true) {
                return true;
            } else {
                return false;
            }
        }
    }

    setCompleteMsgState() {
        if(this.props.currentUser) {
            var user = this.props.currentUser;
            if(user.completeMsgState == true) {
                user.completeMsgState = false;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Abschließungsemail-Benachrichtigung deaktiviert.', 'info', 'growl-top-right' );
            } else if(user.completeMsgState == false) {
                user.completeMsgState = true;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Abschließungsemail-Benachrichtigung aktiviert.', 'info', 'growl-top-right' );
            }
        }
    }

    getDeclineMsgState() {
        if(this.props.currentUser) {
            if(this.props.currentUser.declineMsgState == true) {
                return true;
            } else {
                return false;
            }
        }
    }

    setDeclineMsgState() {
        if(this.props.currentUser) {
            var user = this.props.currentUser;
            if(user.declineMsgState == true) {
                user.declineMsgState = false;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Ablehnungsemail-Benachrichtigung deaktiviert.', 'info', 'growl-top-right' );
            } else if(user.declineMsgState == false) {
                user.declineMsgState = true;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Ablehnungsemail-Benachrichtigung aktiviert.', 'info', 'growl-top-right' );
            }
        }
    }

    getRoleMsgState() {
        if(this.props.currentUser) {
            if(this.props.currentUser.roleMsgState == true) {
                return true;
            } else {
                return false;
            }
        }
    }
    
    setRoleMsgState() {
        if(this.props.currentUser) {
            var user = this.props.currentUser;
            if(user.roleMsgState == true) {
                user.roleMsgState = false;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Rollenemail-Benachrichtigung deaktiviert.', 'warning', 'growl-top-right' );
            } else if(user.roleMsgState == false) {
                user.roleMsgState = true;
                Meteor.call('User.update', {
                    _id: user._id,
                    ...user
                });

                Bert.alert( 'Du hast die Rollenemail-Benachrichtigung aktiviert.', 'warning', 'growl-top-right' );
            }
        }
    }

    handleChange() {
        return;
    }

    render() {
        return (
            <div className='settings-page'>
                <h2>Freigaben Benachrichtigungen:</h2>
                <ul className="accountApprovalSettingsOptions">
                    <li>
                        <label>Wenn eine Anfrage erfolgrreich erstellt wurde</label>
                        <input type="checkbox" onChange={this.handleChange.bind(this)} onClick={this.setCreateMsgState.bind(this)} checked={this.getCreateMsgState()} className="creationMsgSwitch" />
                        <p> </p>
                    </li>
                    <li>
                        <label>Wenn eine Anfrage freigegeben wurde</label>
                        <input type="checkbox" onChange={this.handleChange.bind(this)} onClick={this.setApproveMsgState.bind(this)} checked={this.getApproveMsgState()} className="approveMsgSwitch" />
                        <p> </p>
                    </li>
                    <li>
                        <label>Wenn eine Freigabe bestellt wurde</label>
                        <input type="checkbox" onChange={this.handleChange.bind(this)} onClick={this.setOrderMsgState.bind(this)} checked={this.getOrderMsgState()} className="orderMsgSwitch" />
                        <p> </p>
                    </li>
                    <li>
                        <label>Wenn eine Freigabe angekommen ist</label>
                        <input type="checkbox" onChange={this.handleChange.bind(this)} onClick={this.setCompleteMsgState.bind(this)} checked={this.getCompleteMsgState()} className="completeMsgSwitch" />
                        <p> </p>
                    </li>
                    <li>
                        <label>Wenn eine Anfrage Abgelehnt wurde</label>
                        <input type="checkbox" onChange={this.handleChange.bind(this)} onClick={this.setDeclineMsgState.bind(this)} checked={this.getDeclineMsgState()} className="declineMsgSwitch" />
                        <p> </p>
                    </li>
                </ul>

                <p> </p>
                <p> </p>

                <h2>Acccount Benachrichtigungen:</h2>
                <ul className="accountSettingsOptions">
                    <li>
                        <label>Wenn deine Rolle sich ändert</label>
                        <input type="checkbox" onChange={this.handleChange.bind(this)} onClick={this.setRoleMsgState.bind(this)} checked={this.getRoleMsgState()} className="roleMsgSwitch" />
                        <p> </p>
                    </li>
                </ul>
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('Usermanagement.users');
  
    return {
      currentUser: Meteor.user(),
    };
})(SettingsPage);