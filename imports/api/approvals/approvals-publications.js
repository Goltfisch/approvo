import { Meteor } from 'meteor/meteor';

import { Approvals } from './approvals.js';

Meteor.publish('dashboard.approvals', function () {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }
    
    return Approvals.find();
});