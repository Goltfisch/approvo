import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
export const Approvals = new Mongo.Collection('Dashboard.approvals');

Approvals.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    }
});

Approvals.publicFields = {
    name: 1,
    amount: 1,
    reason: 1,
    link: 1,
    state: 1,
    owner: 1,
    lastEditByAdmin: 1,
    lastEditByShopping: 1,
    createdAt: 1
};