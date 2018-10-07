import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Form from '/imports/rainbow-ui/Form.js';

class NewApprovalModal extends Component {
  
    getFormConfiguration() {
        return {
            id: 'new-approval-form',
            headline: 'Neue Freigabe',
            description: 'Erstelle eine neue Freigabe.',
            inputs: [
                { label: 'Name', type: 'text', name: 'name', placeholder: 'Wie heißt du?' },
                { label: 'Betrag', type: 'text', name: 'amount', defaultValue: '0', placeholder: 'Wie hoch ist der Beitrag?' },
                { label: 'Grund', type: 'text', name: 'reason', placeholder: 'Was ist der Grund für den Kauf?' },
                { label: 'Link', type: 'text', name: 'link', defaultValue: 'http://', placeholder: 'Wo kann der Artikel eingesehen werden?' }
            ],
            buttons: [
                {
                    label: 'Abbrechen',
                    type: 'secondary',
                    onClick: () => {
                        console.log('cancel button Click approval form');
                    } 
                },
                {
                    label: 'Speichern', 
                    type: 'primary',
                    onClick: () => {
                        console.log('save button Click approval form');
                    }
                }
            ],
        }
    }

    render() {
        return (
            <div className="content-approval-form">
                <Form configuration={this.getFormConfiguration()} />
            </div>
        )
    }
}

export default withTracker(() => {
    return {
        currentUser: Meteor.user()
    };
})(NewApprovalModal);