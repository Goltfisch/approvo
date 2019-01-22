import { Meteor } from 'meteor/meteor';

import { Tags } from './tags.js'

Meteor.methods({
    'Tags.insert' (tag) {
        tag.createdAt = new Date();

        Tags.schema.validate(tag);

        return Tags.insert(tag);
    },
    'Tags.remove' (tagId) {
        return Tags.remove(tagId);
    }
});