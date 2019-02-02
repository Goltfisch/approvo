import { Meteor } from 'meteor/meteor';

import { Rules } from './rules.js';

Meteor.publish('rules', function (currentPage) {
    if(!this.userId) {
        throw new Meteor.Error('not authorized', 'You are not authorized!');
    }

    let p = {
        fields: Rules.publicFields,
        sort: { createdAt: -1 },
    };

    Counts.publish(this, 'RuleCount', Rules.find({}, p));

    p.limit = 25;
    
    currentPage--;

    if(currentPage > 0) {
        p.skip = currentPage * p.limit;
    }
    
    return Rules.find({}, p);
});