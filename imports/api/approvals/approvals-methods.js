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
    'Approvals.update' (approval) {
        const currentUser = Meteor.user();

        if(currentUser.userRole != 'admin' || approval.owner && (currentUser._id != approval.owner)) {
            throw new Meteor.Error('not-allowed', 'You are not allowed');
        } else {
            Approvals.schema.validate(approval);

            Approvals.update(approval._id, { $set: approval });
        }
    },
    'Approvals.approve'(documentId) {
        const approval = Approvals.findOne(documentId);
        const currentUser = Meteor.user();

        Approvals.schema.validate(approval);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed', 'You are not allowed');
        } else {
            if(approval && approval.state && approval.state === 'requested' || approval.state === 'shelved') {
                approval.state = 'approve';

                Approvals.update(documentId, { $set: approval });

                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne(approval.owner);

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
    'Approvals.order'(documentId) {
        const approval = Approvals.findOne(documentId);
        const currentUser = Meteor.user();

        Approvals.schema.validate(approval);

        if(currentUser.userRole == 'user') {
            throw new Meteor.Error('not-allowed');
        }else {
            if(approval && approval.state && approval.state == 'approve') {
                approval.state = 'order';

                Approvals.update(documentId, { $set: approval });

                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne(approval.owner);

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
    'Approvals.complete'(documentId) {
        const approval = Approvals.findOne(documentId);
        const currentUser = Meteor.user();

        Approvals.schema.validate(approval);

        if(currentUser.userRole == 'user') {
            throw new Meteor.Error('not-allowed');
        }else {
            if(approval && approval.state && approval.state == 'order') {

                approval.state = 'complete';

                Approvals.update(documentId, { $set: approval });
                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne(approval.owner);

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
    'Approvals.decline'(documentId) {
        const approval = Approvals.findOne(documentId);
        const currentUser = Meteor.user();

        Approvals.schema.validate(approval);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed', 'You are not allowed!');
        }else {
            if(approval && approval.state && approval.state == 'requested' || approval.state === 'shelved') {
                approval.state = 'decline';

                Approvals.update(documentId, { $set: approval });
                
                const admins = Meteor.users.find({ userRole: 'admin' }).fetch();
                const shoppings = Meteor.users.find({ userRole: 'shopping' });
                const user = Meteor.users.findOne(approval.owner);

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
    },
    'Approvals.shelved'(documentId) {
        const approval = Approvals.findOne(documentId);
        const currentUser = Meteor.user();

        Approvals.schema.validate(approval);

        if(currentUser.userRole != 'admin') {
            throw new Meteor.Error('not-allowed', 'You are not allowed!');
        }else {
            if(approval && approval.state && approval.state == 'requested') {
                approval.state = 'shelved';

                Approvals.update(documentId, { $set: approval });
                
                const user = Meteor.users.findOne(approval.owner);

                emailTo = {
                    approval: approval._id,
                    user: user._id,
                    templateNames: [ 'userShelvedMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
                });

                const newLog = {
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' zurückgestellt.',
                    type: 'info'
                }
        
                Meteor.call('Logs.insert', newLog.action, newLog.type);
            }else {
                throw new Meteor.Error('not-possible');
            }
        }
    }
});