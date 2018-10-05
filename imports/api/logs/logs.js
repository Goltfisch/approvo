import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const Logs = new Mongo.Collection('Logs');

Logs.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
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
    date: 1,
    time: 1,
    user: 1,
    action: 1,
    createdAt: 1
};