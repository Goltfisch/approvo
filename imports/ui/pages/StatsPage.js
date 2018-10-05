import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Approvals } from '/imports/api/approvals/approvals.js';

import Table from '/imports/rainbow-ui/Table.js';

export class StatsPage extends Component {
    constructor() {
        super();
        this.state = {
            search: ''
        };
    }

    updateSearch(event) {
        this.setState({search: event.target.value})
    }

    getTableHeader() {
        return [
            {
               key: 'users',
               content: 'Benutzer'
            },
            {
                key: 'expenditure',
                content: 'Ausgaben'
            },
            {
                key: 'allApprovals',
                content: 'Freigaben'
            },
            {
                key: 'approvedApprovals',
                content: 'Angenommene Freigaben'
            }
        ];
    }

    getTableContentRows() {
        if(Meteor.user()) {
            let allApprovals;
            let approvedApprovals;
            if(this.state.search.length >= 1) {
                allApprovals = Approvals.find({ date: { $lte: this.state.search } }).fetch();
                approvedApprovals = Approvals.find({ $and: [ { state: { $not: 'requested' } }, { state: { $not: 'decline'} }, { date: { $lte: this.state.search } } ] }).fetch();
            }else {
                allApprovals = Approvals.find().fetch();
                approvedApprovals = Approvals.find({ $and: [ { state: { $not: 'requested' } }, { state: { $not: 'decline'} } ] }).fetch();
            }

            let users = this.props.users;
            let approvedApprovalsCounter = 0;
            let allApprovalsCounter = 0;
            let combinedExpenditure = 0;

            for(let i=0; i<allApprovals.length; i++) {
                allApprovalsCounter = i+1;
            }

            for(let i=0; i<approvedApprovals.length; i++) {
                approvedApprovalsCounter = i+1;
            }

            allApprovals.forEach(element => {
                if(element.amount) {
                    combinedExpenditure += parseInt(element.amount);
                }
            });
    
            let result = [
                {
                    _id: 1000000,
                    users: 'Gesamt',
                    expenditure: combinedExpenditure,
                    allApprovals: allApprovalsCounter,
                    approvedApprovals: approvedApprovalsCounter
                }
            ];

            users.forEach(element => {
                if(element.name) {
                    let userApprovals;
                    let approvedUserApprovals;
                    if(this.state.search.length >= 1) {
                        userApprovals = Approvals.find({ $and: [ { owner: element.name }, { date: { $lte: this.state.search } } ] }).fetch();
                        approvedUserApprovals = Approvals.find({ $and: [ { state: { $not: 'requested' } }, { state: { $not: 'decline'} }, { owner: element.name }, { date: { $lte: this.state.search } } ] }).fetch();

                        console.log(Approvals.find({date: { $lte: this.state.search } }).fetch());
                    }else {
                        userApprovals = Approvals.find({owner: element.name}).fetch();
                        approvedUserApprovals = Approvals.find({ $and: [ { state: { $not: 'requested' } }, { state: { $not: 'decline'} }, { owner: element.name } ] }).fetch();
                    }

                    //console.log('Filter all', userApprovals);
                    //console.log('Filter approved', approvedApprovals);

                    let allApprovalsCounter = 0;
                    let approvedApprovalsCounter = 0;
                    let expenditure = 0;

                    userApprovals.forEach(element => {
                        if(element.amount) {
                            expenditure += element.amount;
                        }
                    });

                    for(let i=0; i<userApprovals.length; i++) {
                        allApprovalsCounter = i+1;
                    }

                    for(let i=0; i<approvedUserApprovals.length; i++) {
                        approvedApprovalsCounter = i+1
                    }

                    let newEntry = {
                        _id: element._id,
                        users: element.name,
                        expenditure: expenditure,
                        allApprovals: allApprovalsCounter,
                        approvedApprovals: approvedApprovalsCounter
                    }

                    result.push(newEntry)
                }
            });
            
            return result;
        }
    }

    render() {
        return (
            <div className='stats-page'>
                { this.props.currentUser.userRole != 'admin' ?
                    <p>Du hast nicht die benötigten Rechte um diese Seite aufrufen zu können.</p> :
                    <div className='visible-access'>
                        <div className="stats-search">
                            <input type='text' className="stats-search" value={this.state.search} onChange={this.updateSearch.bind(this)}/>
                        </div>

                        <div className="content-stats">
                            <Table head={this.getTableHeader()} rows={this.getTableContentRows()}/>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('Usermanagement.users');
    Meteor.subscribe('dashboard.approvals');
    return {
        users: Meteor.users.find({}).fetch(),
        approvals: Approvals.find().fetch(),
        currentUser: Meteor.user(),
    };
})(StatsPage);