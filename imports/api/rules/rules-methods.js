import { Meteor } from 'meteor/meteor';

import { Rules } from './rules.js'

Meteor.methods({
    'Rules.insert' (rule) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }

        rule.createdAt = new Date();

        Rules.schema.validate(rule);

        return Rules.insert(rule);
    },
    'Rules.update' (rule) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }

        return Rules.update(rule._id, { $set: rule });
    },
    'Rules.remove' (ruleId) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }
        
        return Rules.remove(ruleId);
    }
});