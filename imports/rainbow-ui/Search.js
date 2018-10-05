import React, { Component } from 'react';

export default class Search extends Component {
    render() {
        return (
            <div className='search-wrapper'>
                <label>Suche:</label>
                <input type='text' />
            </div>
        );
    }
}