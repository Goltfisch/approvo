import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const UserRoles = new Mongo.Collection('User.roles');

UserRoles.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    name: {
        type: String,
    },
    value: {
        type: String,
    },
    number: {
        type: String,
    },
    createdAt: {
        type: Date,
    }
});

UserRoles.publicFields = {
    name: 1,
    value: 1,
    number: 1,
    createdAt: 1
};