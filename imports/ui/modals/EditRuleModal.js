import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Form from '/imports/rainbow-ui/Form.js';

class EditRuleModal extends Component {
    getFormConfiguration() {
        const props = this.props;
        const { rule, roles, tags } = props;

        let roleOptions = [];
        roles.forEach(function(role) {
            roleOptions.push({
                label: role.name,
                value: role._id
            });
        });

        let tagOptions = [];
        tags.forEach(function(tag) {
            tagOptions.push({
                label: tag.name,
                value: tag._id
            });
        });

        return {
            id: 'update-rule-form',
            headline: 'Regel bearbeiten',
            inputs: [
                { label: 'Rolle', name: 'roleId', type: 'select', options: roleOptions, placeholder: rule.roleId },
                { label: 'Tag', name: 'tagId', type: 'select', options: tagOptions, placeholder: rule.tagId },
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
    const roles = props.modalData.roles;
    const tags = props.modalData.tags;

    return {
        rule,
        roles,
        tags
    }

})(EditRuleModal);