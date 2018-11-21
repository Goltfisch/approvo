import { Meteor } from 'meteor/meteor';

import { Approvals } from './approvals.js'

Meteor.methods({
    'Approvals.insert' (approval, emails) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You are not authorized!');
        }

        approval.state = 'requested';
        approval.createdAt = new Date();
        approval.owner = this.userId;

        Approvals.schema.validate(approval);

        const currentUser = Meteor.user();
        const approvalInsert = Approvals.insert(approval);
        const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
        const shoppings = Meteor.users.find({ userRole: 'shopping' });

        let adminIds = [];
        let shoppingIds = [];

        if(admins) {
            admins.forEach(element => {
                adminIds.push(element._id);
            });
        }

        if(shoppings) {
            shoppings.forEach(element => {
                shoppingIds.push(element._id);
            });
        }

        emailTo = {
            approval: approvalInsert,
            admins: adminIds,
            shoppings: shoppingIds,
            user: currentUser._id,
            templateNames: [ 'userCreateMail', 'adminCreateMail']
        }

        Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
            if(error) {
                console.log('Fehler: ', error);
            }
        });

        const newLog = {
            action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' erstellt.',
            type: 'info'
        }

        Meteor.call('Logs.insert', newLog.action, newLog.type);

        return approvalInsert;
    },
    'Approvals.approve'(documentId, emails) {
        
        const currentUser = Meteor.user();
        approval = Approvals.findOne(documentId);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed', 'You are not allowed');
        } else {
            if(approval && approval.state && approval.state === 'requested') {
                approval.lastEditByAdmin = currentUser.name;
                approval.state = 'approve';

                Approvals.update(documentId, { $set: approval });

                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne({ name: approval.owner });

                let adminIds = [];
                let shoppingIds = [];

                if(admins) {
                    admins.forEach(element => {
                        adminIds.push(element._id);
                    });
                }

                if(shoppings) {
                    shoppings.forEach(element => {
                        shoppingIds.push(element._id);
                    });
                }

                emailTo = {
                    approval: approval._id,
                    admins: adminIds,
                    shoppings: shoppingIds,
                    user: user._id,
                    templateNames: [ 'userApproveMail', 'shoppingApproveMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
                });

                const newLog = {
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' freigegeben.',
                    type: 'info'
                }
        
                Meteor.call('Logs.insert', newLog.action, newLog.type);

            }else {
                throw new Meteor.Error('not-possible', 'This action is not possible!');
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

                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne({ name: approval.owner });

                let adminIds = [];
                let shoppingIds = [];

                if(admins) {
                    admins.forEach(element => {
                        adminIds.push(element._id);
                    });
                }

                if(shoppings) {
                    shoppings.forEach(element => {
                        shoppingIds.push(element._id);
                    });
                }

                emailTo = {
                    approval: approval._id,
                    admins: adminIds,
                    shoppings: shoppingIds,
                    user: user._id,
                    templateNames: [ 'userOrderMail', 'adminOrderMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
                });

                const newLog = {
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Freigabe ' + approval.name + ' bestellt.',
                    type: 'info'
                }
        
                Meteor.call('Logs.insert', newLog.action, newLog.type);
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
                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne({ name: approval.owner });

                let adminIds = [];
                let shoppingIds = [];

                if(admins) {
                    admins.forEach(element => {
                        adminIds.push(element._id);
                    });
                }

                if(shoppings) {
                    shoppings.forEach(element => {
                        shoppingIds.push(element._id);
                    });
                }

                emailTo = {
                    approval: approval._id,
                    admins: adminIds,
                    shoppings: shoppingIds,
                    user: user._id,
                    templateNames: [ 'userCompleteMail', 'adminCompleteMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
                });

                const newLog = {
                    action: 'Freigabe ' + approval.name + ' ist angekommen.',
                    type: 'info'
                }
        
                Meteor.call('Logs.insert', newLog.action, newLog.type);
            }
        }
    },
    'Approvals.decline'(documentId, emails) {

        const currentUser = Meteor.user();
        approval = Approvals.findOne(documentId);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed', 'You are not allowed!');
        }else {
            if(approval && approval.state && approval.state == 'requested') {
                approval.lastEditByAdmin = currentUser.name;
                approval.state = 'decline';

                Approvals.update(documentId, { $set: approval });
                
                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne({ name: approval.owner });

                let adminIds = [];
                let shoppingIds = [];

                if(admins) {
                    admins.forEach(element => {
                        adminIds.push(element._id);
                    });
                }

                if(shoppings) {
                    shoppings.forEach(element => {
                        shoppingIds.push(element._id);
                    });
                }

                emailTo = {
                    approval: approval._id,
                    admins: adminIds,
                    shoppings: shoppingIds,
                    user: user._id,
                    templateNames: [ 'userDeclineMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
                });

                const newLog = {
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' abgelehnt.',
                    type: 'info'
                }
        
                Meteor.call('Logs.insert', newLog.action, newLog.type);
            }else {
                throw new Meteor.Error('not-possible');
            }
        }
    }
});