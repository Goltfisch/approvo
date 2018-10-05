import { Meteor } from 'meteor/meteor';

import { UserRoles } from './userRoles.js';

Meteor.publish('user.roles', function () {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }

    return UserRoles.find();
});