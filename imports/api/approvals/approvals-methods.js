import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import { Approvals } from './approvals.js'

Meteor.methods({
    'Approvals.insert' (approval, emails) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        approval.state = 'requested';
        approval.deleted = false;

        const currentUser = Meteor.user();

        const approvalInsert = Approvals.insert(approval);

        emails.forEach(element => {
            let email = {};
            let data = {};

            email.from = 'noreply@approvo.com';
            email.subject = '[Approvo] Anfrage "' + approval.name + '" erstellt!';

            if(typeof element.to == 'object' && element.to.groupKey) {
                let groupKeyUser = Meteor.users.findOne({ userRole: element.to.groupKey });
                email.to = groupKeyUser.emails[0].address;
                data.groupKeyName = groupKeyUser.username;
            }else {
                email.to = element.to
            }

            var admin = Meteor.users.findOne({ userRole: 'admin' });

            data.ownerName = currentUser.name;
            data.approvalName = approval.name;
            data.adminName = admin.name;

            email.text = Meteor.call('EmailTemplates.renderEmail', element.template, data);

            Meteor.call('EmailTemplates.sendEmail', email);
        });

        const newLog = {
            date: moment(new Date()).format('DD.MM.YYYY'),
            time: moment(new Date()).format('H:m:s'),
            user: currentUser.name,
            action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' erstellt.',
            createdAt: new Date()
        }

        Meteor.call('Logs.insert', newLog);

        return approvalInsert;
    },
    'Approvals.update'(approval) {
        const currentUser = Meteor.user();

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed');
        }else {
            return Approvals.update(approval._id, { $set: approval });
        }
    },
    'Approvals.approve'(documentId, emails) {
        
        const currentUser = Meteor.user();
        approval = Approvals.findOne(documentId);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed');
        }else {
            if(approval && approval.state && approval.state === 'requested') {
                approval.lastEditByAdmin = currentUser.name;

                approval.state = 'approve';

                Approvals.update(documentId, { $set: approval });

                emails.forEach(element => {
                    let email = {};
                    let data = {};

                    email.from = 'noreply@approvo.com';
                    email.subject = '[Approvo] Anfrage "'+ approval.name +'" freigegeben!';

                    if(typeof element.to === 'object' && element.to.groupKey) {
                        let groupKeyUser = Meteor.users.findOne({ userRole: element.to.groupKey });
                        email.to = groupKeyUser.emails[0].address;
                        data.groupKeyName = groupKeyUser.username;
                    }else{
                        email.to = element.to;
                    }

                    roleUser = Meteor.users.findOne({ userRole: element.to.groupKey })

                    data.ownerName = approval.owner;
                    data.shoppingName = roleUser.name;
                    data.adminName = approval.lastEditByAdmin;
                    data.approvalName = approval.name;

                    email.text = Meteor.call('EmailTemplates.renderEmail', element.template, data);

                    Meteor.call('EmailTemplates.sendEmail', email);
                });

                const newLog = {
                    date: moment(new Date()).format('DD.MM.YYYY'),
                    time: moment(new Date()).format('H:m:s'),
                    user: currentUser.name,
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' freigegeben.',
                    createdAt: new Date()
                }
        
                Meteor.call('Logs.insert', newLog);

            }else {
                throw new Meteor.Error('not-allowed');
            }
        }
    },
    'Approvals.order'(documentId, emails) {
        const currentUser = Meteor.user();
        approval = Approvals.findOne(documentId);

        if(currentUser.userRole == 'user') {
            throw new Meteor.Error('not-allowed');
        }else {
            if(approval && approval.state && approval.state == 'approve') {
                if(currentUser.userRole == 'admin') {
                    approval.lastEditByAdmin = currentUser.name;
                }else if(currentUser.userRole == 'shopping') {
                    approval.lastEditByShopping = currentUser.name;
                }

                approval.state = 'order';

                Approvals.update(documentId, { $set: approval });
                emails.forEach(element => {
                    let email = {};
                    let data = {};

                    email.from = 'noreply@approvo.com';
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" bestellt!';

                    if(typeof element.to == 'object' && element.to.groupKey) {
                        let groupKeyUser = Meteor.users.findOne({ userRole: element.to.groupKey });
                        email.to = groupKeyUser.emails[0].address;
                        data.groupKeyName = groupKeyUser.username;
                    }else {
                        email.to = element.to
                    }

                    roleUser = Meteor.users.findOne({ userRole: element.to.groupKey })

                    data.ownerName = approval.owner;
                    data.adminName = roleUser.name;
                    data.approvalName = approval.name;

                    if(approval.lastEditByShopping) {
                        data.shoppingName = approval.lastEditByShopping;
                    }else {
                        data.shoppingName = approval.lastEditByAdmin;
                    }

                    email.text = Meteor.call('EmailTemplates.renderEmail', element.template, data);

                    Meteor.call('EmailTemplates.sendEmail', email);
                });

                const newLog = {
                    date: moment(new Date()).format('DD.MM.YYYY'),
                    time: moment(new Date()).format('H:m:s'),
                    user: currentUser.name,
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Freigabe ' + approval.name + ' bestellt.',
                    createdAt: new Date()
                }
        
                Meteor.call('Logs.insert', newLog);
            }
        }
    },
    'Approvals.complete'(documentId, emails) {
        const currentUser = Meteor.user();
        approval = Approvals.findOne(documentId);

        if(currentUser.userRole == 'user') {
            throw new Meteor.Error('not-allowed');
        }else {
            if(approval && approval.state && approval.state == 'order') {
                if(currentUser.userRole == 'admin') {
                    approval.lastEditByAdmin = currentUser.name;
                }else if(currentUser.userRole == 'shopping') {
                    approval.lastEditByShopping = currentUser.name;
                }

                approval.state = 'complete';

                Approvals.update(documentId, { $set: approval });
                emails.forEach(element => {
                    let email = {};
                    let data = {};

                    email.from = 'noreply@approvo.com';
                    email.subject = '[Approvo] Freigabe "' + approval.name + '" angekommen!';

                    if(typeof element.to == 'object' && element.to.groupKey) {
                        let groupKeyUser = Meteor.users.findOne({ userRole: element.to.groupKey });
                        email.to = groupKeyUser.emails[0].address;
                        data.groupKeyName = groupKeyUser.username;
                    }else {
                        email.to = element.to
                    }

                    data.ownerName = approval.owner;
                    data.adminName = approval.lastEditByAdmin;
                    data.approvalName = approval.name;

                    if(approval.lastEditByShopping) {
                        data.shoppingName = approval.lastEditByShopping;
                    }else {
                        data.shoppingName = approval.lastEditByAdmin;
                    }

                    email.text = Meteor.call('EmailTemplates.renderEmail', element.template, data);

                    Meteor.call('EmailTemplates.sendEmail', email);
                });

                const newLog = {
                    date: moment(new Date()).format('DD.MM.YYYY'),
                    time: moment(new Date()).format('H:m:s'),
                    user: currentUser.name,
                    action: 'Freigabe ' + approval.name + ' ist angekommen.',
                    createdAt: new Date()
                }
        
                Meteor.call('Logs.insert', newLog);
            }
        }
    },
    'Approvals.decline'(documentId, emails) {
        const currentUser = Meteor.user();
        approval = Approvals.findOne(documentId);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed');
        }else {
            if(approval && approval.state && approval.state == 'requested') {
                approval.lastEditByAdmin = currentUser.name;

                approval.state = 'decline';

                Approvals.update(documentId, { $set: approval });
                emails.forEach(element => {
                    let email = {};
                    let data = {};

                    email.from = 'noreply@approvo.com';
                    email.subject = '[Approvo] Anfrage "' + approval.name + '" abgelehnt!';

                    if(typeof element.to == 'object' && element.to.groupKey) {
                        let groupKeyUser = Meteor.users.findOne({ userRole: element.to.groupKey });
                        email.to = groupKeyUser.emails[0].address;
                        data.groupKeyName = groupKeyUser.username;
                    }else {
                        email.to = element.to
                    }

                    data.ownerName = approval.owner;
                    data.adminName = approval.lastEditByAdmin;
                    data.approvalName = approval.name;

                    email.text = Meteor.call('EmailTemplates.renderEmail', element.template, data);

                    Meteor.call('EmailTemplates.sendEmail', email);
                
                    const newLog = {
                        date: moment(new Date()).format('DD.MM.YYYY'),
                        time: moment(new Date()).format('H:m:s'),
                        user: currentUser.name,
                        action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' abgelehnt.',
                        createdAt: new Date()
                    }
            
                    Meteor.call('Logs.insert', newLog);
                });
            }else {
                throw new Meteor.Error('not-possible');
            }
        }
    }
});