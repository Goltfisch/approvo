import React, { Component } from 'react';

import '/imports/rainbow-ui/css/search.css';

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    }

    handleSearchInputChange(event) {
        event.preventDefault();

        this.props.handleSearchInputChange(event.target.value);
    }

    render() {

        const { searchQuery } = this.props;

        return (
            <div className='search-wrapper'>
                <i className="fas fa-search"></i>
                <input type='text' name='search' placeholder='Was suchst du?' value={searchQuery} onChange={this.handleSearchInputChange} />
            </div>
        );
    }
}