import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const Approvals = new Mongo.Collection('Dashboard.approvals');

Approvals.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    name: {
        type: String,
    },
    amount: {
        type: Number,
    },
    reason: {
        type: String,
    },
    link: {
        type: String,
    },
    state: {
        type: String,
    },
    ownerId: {
        type: String
    },
    lastEditByAdmin: {
        type: String,
    },
    lastEditByShopping: {
        type: String,
    },
    deleted: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
    }
});

Approvals.publicFields = {
    name: 1,
    amount: 1,
    reason: 1,
    link: 1,
    state: 1,
    ownerId: 1,
    lastEditByAdmin: 1,
    lastEditByShopping: 1,
    deleted: 1,
    createdAt: 1
};