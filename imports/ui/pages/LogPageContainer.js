import React, { Component } from 'react';

import LogPage from '/imports/ui/pages/LogPage.js';

export default class LogPageContainer extends Component {
    constructor(props) {
        super(props);

        this.setSearchQuery = this.setSearchQuery.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);

        this.state = {
            searchQuery: '',
            currentPage: props.match.params.page ? props.match.params.page : 1,
        };
    }

    setSearchQuery(query) {
        this.setState((state) => {
            return state.searchQuery = query;
        });
    }

    setCurrentPage(page) {
        this.setState((state) => {
            return state.currentPage = page;
        });
    }

    render() {
        const { searchQuery, currentPage } = this.state;
        
        return (
            <div className='logs-page-container'>
                <LogPage 
                    searchQuery={searchQuery}
                    currentPage={currentPage}
                    setSearchQuery={this.setSearchQuery}
                    setCurrentPage={this.setCurrentPage}
                />  
            </div>
        );
    }
}