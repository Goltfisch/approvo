import { Meteor } from 'meteor/meteor';

import { UserRoles } from './userRoles.js'

Meteor.methods({
    'UserRoles.insert' (role) {
        return UserRoles.insert(role);
    },
    'UserRoles.update'(role) {
        return UserRoles.update(role._id, { $set: role });
    }
});