import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import moment from 'moment';
import accounting from 'accounting';

import Form from '/imports/rainbow-ui/Form.js';

class EditApprovalModal extends Component {
    // getFormConfiguration() {
    //     const props = this.props;

    //     return {
    //         id: 'edit-approval-form',
    //         headline: 'Neue Freigabe',
    //         description: 'Erstelle eine neue Freigabe.',
    //         inputs: [
    //             { label: 'Name', type: 'text', name: 'name', placeholder: 'Was benötigst du?' },
    //             { label: 'Betrag', type: 'text', name: 'amount', defaultValue: '0', placeholder: 'Wie hoch ist der Beitrag?' },
    //             { label: 'Grund', type: 'text', name: 'reason', placeholder: 'Was ist der Grund für den Kauf?' },
    //             { label: 'Datum', type: 'date', name: 'date', placeholder: 'Welcher Tag ist heute?', defaultValue: moment().format('YYYY-MM-DD') },
    //             { label: 'Link', type: 'text', name: 'link', defaultValue: 'http://', placeholder: 'Wo kann der Artikel eingesehen werden?' }
    //         ],
    //         buttons: [
    //             {
    //                 label: 'Abbrechen',
    //                 type: 'cancel',
    //                 className: 'secondary',
    //                 onClick: () => {
    //                     props.cancelButtonClick();
    //                 } 
    //             },
    //             {
    //                 label: 'Speichern', 
    //                 type: 'submit',
    //                 className: 'primary',
    //                 onClick: (formData) => {
    //                     console.log('update approval');
    //                     // formData.amount = accounting.unformat(formData.amount, ',');
    //                     // Meteor.call('Approvals.insert', formData, (error, response) => {
    //                     //     if(error) {
    //                     //         Bert.alert(error.reason, 'danger', 'growl-top-right');
    //                     //         return;
    //                     //     }

    //                     //     Bert.alert('Anfrage wurde erstellt!', 'info', 'growl-top-right');
    //                     //     props.cancelButtonClick();
    //                     // });
    //                 }
    //             }
    //         ],
    //     }
    // }

    render() {
        return (
            <div className="content-approval-form">
                EDIT THE FORM
                {/* <Form configuration={this.getFormConfiguration()} /> */}
            </div>
        )
    }
}

export default withTracker(() => {
    return {
        currentUser: Meteor.user()
    };
})(EditApprovalModal);