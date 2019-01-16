import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

Meteor.methods({
    "User.insert"(user) {
        const currentUser = Meteor.user();
        const isAdmin =
            currentUser &&
            currentUser.userRole &&
            currentUser.userRole == "admin";

        if (isAdmin) {
            user.notifications = [
                "onCreatedRequest",
                "onApprovedRequest",
                "onPurchasedApproval",
                "onCompletedOrder",
                "onChangedUserRole"
            ];

            const createUser = Accounts.createUser(user);
            const currentUser = Meteor.user();

            const newLog = {
                action:
                    "Admin " +
                    currentUser.name +
                    " hat den Benutzer " +
                    user.name +
                    " angelegt.",
                type: "info"
            };

            Meteor.call("Logs.insert", newLog.action, newLog.type);

            return createUser;
        } else {
            throw new Meteor.Error("not-authorized", "You are not authorized!");
        }
    },
    "User.update"(user) {
        const currentUser = Meteor.user();

        const isAdmin =
            currentUser &&
            currentUser.userRole &&
            currentUser.userRole == "admin";
        const isUserHimself = currentUser && currentUser._id == user._id;

        if (isAdmin || isUserHimself) {
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

                    const admins = Meteor.users
                        .find({ userRole: "admin" })
                        .fetch();

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

                    Meteor.call(
                        "MailService.renderEmail",
                        emailTo,
                        (error, result) => {
                            if (error) {
                                console.log("Fehler: ", error);
                            }
                        }
                    );

                    const newLog = {
                        action:
                            "Admin " +
                            currentUser.name +
                            " hat die Rolle von " +
                            user.name +
                            " in " +
                            user.userRole +
                            " geändert.",
                        type: "info"
                    };

                    Meteor.call("Logs.insert", newLog.action, newLog.type);
                }
            } else {
            }
        } else {
            throw new Meteor.Error("not-authorized");
        }
    },
    "User.delete"(user) {
        const currentUser = Meteor.user();
        const isAdmin =
            currentUser &&
            currentUser.userRole &&
            currentUser.userRole == "admin";

        if (isAdmin) {
            const deleteResult = Meteor.users.remove({ _id: user._id });

            const newLog = {
                action:
                    "Admin " +
                    currentUser.name +
                    " hat den Benutzer " +
                    user.name +
                    " gelöscht.",
                type: "info"
            };

            Meteor.call("Logs.insert", newLog.action, newLog.type);

            return deleteResult;
        } else {
            throw new Meteor.Error("not-authorized", "You are not authorized!");
        }
    },
    "User.updatePassword"(user) {
        const currentUser = Meteor.user();

        const isAdmin =
            currentUser &&
            currentUser.userRole &&
            currentUser.userRole == "admin";

        const isUserHimself = currentUser && currentUser._id == user._id;

        if (isAdmin || isUserHimself) {
            Accounts.setPassword(user._id, user.password);

            const newLog = {
                action:
                    "Admin " +
                    currentUser.name +
                    " hat das Passwort von " +
                    user.name +
                    " geändert.",
                type: "info"
            };

            Meteor.call("Logs.insert", newLog.action, newLog.type);
        } else {
            throw new Meteor.Error("not-authorized");
        }
    },
    "User.updateSettings"(user) {
        const currentUser = Meteor.user();

        const isAdmin =
            currentUser &&
            currentUser.userRole &&
            currentUser.userRole == "admin";

        const isUserHimself = currentUser && currentUser._id == user._id;

        if (isAdmin || isUserHimself) {
            Meteor.users.update(user._id, {
                $set: {
                    ...user
                }
            });
        } else {
            throw new Meteor.Error("not-authorized");
        }
    }
});
