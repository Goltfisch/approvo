import { Meteor } from 'meteor/meteor';

import { EmailTemplates } from './emailTemplates.js'

Meteor.methods({
    'EmailTemplates.insert' (emailTemplate) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return EmailTemplates.insert(emailTemplate);
    },
    'EmailTemplates.update'(emailTemplate) {
        return EmailTemplates.update(emailTemplate._id, { $set: emailTemplate });
    },
    'EmailTemplates.sendEmail'(email) {

        const to = email.to;
        const from = email.from;
        const subject = email.subject;
        const text = email.text;

        return Email.send({ to, from, subject, text });
    },
    'EmailTemplates.renderEmail'(template, data) {
        let text = '';

        let emailTemplates = EmailTemplates.find().fetch();
        
        emailTemplates = emailTemplates[0];

        text = emailTemplates[template];

        switch(template) {
            case 'userCreateMsgEmail':
                text = text.replace('"User"', data.ownerName);
                text = text.replace('##', '\n\n');
                text = text.replace('Approval.Name', data.approvalName);

                break;
            case 'adminCreateMsgEmail':
                text = text.replace('"Admin"', data.adminName);
                text = text.replace('##', '\n\n');
                text = text.replace('"User"', data.ownerName);
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('##', '\n');

                break;
            case 'userApproveMsgEmail':
                text = text.replace('"User"', data.ownerName);
                text = text.replace('##', '\n\n');
                text = text.replace('"Admin"', data.adminName);
                text = text.replace('Approval.Name', data.approvalName);

                break;

            case 'shoppingApproveMsgEmail':
                text = text.replace('"Shopping"', data.shoppingName);
                text = text.replace('##', '\n\n');
                text = text.replace('"Admin"', data.adminName);
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('"User"', data.ownerName);
                text = text.replace('##', '\n');
                
                break;

            case 'userOrderMsgEmail':
                text = text.replace('"User"', data.ownerName);
                text = text.replace('##', '\n\n');
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('"Shopping"', data.shoppingName);

                break;

            case 'adminOrderMsgEmail':
                text = text.replace('"Admin"', data.adminName);
                text = text.replace('##', '\n\n');
                text = text.replace('"Einkauf"', data.shoppingName);
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('"User"', data.ownerName);

                break;

            case 'userCompleteMsgEmail':
                text = text.replace('"User"', data.ownerName);
                text = text.replace('##', '\n\n');
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('##', '\n');
                text = text.replace('"Shopping"', data.shoppingName);

                break;

            case 'adminCompleteMsgEmail':
                text = text.replace('"Admin"', data.adminName);
                text = text.replace('##', '\n\n');
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('"User"', data.ownerName);
                text = text.replace('"Einkauf"', data.shoppingName);

                break;

            case 'userDeclineMsgEmail':
                text = text.replace('"User"', data.ownerName);
                text = text.replace('##', '\n\n');
                text = text.replace('Approval.Name', data.approvalName);
                text = text.replace('"Admin"', data.adminName);

                break;

            case 'userRoleMsgEmail':
                text = text.replace('"User"', data.targetUserName);
                text = text.replace('##', '\n\n');
                text = text.replace('"Role"', data.roleName);
                text = text.replace('"Admin"', data.adminName);
                text = text.replace('##', '\n');

                break;
            case 'adminRoleMsgEmail':
                    text = text.replace('"Admin"', data.adminName);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"User"', data.targetUserName);
                    text = text.replace('"Role"', data.roleName);

                break;
        }

        return text;
    }
});