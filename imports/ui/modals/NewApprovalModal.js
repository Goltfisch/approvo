import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import moment from "moment";
import accounting from "accounting";
import { WithContext as ReactTags } from "react-tag-input";

import Form from "/imports/rainbow-ui/Form.js";

import "/imports/ui/css/tags.css";

const KeyCodes = {
    enter: 13
};

const delimiters = [KeyCodes.enter];

class NewApprovalModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            suggestions: this.getTags()
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    getTags() {
        const { newTags } = this.props;

        newTags.forEach(tag => {
            tag.id = tag._id;
            tag.text = tag.name;
        });

        return newTags;
    }

    handleDelete(i) {
        const { tags } = this.state;

        this.setState({
            tags: tags.filter((tag, index) => index !== i)
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    getFormConfiguration() {
        const { tags } = this.state;
        const props = this.props;

        return {
            id: "new-approval-form",
            headline: "Neue Freigabe",
            description: "Erstelle eine neue Freigabe.",
            inputs: [
                { label: "Name", type: "text", name: "name", placeholder: "Was benötigst du?" },
                { label: "Betrag", type: "text", name: "amount", defaultValue: "0", placeholder: "Wie hoch ist der Beitrag?" },
                { label: "Grund", type: "text", name: "reason", placeholder: "Was ist der Grund für den Kauf?" },
                { label: "Datum", type: "date", name: "date", placeholder: "Welcher Tag ist heute?", defaultValue: moment().format("YYYY-MM-DD") },
                { label: "Link", type: "text", name: "link", defaultValue: "http://", placeholder: "Wo kann der Artikel eingesehen werden?" }
            ],
            buttons: [
                { label: "Abbrechen", type: "cancel", className: "secondary",
                    onClick: () => {
                        props.cancelButtonClick();
                    }
                },
                { label: "Speichern", type: "submit", className: "primary",
                    onClick: formData => {
                        let newApprovalTags = [];

                        if(tags) {
                            tags.forEach(tag => {
                                newApprovalTags.push(tag._id);
                            });
                        }

                        formData.tags = newApprovalTags;
                        formData.amount = accounting.unformat( formData.amount, "," );

                        props.cancelButtonClick();
                        Bert.alert( "Warte auf Ergebnis...", "info", "growl-top-right" );
                        
                        Meteor.call( "Approvals.insert", formData, (error, response) => {
                            if (error) {
                                return Bert.alert( error.reason, "danger", "growl-top-right" );
                            }

                            Bert.alert( "Anfrage wurde erstellt!", "info", "growl-top-right" );
                        });
                    }
                }
            ]
        };
    }

    render() {
        const { tags, suggestions } = this.state;

        let placeholder = "Tags hinzufügen";

        return (
            <div className="content-approval">
                <div className="content-approval-form">
                    <Form configuration={this.getFormConfiguration()} />
                </div>

                <div className="content-approval-tags">
                    <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        delimiters={delimiters}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        );
    }
}

export default withTracker(props => {
    const newTags = props.modalData.tags;

    return {
        currentUser: Meteor.user(),
        newTags
    };
})(NewApprovalModal);
