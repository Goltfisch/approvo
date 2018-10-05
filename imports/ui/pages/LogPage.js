import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Logs } from '/imports/api/logs/logs.js';

import Log from '/imports/ui/components/Log.js';

export class LogPage extends Component {
    constructor() {
        super();
        this.state = {
            search: ''          
        };
    }

    updateSearch(event) {
        this.setState({search: event.target.value})
    }
    getLogs() {
        const logs = this.props.logs;
        if(this.props.currentUser) {
            return logs.filter(
                (log) => {
                    return log.date.indexOf(this.state.search) !== -1 || log.time.indexOf(this.state.search) !== -1 ||
                        log.action.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || log.user.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
                }
            );
        }
    }
    
    renderLogs() {
        return this.getLogs().map(((log) => (
            <Log key={log._id} log={log}/>
        )));
    }

    render() {
        return (
            <div className='log-page'>
                { this.props.currentUser.userRole != 'admin' ?
                    <p>Du hast nicht die benötigten Rechte um diese Seite aufrufen zu können.</p> :
                    <div className='visible-access'>
                        <div className='log-page-search'>
                            <label><i className="fas fa-search"></i></label>
                            <input type='text' className="log-search" value={this.state.search} onChange={this.updateSearch.bind(this)}/>
                        </div>

                        <div className="content-log">
                            <table width="100%" border="1px">
                                <tbody>
                                    <tr>
                                        <th>Datum</th>
                                        <th>Uhrzeit</th>
                                        <th>Benutzer</th>
                                        <th>Ereignis</th>
                                    </tr>
                                    {this.renderLogs()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default withTracker(() => {
    Meteor.subscribe('Usermanagement.users');
    Meteor.subscribe('Logs');
    return {
        users: Meteor.users.find({}).fetch(),
        currentUser: Meteor.user(),
        logs: Logs.find({}, {sort: { createdAt: -1}}).fetch()
    };
})(LogPage);