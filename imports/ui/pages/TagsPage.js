import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Tags } from '/imports/api/tags/tags.js';

import Table from '/imports/rainbow-ui/Table.js';
import Form from '/imports/rainbow-ui/Form.js';

import '/imports/ui/css/tags.css';

export class TagsPage extends Component {
    constructor(props) {
        super(props);

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    getTableHeader() {
        return [
            {
                key: 'name',
                content: 'Tag',
                col: '3'
            },
        ];
    }

    getTableContentRows() {
        let { tags } = this.props;

        return tags.map(tag => {
            return Object.assign({}, tag);
        });
    }

    handlePageClick(page) {
        this.props.setCurrentPage(page);
    }

    getFormConfiguration() {
        const props = this.props;

        return {
            id: 'new-tags-form',
            headline: 'Neuer Tag',
            inputs: [
                { label: 'Tag', type: 'text', name: 'name', placeholder: 'Z.B. Büroartikel' },
            ],
            buttons: [
                {
                    label: 'Hinzufügen',
                    type: 'submit',
                    className: 'primary',
                    onClick: (formData) => {
                        Meteor.call('Tags.insert', formData, (error, response) => {
                            if(error) {
                                Bert.alert(error.reason, 'danger', 'growl-top-right');
                                return;
                            }

                            Bert.alert('Tag wurde erstellt!', 'info', 'growl-top-right');
                            props.cancelButtonClick();
                        });
                    }
                }
            ],
        }
    }

    render() {
        const { tagCount, currentPage } = this.props;

        return (
            <div className='tags-page'>
                <div className='content-tags-actions'>
                    <div className='content-tags-actions-left'>
                        <h2>Tagverwaltung</h2>
                    </div>

                    <div className="table-content-tags">
                        <Table 
                            head={this.getTableHeader()}
                            rows={this.getTableContentRows()}
                            totalCount={tagCount}
                            handlePageClick={this.handlePageClick}
                            currentPage={currentPage}
                        />
                    </div>

                    <div className="form-content-tags">
                        <Form configuration={this.getFormConfiguration()} />
                    </div>
                </div>
            </div>
        )
    }
}

export default withTracker(props => {
    p = {};

    if (props.currentPage) {
        p = props.currentPage;
    }

    Meteor.subscribe("tags", p);

    const tags = Tags.find({}, { sort: { createdAt: -1 } }).fetch();

    return {
        tags,
        tagCount: Counts.get("TagCount"),
        currentUser: Meteor.user()
    };
})(TagsPage);