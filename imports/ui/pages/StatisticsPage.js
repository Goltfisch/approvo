import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import currency from 'currency.js';
import { EURO } from '/imports/helper/euro.js';

import { Approvals } from '/imports/api/approvals/approvals.js';

import Table from '/imports/rainbow-ui/Table.js';

import '/imports/ui/css/statistics.css';

export class StatisticsPage extends Component {
    constructor(props) {
        super(props);
    }

    getTableHeader() {
        return [
            {
                key: 'month',
                content: 'Monat',
                col: '6'
            },
            {
                key: 'expenses',
                content: 'Ausgaben',
                col: '6'
            },
        ];
    }

    getTableContentRows() {
        let approvals = this.props.approvals;

        let months = [
            {
                label: 'Januar',
                number: 0
            },
            {
                label: 'Februar',
                number: 1
            },
            {
                label: 'März',
                number: 2
            },
            {
                label: 'April',
                number: 3
            },
            {
                label: 'Mai',
                number: 4
            },
            {
                label: 'Juni',
                number: 5
            },
            {
                label: 'Juli',
                number: 6
            },
            {
                label: 'August',
                number: 7
            },
            {
                label: 'September',
                number: 8
            },
            {
                label: 'Oktober',
                number: 9
            },
            {
                label: 'November',
                number: 10
            },
            {
                label: 'Dezember',
                number: 11
            }            
        ];

        let statistics = [];

        months.forEach(function(month) {
            let statisticsForMonth = EURO(0);
            
            approvals.forEach(function(approval){
                let approvalDate = new Date(approval.date);

                if(approvalDate.getMonth() === month.number && approval.state === 'complete') {
                    let amount = EURO(approval.amount);
                    statisticsForMonth = statisticsForMonth.add(amount);
                }
            });

            statistics.push({
                month: month.label,
                expenses: statisticsForMonth.format()
            });
        });

        return statistics;
    }

    currentYearExpenses() {
        const { approvals } = this.props;
        let currentDate = new Date();
        let currentYearExpenses = EURO(0);

        approvals.forEach(function(approval){
            let approvalDate = new Date(approval.date);

            if(approvalDate.getFullYear() === currentDate.getFullYear() && approval.state === 'complete') {
                let amount = EURO(approval.amount);
                currentYearExpenses = currentYearExpenses.add(amount);
            }
        });

        return currentYearExpenses.format();
    }

    render() {
        const currentYear = new Date().getFullYear();

        return (
            <div className='statistics-page'>
                <div className="content-statistics">
                    <div className='content-statistics-actions'>
                        <div className='content-statistics-actions-left'>
                            <h2>Statistiken</h2>
                        </div>
                        <div className='content-statistics-actions-right'>
                            <h2>Ausgaben Jahr {currentYear}: {this.currentYearExpenses()}</h2>
                        </div>
                    </div>
                    <Table 
                        head={this.getTableHeader()}
                        rows={this.getTableContentRows()}
                    />
                </div>
            </div>
        )
    }
}

export default withTracker((props) => {
    Meteor.subscribe('statistics.approvals');

    const approvals = Approvals.find({ }, { sort: { createdAt: -1 }}).fetch();

    return {
      approvals
    };
})(StatisticsPage);