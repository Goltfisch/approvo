import React, { Component } from 'react';

import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';
import { Tags } from '/imports/api/tags/tags.js';

import Page from '/imports/rainbow-ui/Page.js';

import './css/table.css';
import './css/pagination.css';

export default class Table extends Component {
    constructor(props) {
        super(props);

        Meteor.subscribe("user.roles");
        Meteor.subscribe("tags");
    }

    renderTableHead() {
        return this.props.head.map((headItem) => {
            return <th key={headItem.key} className={this.getColsizeClassName(headItem.col)}>{headItem.content}</th>;
        });
    }

    getColsizeClassName(colsize) {
        return 'col-size-' + colsize;
    }

    renderTableContentRows() {
        const props = this.props;

        return props.rows.map((row, index) => {
            return <tr key={index}>{this.renderTableRow(row)}</tr>;
        });
    }

    renderTableRow(row) {
        const props = this.props;

        return props.head.map((headItem) => {
            let item;
            
            if(headItem && headItem.renderer && typeof headItem.renderer === 'function') {
                item = headItem.renderer(row[headItem.key]);
            }else{
                item = row[headItem.key];
            }

            if(headItem && headItem.relationData) {
                let tag = Tags.findOne(row[headItem.relationData]);

                if(tag && tag._id) {
                    item = tag.name
                }else {
                    let role = UserRoles.findOne(row[headItem.relationData]);

                    if(role && role._id) {
                        item = role.name
                    }
                }
            }
            
            return <td className={headItem.cls} key={headItem.key}>{item}</td>;
        });
    }

    renderPagination() {
        const { totalCount, handlePageClick, currentPage } = this.props;

        let pagination = [];

        for(let i = 1; i <= Math.ceil(totalCount/25); i++) {
            pagination.push(i);
        }

        return pagination.map((page, index) => {
            return <Page key={index} label={page} value={page} onClick={handlePageClick} isActive={currentPage == page ? true : false} />;
        });
    }
    
    render() {

        const countRows = this.props.rows.length;

        return (
            <div>
                { countRows > 0 ?
                    <table className='table'>
                        <thead>
                            <tr>
                                {this.renderTableHead()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableContentRows()}
                        </tbody>
                    </table>
                : 'Keine Einträge vorhanden' }
                <div className='pagination'>
                    {this.renderPagination()}
                </div>
            </div>
        )
    }
}