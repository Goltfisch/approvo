import { Meteor } from 'meteor/meteor';

import { Approvals } from './approvals.js'

Meteor.methods({
    'Approvals.insert' (approval, emails) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You are not authorized!');
        }

        approval.state = 'requested';
        approval.deleted = false;
        approval.createdAt = new Date();
        approval.owner = Meteor.user().name;

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
            templateNames: [ 'userCreateMail', 'adminCreateMail']
        }

        Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
            if(error) {
                console.log('Fehler: ', error);
            }
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
                    templateNames: [ 'userApproveMail', 'shoppingApproveMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
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
                    templateNames: [ 'userOrderMail', 'adminOrderMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
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
                    approval: approval._id,
                    admins: adminIds,
                    shoppings: shoppingIds,
                    templateNames: [ 'userCompleteMail', 'adminCompleteMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
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
            throw new Meteor.Error('not-allowed', 'You are not allowed!');
        }else {
            if(approval && approval.state && approval.state == 'requested') {
                approval.lastEditByAdmin = currentUser.name;
                approval.state = 'decline';

                Approvals.update(documentId, { $set: approval });
                
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
                    approval: approval._id,
                    admins: adminIds,
                    shoppings: shoppingIds,
                    templateNames: [ 'userDeclineMail']
                }

                Meteor.call('MailService.renderEmail', emailTo, (error, result) => {
                    if(error) {
                        console.log('Fehler: ', error);
                    }
                });

                const newLog = {
                    date: moment(new Date()).format('DD.MM.YYYY'),
                    time: moment(new Date()).format('H:m:s'),
                    user: currentUser.name,
                    action: currentUser.userRole + ' ' + currentUser.name + ' hat die Anfrage ' + approval.name + ' abgelehnt.',
                    createdAt: new Date()
                }
        
                Meteor.call('Logs.insert', newLog);
            }else {
                throw new Meteor.Error('not-possible');
            }
        }
    }
});