import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

Meteor.methods({
    "User.insert"(user) {
        if (!this.userId || Meteor.user().userRole != 'admin') {
            throw new Meteor.Error('not-authorized');
        }

        const currentUser = Meteor.user();

        user.notifications = [
            "onCreatedRequest",
            "onApprovedRequest",
            "onPurchasedApproval",
            'onDeclinedRequest',
            'onShelvedRequest',
            "onCompletedOrder",
            "onChangedUserRole"
        ];

        const createUser = Accounts.createUser(user);

        const newLog = {
            action: "Admin " + currentUser.name + " hat den Benutzer " + user.name + " angelegt.",
            type: "info"
        };

        Meteor.call("Logs.insert", newLog.action, newLog.type);

        return createUser;
    },
    "User.update"(user) {
        if (!this.userId || Meteor.user().userRole != 'admin' || this.userId != user._id) {
            throw new Meteor.Error('not-authorized');
        }

        const currentUser = Meteor.user();

        Meteor.users.update(user._id, {
            $set: {
                username: user.username,
                name: user.name,
                //active: user.active,
                userRole: user.userRole
            }
        });

        if (user.oldRole) {
            if (user.oldRole != user.userRole) {
                delete user.oldRole;

                const admins = Meteor.users.find({ userRole: "admin" }).fetch();
                let adminIds = [];

                if (admins) {
                    admins.forEach(element => {
                        adminIds.push(element._id);
                    });
                }

                emailTo = {
                    targetUser: user._id,
                    userRole: user.userRole,
                    admins: adminIds,
                    user: user._id,
                    templateNames: ["userRoleMail"]
                };

                Meteor.call("MailService.renderEmail", emailTo, (error, result) => {
                    if (error) {
                        console.log("Fehler: ", error);
                    }
                });

                const newLog = {
                    action: "Admin " + currentUser.name + " hat die Rolle von " + user.name + " in " + user.userRole + " geändert.",
                    type: "info"
                };

                Meteor.call("Logs.insert", newLog.action, newLog.type);
            }
        }
    },
    "User.delete"(user) {
        if (!this.userId || Meteor.user().userRole != 'admin') {
            throw new Meteor.Error('not-authorized');
        }

        const currentUser = Meteor.user();
        const deleteResult = Meteor.users.remove({ _id: user._id });

        const newLog = {
            action: "Admin " + currentUser.name + " hat den Benutzer " + user.name + " gelöscht.",
            type: "info"
        };

        Meteor.call("Logs.insert", newLog.action, newLog.type);

        return deleteResult;
    },
    "User.updatePassword"(user) {
        if (!this.userId || Meteor.user().userRole != 'admin' || this.userId != user._id) {
            throw new Meteor.Error('not-authorized');
        }

        const currentUser = Meteor.user();

        Accounts.setPassword(user._id, user.password);

        const newLog = {
            action: "Admin " + currentUser.name + " hat das Passwort von " + user.name + " geändert.",
            type: "info"
        };

        Meteor.call("Logs.insert", newLog.action, newLog.type);
    },
    "User.updateSettings"(user) {
        if (!this.userId || Meteor.user().userRole != 'admin' || this.userId != user._id) {
            throw new Meteor.Error('not-authorized');
        }

        Meteor.users.update(user._id, {
            $set: {
                ...user
            }
        });
    }
});
