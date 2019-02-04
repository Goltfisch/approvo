import { Meteor } from 'meteor/meteor';

import { UserRoles } from './userRoles.js'

Meteor.methods({
    'UserRoles.insert' (role) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }

        UserRoles.schema.validate(role);

        return UserRoles.insert(role);
    },
    'UserRoles.update'(role) {
        if (!this.userId || Meteor.user().userRole == 'user') {
            throw new Meteor.Error('not-authorized');
        }
        
        UserRoles.schema.validate(role);
        
        return UserRoles.update(role._id, { $set: role });
    }
});