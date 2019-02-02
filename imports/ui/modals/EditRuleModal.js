import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Form from '/imports/rainbow-ui/Form.js';

class EditRuleModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        let { rule } = props;

        return {
            id: 'update-rule-form',
            headline: 'Regel bearbeiten',
            inputs: [
                { label: 'Rolle', name: 'roleId', type: 'text', placeholder: 'Rolle' },
                { label: 'Tag', name: 'tagId', type: 'text', placeholder: 'Tag' },
                { label: 'Budget', name: 'budget', type: 'text', placeholder: 'Budget' },
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
                        Meteor.call('Rules.update', {
                            _id: rule._id,
                            ...formData
                        });

                        props.cancelButtonClick();
                    }
                }
            ],
            data: rule
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

    const rule = props.modalData.rule;

    return {
        rule
    }

})(EditRuleModal);