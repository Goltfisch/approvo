import { Meteor } from 'meteor/meteor';

Meteor.publish('Usermanagement.users', function(searchQuery, currentPage) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
    }

    let regex = new RegExp(searchQuery, 'i');

    let q = {
        $or: [
            { 'username': regex },
            { 'emails[0].address': regex }
        ]
    };

    let p = {
        sort: { createdAt: -1 },
    };

    Counts.publish(this, 'userManagementUsersCount', Meteor.users.find(q, p));

    p.limit = 25;

    currentPage--;

    if(currentPage > 0) {
        p.skip = currentPage * p.limit;
    }

    return Meteor.users.find(q, p);
});