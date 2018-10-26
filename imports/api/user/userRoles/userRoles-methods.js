import { Meteor } from 'meteor/meteor';

import { UserRoles } from './userRoles.js'

Meteor.methods({
    'UserRoles.insert' (role) {
        if(!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        return UserRoles.insert(role);
    },
    'UserRoles.update'(role) {
        if(!this.userId) {
            throw new Meteor.Error('not authorized');
        }
        
        return UserRoles.update(role._id, { $set: role });
    }
});