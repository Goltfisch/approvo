import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
 
export const UserRoles = new Mongo.Collection('User.roles');

UserRoles.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        required: false
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
        required: false
    }
});

UserRoles.publicFields = {
    name: 1,
    value: 1,
    number: 1,
    createdAt: 1
};