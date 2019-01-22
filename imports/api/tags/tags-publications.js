import { Meteor } from 'meteor/meteor';

import { Tags } from './tags.js';

Meteor.publish('tags', function (currentPage) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
    }

    let p = {
        sort: { createdAt: -1 },
    };

    Counts.publish(this, 'TagCount', Tags.find({}, p));

    p.limit = 25;
    
    currentPage--;

    if(currentPage > 0) {
        p.skip = currentPage * p.limit;
    }
    
    return Tags.find({}, p);
});