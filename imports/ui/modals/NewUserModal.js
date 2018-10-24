import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';

import Form from '/imports/rainbow-ui/Form.js';

class NewUserModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        return {
            id: 'new-user-form',
            headline: 'Neuer Benutzer',
            description: 'Erstelle einen neuen Benutzer.',
            inputs: [
                { label: 'Name', type: 'text', name: 'name', placeholder: 'Wie heißt der Benutzer?' },
                { label: 'Benutzername', type: 'text', name: 'username', placeholder: 'Welchen Benutzernamen soll der Benutzer bekommen?' },
                { label: 'Email', type: 'text', name: 'email', placeholder: 'Welche Email Adresse verwendet der Benutzer?' },
                { label: 'Password', type: 'password', name: 'password', placeholder: 'Welches initiale Passwort soll der Benutzer verwenden?' },
                { label: 'Benutzerrolle', type: 'text', name: 'userRole' },
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
                        Meteor.call('User.insert', formData, (error, response) => {
                            if(error) {
                                Bert.alert(error.message, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Benutzer wurde erfolgreich erstellt!', 'info', 'growl-top-right');
                            props.cancelButtonClick();
                        });
                    }
                }
            ]
        }
    }

    render() {
        return (
            <div className="content-user-form">
                <Form configuration={this.getFormConfiguration()} />
            </div>
        )
    }
}

export default withTracker(() => {
    return {
        currentUser: Meteor.user()
    };
})(NewUserModal);