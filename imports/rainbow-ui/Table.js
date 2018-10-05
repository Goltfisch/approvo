import React, { Component } from 'react';

import './css/table.css';

export default class Table extends Component {
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

            return <td className={headItem.cls} key={headItem.key}>{item}</td>;
        });
    }
    
    render() {
        return (
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
        )
    }
}