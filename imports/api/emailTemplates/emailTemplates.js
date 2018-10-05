import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const EmailTemplates = new Mongo.Collection('EmailTemplates');

EmailTemplates.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    adminCreateMsgEmail: {
        type: String,
    },
    adminOrderMsgEmail: {
        type: String,
    },
    adminCompleteMsgEmail: {
        type: String,
    },
    shoppingApproveMsgEmail: {
        type: String,
    },
    userCreateMsgEmail: {
        type: String,
    },
    userApproveMsgEmail: {
        type: String,
    },
    userOrderMsgEmail: {
        type: String,
    },
    userCompleteMsgEmail: {
        type: String,
    },
    userDeclineMsgEmail: {
        type: String,
    },
    createdAt: {
        type: Date,
    }
});

EmailTemplates.publicFields = {
    adminCreateMsgEmail: 1,
    adminOrderMsgEmail: 1,
    adminCompleteMsgEmail: 1,
    shoppingApproveMsgEmail: 1,
    userCreateMsgEmail: 1,
    userApproveMsgEmail: 1,
    userOrderMsgEmail: 1,
    userCompleteMsgEmail: 1,
    userDeclineMsgEmail: 1,
    createdAt: 1
};