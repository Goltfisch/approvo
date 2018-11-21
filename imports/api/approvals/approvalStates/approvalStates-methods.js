import { Meteor } from 'meteor/meteor';

import { ApprovalStates } from './approvalStates.js'

Meteor.methods({
    'ApprovalStates.insert' (state) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        ApprovalStates.schema.validate(state);

        return ApprovalStates.insert(state);
    }
});