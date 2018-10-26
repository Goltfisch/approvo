import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Form from '/imports/rainbow-ui/Form.js';

class EditUserModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        let { user } = props;

        user.email = user.emails[0] && user.emails[0].address;
            
        return {
            id: 'update-user-form',
            headline: 'Benutzer bearbeiten',
            description: 'Bearbeite den Benutzer "' + props.user.name + '"',
            inputs: [
                { label: 'Name', type: 'text', name: 'name', placeholder: 'Wie heißt der Benutzer?' },
                { label: 'Benutzername', type: 'text', name: 'username', placeholder: 'Welchen Benutzernamen soll der Benutzer bekommen?' },
                { label: 'Email', type: 'text', name: 'email', placeholder: 'Welche Email Adresse verwendet der Benutzer?' },
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
                        
                        formData._id = user._id;

                        Meteor.call('User.update', formData, (error, response) => {
                            if(error) {
                                Bert.alert(error.message, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Benutzer wurde erfolgreich bearbeitet!', 'info', 'growl-top-right');
                            props.cancelButtonClick();
                        });
                    }
                }
            ],
            data: user
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