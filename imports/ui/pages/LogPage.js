import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Counts } from 'meteor/tmeasday:publish-counts';
import moment from 'moment';

import { Logs } from '/imports/api/logs/logs.js';

import '/imports/ui/css/logs.css';

import Table from '/imports/rainbow-ui/Table.js';
import Search from '/imports/rainbow-ui/Search.js';

export class LogPage extends Component {
    constructor(props) {
        super(props);

        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    getTableHeader() {
        return [
            {
                key: 'date',
                content: 'Datum',
                col: '1'
            },
            {
                key: 'time',
                content: 'Uhrzeit',
                col: '1'
            },
            {
                key: 'user',
                content: 'Benutzer',
                col: '2'
            },
            {
                key: 'action',
                content: 'Ereignis',
                col: '8'
            }
        ];
    }

    getTableContentRows() {
        return this.props.logs;
    }

    handleSearchInputChange(searchQuery) {
        this.props.setSearchQuery(searchQuery);
    }

    handlePageClick(page) {
        this.props.setCurrentPage(page);
    }
    
    render() {
        const { logsCount, currentPage } = this.props;

        return (
            <div className='logs-page'>
                <div className="content-logs">
                    <div className='content-logs-actions'>
                        <div className='content-logs-actions-left'>
                            <h2>Protokoll</h2>
                        </div>
                        <div className='content-logs-actions-right'>
                            <Search handleSearchInputChange={this.handleSearchInputChange} />
                        </div>
                    </div>
                    <Table 
                        head={this.getTableHeader()}
                        rows={this.getTableContentRows()}
                        totalCount={logsCount}
                        handlePageClick={this.handlePageClick}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        )
    }
}

export default withTracker((props) => {
    q = {};
    p = {};

    if(props.searchQuery) {
        q = props.searchQuery;
    }

    if(props.currentPage) {
        p = props.currentPage;
    }

    Meteor.subscribe('logs', q, p);

    const logs = Logs.find({}, { sort: { date: 1 }}).fetch();

    return {
      logs,
      logsCount: Counts.get('logsCount')
    };
})(LogPage);