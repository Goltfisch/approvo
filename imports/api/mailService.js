import { Meteor } from 'meteor/meteor';

import { Approvals } from '/imports/api/approvals/approvals.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';

Meteor.methods({
    'MailService.renderEmail'(data) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let email = {
            to: '',
            from: 'noreply@approvo.de',
            subject: '[Approvo] ',
            text: ''
        }

        const targetUser = Meteor.users.findOne(data.targetUser);

        let approval = Approvals.findOne(data.approval);
        
        const user = Meteor.users.findOne(data.user);
        const notifications = user.notifications;
        const currentUser = Meteor.user();
        
        let templates = [];
        let admins = [];
        let shoppings = [];

        if(data.admins) {
            data.admins.forEach(element => {
                admins.push(Meteor.users.findOne(element));
            });
        }

        if(data.shoppings) {
            data.shoppings.forEach(element => {
                shoppings.push(Meteor.users.findOne(element));
            });
        }

        data.templateNames.forEach(element => {
            templates.push(EmailTemplates.findOne({ templateName: element }));
        });

        templates.forEach(element => {
            let accepted = false;
            switch(element.templateName) {
                case 'adminCreateMail' :
                    for(let i=0; i<admins.length; i++) {
                        text = element.templateContent;

                        text = text.replace('"Admin"', admins[i].name);
                        text = text.replace('##', '\n\n');
                        text = text.replace('"User"', user.name);
                        text = text.replace('Approval.Name', approval.name);
                        text = text.replace('##', '\n');
                        text = text.replace('##', '\n\n');

                        email.to = admins[i].emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }

                    break;
                case 'adminOrderMail' :
                    text = element.templateContent;

                    text = text.replace('"Admin"', approval.lastEditByAdmin);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"Einkauf"', approval.lastEditByShopping);
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');

                    email.to = Meteor.users.findOne({ name: approval.lastEditByAdmin }).emails[0].address;
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" bestellt!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);
                    break;
                case 'adminCompleteMail' :
                    text = element.templateContent;

                    text = text.replace('"Admin"', approval.lastEditByAdmin);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"User"', user.name);
                    text = text.replace('"Einkauf"', approval.lastEditByShopping);
                    text = text.replace('##', '\n\n');

                    email.to = Meteor.users.findOne({ name: approval.lastEditByAdmin }).emails[0].address;
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" abgeschlossen!'
                    email.text = text;

                    Meteor.call('MailService.sendEmail', email);
                    break;
                case 'shoppingApproveMail' :
                    for(let i=0; i<shoppings.length; i++) {
                        text = element.templateContent;

                        text = text.replace('"Shopping"', shoppings[i].name);
                        text = text.replace('##', '\n\n');
                        text = text.replace('"Admin"', approval.lastEditByAdmin);
                        text = text.replace('Approval.Name', approval.name);
                        text = text.replace('"User"', user.name);
                        text = text.replace('##', '\n');
                        text = text.replace('##', '\n\n');

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
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onCreatedRequest') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }
                    
                    break;
                case 'userApproveMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"Admin"', currentUser.name);
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onApprovedRequest') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" freigegeben!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }

                    break;
                case 'userOrderMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"Shopping"', currentUser.name);
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onPurchasedApproval') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Freigabe "' + approval.name + '" bestellt!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }

                    break;
                case 'userCompleteMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('##', '\n');
                    text = text.replace('"Shopping"', currentUser.name);
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onCompletedOrder') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Freigabe "' + approval.name + '" abgeschlossen!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }

                    break;
                case 'userDeclineMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"Admin"', currentUser.name);
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onDeclinedRequest') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" abgelehnt!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }

                    break;
                case 'userShelvedMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', user.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('Approval.Name', approval.name);
                    text = text.replace('"Admin"', currentUser.name);
                    text = text.replace('##', '\n');
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onShelvedRequest') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Anfrage "' + approval.name + '" zurückgestellt!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }

                    break;
                case 'userRoleMail' :
                    text = element.templateContent;

                    text = text.replace('"User"', targetUser.name);
                    text = text.replace('##', '\n\n');
                    text = text.replace('"Role"', data.userRole);
                    text = text.replace('"Admin"', currentUser.name);
                    text = text.replace('##', '\n');
                    text = text.replace('##', '\n\n');

                    notifications.forEach(notification => {
                        if(notification == 'onChangedUserRole') {
                            accepted = true;
                        }
                    });

                    if(accepted) {
                        email.to = user.emails[0].address;
                        email.subject = '[Approvo] Rolle wurde zu "' + data.userRole + '" geändert!'
                        email.text = text;

                        Meteor.call('MailService.sendEmail', email);
                    }else {
                        return;
                    }

                    break;
            }
        });
    },
    'MailService.sendEmail'(email) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        const to = email.to;
        const from = email.from;
        const subject = email.subject;
        const text = email.text;

        return Email.send({ to, from, subject, text });
    }
});