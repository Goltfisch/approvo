import { Meteor } from 'meteor/meteor';

import { Logs } from './logs.js'

Meteor.methods({
    'Logs.insert' (action, type) {

        const log = {
            action: action,
            type: type,
            user: Meteor.user().name + ' ' + Meteor.user().username,
            time: moment(new Date()).format('H:m:s'),
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        }

        return Logs.insert(log);
    }
});