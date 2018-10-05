import { Meteor } from 'meteor/meteor';

import { Logs } from './logs.js'

Meteor.methods({
    'Logs.insert' (log) {
        return Logs.insert(log);
    }
});