import { Meteor } from 'meteor/meteor';

Meteor.publish('Usermanagement.users', function() {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }

    console.log(Meteor.users.find().fetch());

   return Meteor.users.find();
});