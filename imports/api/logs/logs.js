import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
export const Logs = new Mongo.Collection('Logs');

Logs.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        required: false
    },
    type: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    user: {
        type: String,
    },
    action: {
        type: String,
    },
    createdAt: {
        type: Date,
    }
});

Logs.publicFields = {
    type: 1,
    date: 1,
    time: 1,
    user: 1,
    action: 1,
    createdAt: 1
};