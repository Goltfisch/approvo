import { Meteor } from 'meteor/meteor';

Meteor.publish('Usermanagement.users', function() {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }

   return Meteor.users.find();
});