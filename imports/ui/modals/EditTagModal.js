import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Form from '/imports/rainbow-ui/Form.js';

class EditTagModal extends Component {
    getFormConfiguration() {
        const props = this.props;

        let { tag } = props;

        return {
            id: 'update-tag-form',
            headline: 'Tag bearbeiten',
            inputs: [
                { label: 'Tag', type: 'text', name: 'name', placeholder: 'Z.B. Büroartikel' },
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
                        Meteor.call('Tags.update', {
                            _id: tag._id,
                            ...formData
                        });

                        props.cancelButtonClick();
                    }
                }
            ],
            data: tag
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

    const tag = props.modalData.tag;

    return {
        tag
    }

})(EditTagModal);