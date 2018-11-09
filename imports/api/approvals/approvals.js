import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
export const Approvals = new Mongo.Collection('Dashboard.approvals');

Approvals.schema = new SimpleSchema( {
    name: {
        type: String,
        required: true
    },
    amount: {
        type: String,
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
        required: true
    },
    state: {
        type: String,
        required: true
    },
    owner: {
        type: String
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
    owner: 1,
    lastEditByAdmin: 1,
    lastEditByShopping: 1,
    createdAt: 1
};