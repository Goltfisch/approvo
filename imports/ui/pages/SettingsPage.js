import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';

import Table from '/imports/rainbow-ui/Table.js';
import SwitchButton from '/imports/rainbow-ui/SwitchButton.js';

export class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    getTableHeader() {
        return [
            {
                key: 'setting',
                content: 'Einstellung',
                col: '10'
            },
            {
                key: 'action',
                content: 'An / Aus',
                col: '2'
            },
        ];
    }

    getTableContentRows() {
        const { currentUser } = this.props;

        let settings = [
            {
                setting: 'Benachrichtigen, wenn eine Anfrage erfolgreich erstellt wurde',
                name: 'onCreatedRequest'
            },
            {
                setting: 'Benachrichtigen, wenn eine Anfrage freigegeben wurde',
                name: 'onApprovedRequest'
            },
            {
                setting: 'Benachrichtigen, wenn eine Freigabe bestellt wurde',
                name: 'onPurchasedApproval'
            },
            {
                setting: 'Benachrichtigen, wenn eine Freigabe abgeschlossen wurde',
                name: 'onCompletedOrder'
            },
            {
                setting: 'Benachrichtigen, wenn eine Anfrage abgelehnt wurde',
                name: 'onDeclinedRequest'
            },
            {
                setting: 'Benachrichtigen, wenn deine Rolle sich ändert',
                name: 'onChangedUserRole'
            }
        ];

        return settings.map((setting) => {
            let isChecked = false;

            isChecked = currentUser.notifications.indexOf(setting.name) !== -1 ? true : false;

            setting.action = <SwitchButton 
                                handleChange={this.handleChange} 
                                documentId={currentUser._id}
                                name={setting.name}
                                isChecked={isChecked}
                            />;
            return setting;
        });
    }
    
    handleChange(documentId, state, name) {
        const { notifications } = this.props.currentUser;
        let user = {
            notifications
        };

        if(state) {
            user.notifications.push(name);
        } else {
            user.notifications = notifications.filter((n) => {
                 return n !== name;
            });
        }

        user.notifications = user.notifications.filter((value, index, self) => { 
            return self.indexOf(value) === index;
        });

        Meteor.call('User.updateSettings', {
            _id: documentId,
            ...user
        }, (error, response) => {
            if(error) {
                Bert.alert(error.message, 'danger', 'growl-top-right');
                return;
            }

            Bert.alert( 'Deine Einstellungen wurden angepasst.', 'success', 'growl-top-right' );
        });
    }

    render() {
        return (
            <div className='settings-page'>
                <div className='content-settings'>
                    <div className='content-settings-actions'>
                        <div className='content-settings-actions-left'>
                            <h2>Einstellungen</h2>
                        </div>
                        <div className='content-settings-actions-right'></div>
                    </div>
                    <Table 
                        head={this.getTableHeader()}
                        rows={this.getTableContentRows()}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    return {
      currentUser: Meteor.users.findOne(Meteor.userId()),
    };
})(SettingsPage);