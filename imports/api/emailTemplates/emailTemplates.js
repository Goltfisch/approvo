import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const EmailTemplates = new Mongo.Collection('Email.Templates');

EmailTemplates.schema = new SimpleSchema( {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    templateName: {
        type: String,
    },
    templateContent: {
        type: String,
    },
    createdAt: {
        type: Date,
    }
});

EmailTemplates.publicFields = {
    templateName: 1,
    templateContent: 1,
    createdAt: 1
};