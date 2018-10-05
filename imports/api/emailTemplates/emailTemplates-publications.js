import { Meteor } from 'meteor/meteor';

import { EmailTemplates } from './emailTemplates.js';

Meteor.publish('EmailTemplates', function () {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }
    
    return EmailTemplates.find();
});