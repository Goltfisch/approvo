import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { render } from 'react-dom';
import { renderRoutes } from '/imports/startup/client/routes.js';

import '/imports/startup/client/accounts-config.js';

Meteor.startup(() => {
    let isAdmin = false;

    Tracker.autorun(() => {
        const user = Meteor.user();

        isAdmin = user && user.userRole == 'admin';

        render(renderRoutes(isAdmin), document.getElementById('render-target'));
    });
});