import React, { Component } from 'react';

import Form from '/imports/rainbow-ui/Form.js';

export default class UpdatePasswordModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        return {
            id: 'update-password-form',
            headline: 'Passwort zurücksetzen',
            description: 'Setze das Passwort zurück.',
            inputs: [
                { label: 'Passwort', type: 'text', name: 'password', placeholder: 'Wie sieht das neue Passwort aus?' }
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
                        Meteor.call('User.updatePassword', { _id: props.modalData.userId, password: formData.password }, (error, response) => {
                            if(error) {
                                Bert.alert(error.message, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Passwort wurde zurückgesetzt!', 'info', 'growl-top-right');
                            props.cancelButtonClick();
                        });
                    }
                }
            ]
        }
    }

    render() {
        return (
            <div className="content-password-form">
                <Form configuration={this.getFormConfiguration()} />
            </div>
        )
    }
}