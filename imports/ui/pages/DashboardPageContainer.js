import React, { Component } from 'react';

import DashboardPage from '/imports/ui/pages/DashboardPage.js';

export default class DashboardPageContainer extends Component {
    constructor(props) {
        super(props);

        this.setSearchQuery = this.setSearchQuery.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);

        this.state = {
            searchQuery: '',
            currentPage: '',
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
            <div className='dashboard-page-container'>
                <DashboardPage 
                    searchQuery={searchQuery}
                    currentPage={currentPage}
                    setSearchQuery={this.setSearchQuery}
                    setCurrentPage={this.setCurrentPage}
                />  
            </div>
        );
    }
}