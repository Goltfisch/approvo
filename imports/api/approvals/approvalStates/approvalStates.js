import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
export const ApprovalStates = new Mongo.Collection('Dashboard.approvals.states');

ApprovalStates.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        required: false
    },
    name: {
        type: String,
    },
    number: {
        type: Number,
    },
    value: {
        type: String,
    },
    createdAt: {
        type: Date,
    }
});

ApprovalStates.publicFields = {
    name: 1,
    number: 1,
    value: 1,
    createdAt: 1
};