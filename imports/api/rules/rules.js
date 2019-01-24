import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
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