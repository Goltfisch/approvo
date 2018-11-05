import { Meteor } from 'meteor/meteor';

import { Logs } from './logs.js';

Meteor.publish('logs', function (searchQuery, currentPage) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
    }

    let regex = new RegExp(searchQuery, 'i');

    let q = {
        $or: [
            { 'date': regex },
            { 'time': regex },
            { 'user': regex }
        ]
    };

    let p = {
        sort: { date: 1 },
    };

    Counts.publish(this, 'logsCount', Logs.find(q, p));

    p.limit = 25;
    
    currentPage--;

    if(currentPage > 0) {
        p.skip = currentPage * p.limit;
    }
    
    return Logs.find(q, p);
});