import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'

import { Approvals } from '/imports/api/approvals/approvals.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
const shoppings = Meteor.users.find({ userRole: 'shopping' }).fetch();
const mailFrom = 'noreply@Approvo';

Meteor.methods({
    'MailService.renderEmail.adminCreateMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const user = Meteor.user();

        let mails = [];
        
        for(let i=0; i<admins.length; i++) {
            let text = EmailTemplates.findOne({ templateName: 'adminCreateMail' }).templateContent;
            let email = {};

            text = text.replace('"Admin"', admins[i].name);
            text = text.replace('##', '\n\n');
            text = text.replace('"User"', user.name);
            text = text.replace('Approval.Name', approval.name);
            text = text.replace('##', '\n');

            email.to = admins[i].emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!';
            email.text = text;

            mails.push(email);
        }

        return mails;
    },
    'MailService.renderEmail.shoppingApproveMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const owner = Meteor.users.findOne(approval.ownerId);
        const user = Meteor.user();

        let mails = [];

        for(let i=0; i<shoppings.length; i++) {
            let text = EmailTemplates.findOne({ templateName: 'shoppingApproveMail' }).templateContent;
            let email = {};

            text = text.replace('"Shopping"', shoppings[i].name);
            text = text.replace('##', '\n\n');
            text = text.replace('"Admin"', user.name);
            text = text.replace('Approval.Name', approval.name);
            text = text.replace('"User"', owner.name);
            text = text.replace('##', '\n');

            email.to = shoppings[i].emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Anfrage "' + approval.name + '" freigegeben!';
            email.text = text;

            mails.push(email);
        }

        return mails;
    },
    'MailService.renderEmail.userCreateMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const owner = Meteor.users.findOne(approval.ownerId);
        const user = Meteor.user();

        let text = EmailTemplates.findOne({ templateName: 'userCreateMail' }).templateContent;

        text = text.replace('"User"', owner.name);
        text = text.replace('##', '\n\n');
        text = text.replace('Approval.Name', approval.name);

        if(owner.createMsgState) {
            email.to = user.emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!';
            email.text = text;

            return email;
        }
    },
    'MailService.renderEmail.userApproveMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const owner = Meteor.users.findOne(approval.ownerId);
        const user = Meteor.user();

        let text = EmailTemplates.findOne({ templateName: 'userApproveMail' }).templateContent;

        text = text.replace('"User"', owner.name);
        text = text.replace('##', '\n\n');
        text = text.replace('"Admin"', user.name);
        text = text.replace('Approval.Name', approval.name);

        if(owner.approveMsgState) {
            email.to = user.emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Anfrage "' + approval.name + '" freigegeben!';
            email.text = text;

            return email;
        }
    },
    'MailService.renderEmail.userOrderMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const owner = Meteor.users.findOne(approval.ownerId);
        const user = Meteor.user();

        let text = EmailTemplates.findOne({ templateName: 'userOrderMail' }).templateContent;

        text = text.replace('"User"', owner.name);
        text = text.replace('##', '\n\n');
        text = text.replace('Approval.Name', approval.name);
        text = text.replace('"Shopping"', user.name);

        if(owner.orderMsgState) {
            email.to = user.emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Freigabe "' + approval.name + '" bestellt!';
            email.text = text;

            return email
        }
    },
    'MailService.renderEmail.userCompleteMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const owner = Meteor.users.findOne(approval.ownerId);
        const user = Meteor.user();

        let text = EmailTemplates.findOne({ templateName: 'userCompleteMail' }).templateContent;

        text = text.replace('"User"', owner.name);
        text = text.replace('##', '\n\n');
        text = text.replace('Approval.Name', approval.name);
        text = text.replace('##', '\n');
        text = text.replace('"Shopping"', user.name);

        if(owner.completeMsgState) {
            email.to = user.emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Freigabe "' + approval.name + '" abgeschlossen!';
            email.text = text;

            return email;
        }
    },
    'MailService.renderEmail.userDeclineMail'(approvalId) {
        const approval = Approvals.findOne(approvalId);
        const owner = Meteor.users.findOne(approval.ownerId);
        const user = Meteor.user();

        let text = EmailTemplates.findOne({ templateName: 'userDeclineMail' }).templateContent;

        text = text.replace('"User"', owner.name);
        text = text.replace('##', '\n\n');
        text = text.replace('Approval.Name', approval.name);
        text = text.replace('"Admin"', user.name);

        if(owner.declineMsgState) {
            email.to = user.emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Anfrage "' + approval.name + '" abgelehnt!';
            email.text = text;

            return email;
        }
    },
    'MailService.renderEmail.userRoleMail'(userId, role) {
        const targetUser = Meteor.users.findOne(userId);
        const user = Meteor.user();

        let text = EmailTemplates.findOne({ templateName: 'userRoleMail' }).templateContent;

        text = text.replace('"User"', targetUser.name);
        text = text.replace('##', '\n\n');
        text = text.replace('"Role"', role);
        text = text.replace('"Admin"', user.name);
        text = text.replace('##', '\n');

        if(owner.roleMsgState) {
            email.to = user.emails[0].address;
            email.from = mailFrom;
            email.subject = '[Approvo] Rolle wurde zu "' + role + '" geändert!';
            email.text = text;

            return email;
        }
    },
    'MailService.sendEmail'(email) {
        if(!this.userId) {
            throw new Meteor.Error('not authorized');
        }

        console.log(email);

        let to = email.to;
        let from = email.from;
        let subject = email.subject;
        let text = email.text;

        return Email.send({ to, from, subject, text });
    }
});