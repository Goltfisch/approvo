import { Meteor } from 'meteor/meteor';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

Meteor.methods({
    'MailService.renderEmail'(data) {

        let email = {
            to: '',
            from: 'noreply@Approvo',
            subject: '[Approvo] ',
            text: ''
        }

        const user = Meteor.user();
        const approval = Approvals.findOne(data.approval);
        const lastEditAdmin = Meteor.users.findOne({ name: approval.lastEditByAdmin });
        const lastEditShopping = Meteor.users.findOne({ name: approval.lastEditByShopping });

        let templates = [];
        let admins = [];
        let shoppings = [];

        data.admins.forEach(element => {
            admins.push(Meteor.users.findOne(element));
        });

        data.templateNames.forEach(element => {
            templates.push(EmailTemplates.findOne({ templateName: element }));
        });

        data.shoppings.forEach(element => {
            shoppings.push(Meteor.users.findOne(element));
        });

        templates.forEach(element => {
            switch(element.templateName) {
                case 'adminCreateMail' :
                    for(let i=0; i<admins.length; i++) {
                        text = element.templateContent;

                        text = text.replace('"Admin"', admins[i].name);
                        text = text.replace('##', '\n\n');
                        text = text.replace('"User"', user.name);
                        text = text.replace('Approval.Name', approval.name);
                        text = text.replace('##', '\n');

                        email.to = admins[i].emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!'
                        email.text = text;

                        text = '';

                        Meteor.call('MailService.sendEmail', email);
                    }

                    break;
                case 'adminOrderMail' :
                    text = element.templateContent;

                    text = text.replace('"Admin"', lastEditAdmin.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"Einkauf"', lastEditShopping.name);
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"User"', user.name);

                    email.to = lastEditAdmin.emails[0].address;
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" bestellt!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);
                    break;
                case 'adminCompleteMail' :
                    text = element.templateContent;

                    text = text.replace('"Admin"', lastEditAdmin.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"Approval.Name"', approval.name);
                    text = text.replace('"User"', user.name);
                    text = text.replace('"Einkauf"', lastEditShopping.name);

                    email.to = lastEditAdmin.emails[0].address;
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" abgeschlossen!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);
                    break;
                case 'shoppingApproveMail' :
                    for(let i=0; i<shoppings.length; i++) {
                        text = element.templateContent;

                        text = text.replace('"Shopping"', shoppings[i].name);
                        text = text.replace('##', '\n\n');
                        text = text.replace('"Admin"', lastEditAdmin.name);
                        text = text.replace('Approval.Name', approval.name);
                        text = text.replace('"User"', user.name);
                        text = text.replace('##', '\n');

                        email.to = shoppings[i].emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" freigegeben!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }

                    break;
                case 'userCreateMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);

                    email.to = user.emails[0].address;
                    email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);
                    
                    break;
                case 'userApproveMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"Admin"', lastEditAdmin.name);
                    text = text.replace('Approval.Name', approval.name);

                    email.to = user.emails[0].address;
                    email.subject = '[Approvo] Anfrage "' + approval.name + '" freigegeben!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);

                    break;
                case 'userOrderMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"Shopping"', lastEditShopping.name);

                    email.to = user.emails[0].address;
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" bestellt!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);

                    break;
                case 'userCompleteMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('##', '\n');
                    text = text.replace('"Shopping"', lastEditShopping.name);

                    email.to = user.emails[0].address;
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" abgeschlossen!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);

                    break;
                case 'userDeclineMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"Admin"', lastEditAdmin.name);

                    email.to = user.emails[0].address;
                    email.subject = '[Approvo] Anfrage "' + approval.name + '" abgelehnt!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);

                    break;
                case 'adminRoleMail' :
                    console.log('adminRoleMail');
                    break;
                case 'userRoleMail' :
                    console.log('userRoleMail');
                    break;
            }
        });

        //     case 'userRoleMsgEmail':
        //         text = text.replace('"User"', data.targetUserName);
        //         text = text.replace('##', '\n\n');
        //         text = text.replace('"Role"', data.roleName);
        //         text = text.replace('"Admin"', data.adminName);
        //         text = text.replace('##', '\n');

        //         break;
        //     case 'adminRoleMsgEmail':
        //             text = text.replace('"Admin"', data.adminName);
        //             text = text.replace('##', '\n\n');
        //             text = text.replace('"User"', data.targetUserName);
        //             text = text.replace('"Role"', data.roleName);

        //         break;
        // }
    },
    'MailService.sendEmail'(email) {

        const to = email.to;
        const from = email.from;
        const subject = email.subject;
        const text = email.text;

        return Email.send({ to, from, subject, text });
    }
});