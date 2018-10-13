import { Meteor } from 'meteor/meteor';

import { Approvals } from './approvals.js';

Meteor.publish('dashboard.approvals', function (searchQuery) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized');
    }

    let regex = new RegExp(searchQuery, 'i');

    let q = {
        $or: [
            { 'name': regex },
            { 'amount': regex },
            { 'reason': regex },
            { 'link': regex },
            { 'state': regex },
        ]
    };

    let p = {
        sort: { createdAt: -1 },
    };

    p.limit = 10;
    //p.skip = 1;
    
    return Approvals.find(q, p);
});