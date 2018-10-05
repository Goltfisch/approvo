import { Meteor } from 'meteor/meteor';

import { ApprovalStates } from './approvalStates.js';

Meteor.publish('dashboard.approvals.states', function () {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }
    
    return ApprovalStates.find();
});