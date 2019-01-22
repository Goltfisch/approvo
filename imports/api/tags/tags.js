import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
export const Tags = new Mongo.Collection('Tags');

Tags.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        required: false
    },
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
    }
});

Tags.publicFields = {
    name: 1,
    createdAt: 1
};