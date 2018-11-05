import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Approvals } from './approvals.js';

Meteor.publish('dashboard.approvals', function (searchQuery, currentPage) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
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
        sort: { date: -1 },
    };

    Counts.publish(this, 'dashboardApprovalsCount', Approvals.find(q, p));

    p.limit = 25;
    
    currentPage--;

    if(currentPage > 0) {
        p.skip = currentPage * p.limit;
    }
    
    return Approvals.find(q, p);
});

Meteor.publish('statistics.approvals', function() {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');     
    }

    return Approvals.find({ }, { sort: { createdAt: -1 }});
});