import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
    Router, 
    Route,
    Switch,
    Redirect
} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Layout from '/imports/ui/layout/Layout.js';
import DashboardPageContainer from '/imports/ui/pages/DashboardPageContainer.js';
import SettingsPage from '/imports/ui/pages/SettingsPage.js';
import UserManagementPageContainer from '/imports/ui/pages/UserManagementPageContainer.js';
import LogPageContainer from '/imports/ui/pages/LogPageContainer.js';
import StatisticsPageContainer from '/imports/ui/pages/StatisticsPageContainer.js';

const browserHistory = createBrowserHistory();

const user = Meteor.user();
const isAdmin = user && user.userRole == 'admin';

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Switch>
            <Layout>
                <Route exact path='/' component={DashboardPageContainer} />
                <Route exact path='/approvals/:page' component={DashboardPageContainer} />
                <Route exact path='/settings' component={SettingsPage} />
                <Route exact path='/usermanagement' render={() => { return isAdmin ? <UserManagementPageContainer/> : <Redirect to="/"/>}} />
                <Route exact path='/log' render={() => { return isAdmin ? <LogPageContainer/> : <Redirect to="/"/>}} />
                <Route exact path='/statistics' render={() => { return isAdmin ? <StatisticsPageContainer/> : <Redirect to="/"/>}} />
            </Layout>
        </Switch>
    </Router>
);