import { Meteor } from 'meteor/meteor';

import { Rules } from './rules.js'

Meteor.methods({
    'Rules.insert' (rule) {
        rule.createdAt = new Date();

        Rules.schema.validate(rule);

        return Rules.insert(rule);
    },
    'Rules.update' (rule) {
        return Rules.update(rule._id, { $set: rule });
    },
    'Rules.remove' (ruleId) {
        return Rules.remove(ruleId);
    }
});