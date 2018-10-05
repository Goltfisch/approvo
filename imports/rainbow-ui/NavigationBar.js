import React, { Component } from 'react';
import AccountsUIWrapper from '/imports/rainbow-ui/AccountsUIWrapper.js';
import { NavLink } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { Logs } from '/imports/api/logs/logs.js';

import './css/navigation-bar.css';

export class NavigationBar extends Component {
    constructor() {
        super();
        this.state = {
            search: '',
            approvalResults: '',
            logsResults: '',
            userResults: ''
        };
    }
    
    updateGlobalSearch(event) {
        event.preventDefault()
        this.setState({search: event.target.value})
        if(event.target.value) {
            var approvals = Approvals.find().fetch();
            var logs = Logs.find().fetch();
            var users = Meteor.users.find().fetch();

            approvals = approvals.filter(
                (approval) => {
                    return approval.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || approval.owner.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                        approval.state.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || approval.reason.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                        approval.amount.indexOf(this.state.search) !== -1 || approval.link.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
                }
            );

            logs = logs.filter(
                (log) => {
                    return log.date.indexOf(this.state.search) !== -1 || log.time.indexOf(this.state.search) !== -1 ||
                        log.action.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1; //log.user.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                }
            );

            users = users.filter(
                (user) => {
                    return user.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || user.username.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                        user.emails[0].address.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || user.lastEditBy.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 ||
                        user.userRole.toLowerCase().indexOf(this.state.search.toLowerCase());
                }
            );

            var results = [];

            approvals.push.apply(results, approvals);
            logs.push.apply(results, logs);
            users.push.apply(results, users);

            this.setState({approvalResults: approvals})
            this.setState({logsResults: logs})
            this.setState({userResults: users})
        }else {
            return;
        }
    }

    renderApprovalResults() {
        return this.state.approvalResults.map((approvalResult) => {
            return <li key={approvalResult._id}>{approvalResult.name}</li>
        })
    }

    renderLogResults() {
        return this.state.logsResults.map((logsResult) => {
            return <li key={logsResult._id}>{logsResult.action}</li>
        })
    }

    renderUserResults() {
        return this.state.userResults.map((userResult) => {
            return <li key={userResult._id}>{userResult.name}</li>
        })
    }

    renderListItems() {
        return this.props.listItems.map((listItem) => (
            <li key={listItem.id}>
                <NavLink to={listItem.to} exact activeClassName="active">{listItem.name}</NavLink>
            </li>
        ));
    }

    render() {
        return (
            <nav className='navigation-bar'>
                <div className='logo'>
                    <a href='/'><img src={this.props.logo} alt="Logo"/> </a>
                </div>
                <div className='navigation-list'>
                    <ul>
                        {this.renderListItems()}
                    </ul>
                </div>
                {/* <div className="global-search">
                    <input type='text' value={this.state.search} onChange={this.updateGlobalSearch.bind(this)} className="global-search-input" />
                    <div className='global-search-results'>
                        { this.state.search ?
                            <ul>
                                <p>Approvals</p>
                                {this.renderApprovalResults()}
                                <li></li>
                                <p>Logs</p>
                                {this.renderLogResults()}
                                <li></li>
                                <p>User</p>
                                {this.renderUserResults()}
                            </ul>
                            :
                            <div>
                            </div>
                        }
                    </div>
                </div> */}
                <div className='navigation-login'>
                    <AccountsUIWrapper />
                </div>
            </nav>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe("Usermanagement.users");
    Meteor.subscribe("Dashboard.approvals");
    Meteor.subscribe("Logs");

    return {
        currentUser: Meteor.user(),
    }
})(NavigationBar);