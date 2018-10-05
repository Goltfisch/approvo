import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ApprovalStates } from './approvalStates.js'

Meteor.methods({
    'ApprovalStates.insert' (state) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return ApprovalStates.insert(state);
    }
});