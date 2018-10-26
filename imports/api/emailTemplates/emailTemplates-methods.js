import { Meteor } from 'meteor/meteor';

import { EmailTemplates } from './emailTemplates.js'

Meteor.methods({
    'EmailTemplates.insert' (emailTemplate) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        if(!emailTemplate.createdAt) {
            emailTemplate.createdAt = moment(new Date()).format('DD.MM.YYYY');
        }

        return EmailTemplates.insert(emailTemplate);
    },
    'EmailTemplates.update'(emailTemplate) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        
        return EmailTemplates.update(emailTemplate._id, { $set: emailTemplate });
    }
});