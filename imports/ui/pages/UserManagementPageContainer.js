import React, { Component } from 'react';

import UserManagementPage from '/imports/ui/pages/UserManagementPage.js';

export default class UserManagementPageContainer extends Component {
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
            <div className='usermanagement-page-container'>
                <UserManagementPage 
                    searchQuery={searchQuery}
                    currentPage={currentPage}
                    setSearchQuery={this.setSearchQuery}
                    setCurrentPage={this.setCurrentPage}
                />
            </div>
        );
    }
}