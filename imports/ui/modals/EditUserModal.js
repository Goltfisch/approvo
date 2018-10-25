import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Form from '/imports/rainbow-ui/Form.js';

class EditUserModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        return {
            id: 'update-user-form',
            headline: 'Benutzer bearbeiten',
            description: 'Bearbeite den Benutzer "' + props.user.name + '"',
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
                        console.log('edit user save', formData);
                        // Meteor.call('User.insert', formData, (error, response) => {
                        //     if(error) {
                        //         Bert.alert(error.message, 'danger', 'growl-top-right');
                        //         return;
                        //     }

                        //     Bert.alert('Benutzer wurde erfolgreich erstellt!', 'info', 'growl-top-right');
                        //     props.cancelButtonClick();
                        // });
                    }
                }
            ],
            data: props.user
        }
    }

    render() {
        return (
            <div className="content-user-form">
                <Form configuration={this.getFormConfiguration()} />
            </div>
        );
    }
}

export default withTracker((props) => {

    const userId = props.modalData.userId;
    
    Meteor.subscribe('Usermanagement.users', { _id: userId });

    const user = Meteor.users.findOne(userId);

    return {
        user
    }

})(EditUserModal);