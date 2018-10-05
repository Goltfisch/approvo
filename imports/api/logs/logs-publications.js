import { Meteor } from 'meteor/meteor';

import { Logs } from './logs.js';

Meteor.publish('Logs', function () {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }
    
    return Logs.find();
});