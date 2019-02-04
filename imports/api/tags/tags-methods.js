import { Meteor } from 'meteor/meteor';

import { Tags } from './tags.js'

Meteor.methods({
    'Tags.insert' (tag) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }

        tag.createdAt = new Date();

        Tags.schema.validate(tag);

        return Tags.insert(tag);
    },
    'Tags.update' (tag) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }

        return Tags.update(tag._id, { $set: tag });
    },
    'Tags.remove' (tagId) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }
        
        return Tags.remove(tagId);
    }
});