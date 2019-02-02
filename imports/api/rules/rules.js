import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';
import { Tags } from '/imports/api/tags/tags.js';
 
export const Rules = new Mongo.Collection('Rules');

Rules.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        required: false
    },
    tagId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    roleId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    budget: {
        type: Number,
    },
    createdAt: {
        type: Date,
    }
});

Rules.publicFields = {
    tagId: 1,
    roleId: 1,
    budget: 1,
    createdAt: 1
};

Rules.helpers( {
    roleLabel() {
        const role = UserRoles.findOne({ _id: this.roleId });

        if(role && role.name) {
            return role.name;
        }
    },
    tagLabel() {
        const tag = Tags.findOne({ _id: this.tagId });

        if(tag && tag.name) {
            return tag.name;
        }
    }
});