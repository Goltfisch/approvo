import React, { Component } from 'react';

import StatisticsPage from '/imports/ui/pages/StatisticsPage.js';

export default class StatisticsPageContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='statistics-page-container'>
                <StatisticsPage />  
            </div>
        );
    }
}