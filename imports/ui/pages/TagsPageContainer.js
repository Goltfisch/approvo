import React, { Component } from 'react';

import TagsPage from '/imports/ui/pages/TagsPage.js';

import '/imports/ui/css/tags.css';

export default class TagsPageContaier extends Component {
    constructor(props) {
        super(props);

        this.setCurrentPage = this.setCurrentPage.bind(this);

        this.state = {
            currentPage: 1,
        }

        if(props && props.match && props.match.params && props.match.params.page) {
            this.state = {
                currentPage: props.match.params.page,
            };
        }
    }

    setCurrentPage(page) {
        this.setState((state) => {
            return state.currentPage = page;
        });
    }

    render() {
        const { currentPage } = this.state;

        return (
            <div className='tags-page-container'>
                <TagsPage
                    currentPage={currentPage}
                    setCurrentPage={this.setCurrentPage}
                />  
            </div>
        );
    }
}