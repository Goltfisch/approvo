import React, { Component } from 'react';

import RulesPage from '/imports/ui/pages/RulesPage.js';

import '/imports/ui/css/rules.css';

export default class RulesPageContaier extends Component {
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
            <div className='rules-page-container'>
                <RulesPage
                    currentPage={currentPage}
                    setCurrentPage={this.setCurrentPage}
                />  
            </div>
        );
    }
}