import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    'User.insert'(user) {
        const createUser = Accounts.createUser(user);
        const currentUser = Meteor.user();

        const newLog = {
            date: moment(new Date()).format('DD.MM.YYYY'),
            time: moment(new Date()).format('H:m:s'),
            user: currentUser.name,
            action: 'Admin ' + currentUser.name + ' hat den Benutzer ' + user.name + ' angelegt.',
            createdAt: new Date()
        }

        Meteor.call('Logs.insert', newLog);

        return createUser;
    },
    'User.update'(user) {
        const currentUser = Meteor.user();

        if(currentUser && currentUser.userRole && currentUser.userRole == 'admin') {
            Meteor.users.update(user._id, {
                $set: {
                    username: user.username,
                    name: user.name,
                    active: user.active,
                    userRole: user.userRole,
                    createMsgState: user.createMsgState,
                    approveMsgState: user.approveMsgState,
                    orderMsgState: user.orderMsgState,
                    completeMsgState: user.completeMsgState,
                    declineMsgState: user.declineMsgState,
                    roleMsgState: user.roleMsgState,
                    lastEditBy: user.lastEditBy
                }
            });

            if(user.oldRole) {
                if(user.oldRole != user.userRole){
                    delete user.oldRole;
                    
                    const admins = Meteor.users.find({ userRole: 'admin' }).fetch();

                    let adminIds = [];

                    if(admins) {
                        admins.forEach(element => {
                            adminIds.push(element._id);
                        });
                    }

                    emailTo = {
                        targetUser: user._id,
                        userRole: user.userRole,
                        admins: adminIds,
                        templateNames: [ 'userRoleMail' ]
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
                        action: 'Admin ' + currentUser.name + ' hat die Rolle von ' + user.name + ' in ' + user.userRole + ' geändert.',
                        createdAt: new Date()
                    }
            
                    Meteor.call('Logs.insert', newLog);
                }
            }else {

            }
        }else {
            throw new Meteor.Error('not-authorized');
        }
    },
    'User.delete'(user) {
        const deleteResult = Meteor.users.remove({ _id: user._id });

        const currentUser = Meteor.user();

        const newLog = {
            date: moment(new Date()).format('DD.MM.YYYY'),
            time: moment(new Date()).format('H:m:s'),
            user: currentUser.name,
            action: 'Admin ' + currentUser.name + ' hat den Benutzer ' + user.name + ' gelöscht.',
            createdAt: new Date()
        }

        Meteor.call('Logs.insert', newLog);

        return deleteResult;
    },
    'User.updatePassword'(user) {
        Accounts.setPassword(user._id, user.password);

        const currentUser = Meteor.user();

        const newLog = {
            date: moment(new Date()).format('DD.MM.YYYY'),
            time: moment(new Date()).format('H:m:s'),
            user: currentUser.name,
            action: 'Admin ' + currentUser.name + ' hat das Passwort von ' + user.name + ' geändert.',
            createdAt: new Date()
        }

        Meteor.call('Logs.insert', newLog);
    }
});