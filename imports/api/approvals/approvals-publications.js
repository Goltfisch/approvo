import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Approvals } from './approvals.js';

Meteor.publish('dashboard.approvals', function (searchQuery, currentPage) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
    }
    const currentUser = Meteor.user();

    if(currentUser.userRole != 'user') {
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

    q.owner = currentUser._id;

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

Meteor.publish('dashboard.approval', function (approvalId) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
    }
    
    return Approvals.find({ _id: approvalId });
});

Meteor.publish('statistics.approvals', function() {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');     
    }

    return Approvals.find({ }, { sort: { createdAt: -1 }});
});