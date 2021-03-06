import faker from 'faker';
import { Accounts } from "meteor/accounts-base";

import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';
import { ApprovalStates } from '/imports/api/approvals/approvalStates/approvalStates.js';
import { Approvals } from '/imports/api/approvals/approvals.js';

Meteor.startup(() => {

    if(Meteor.users.find({ username: 'alexander.wolf' }).count() < 1) {
        let user = {
            name: 'Alexander Wolf',
            username: 'alexander.wolf',
            email: 'alexander.wolf@goltfisch.de',
            password: Meteor.settings.initialAdminUserPassword,
            userRole: 'admin',
            notifications: [
                "onCreatedRequest",
                "onApprovedRequest",
                "onPurchasedApproval",
                "onDeclinedApproval",
                "onShelvedRequest",
                "onCompletedOrder",
                "onChangedUserRole"
            ]
        };

        Accounts.createUser(user);
    }

    const userRoles = [
        {
            name: 'Administrator',
            value: 'admin',
            number: '2',
            createdAt: Date.now()
        },
        {
            name: 'Einkauf',
            value: 'shopping',
            number: '1',
            createdAt: Date.now()
        },
        {
            name: 'Benutzer',
            value: 'user',
            number: '0',
            createdAt: Date.now()
        },
    ];

    if(UserRoles.find().count() < 1) {
        userRoles.forEach(userRole => {
            UserRoles.insert(userRole);
        });
    }

    const approvalStates = [
        {
            name: 'Angefragt',
            number: '1',
            value: 'requested',
            createdAt: Date.now()
        },
        {
            name: 'Freigeben',
            number: '2',
            value: 'approve',
            createdAt: Date.now()
        },
        {
            name: 'Bestellen',
            number: '3',
            value: 'order',
            createdAt: Date.now()
        },
        {
            name: 'Abschließen',
            number: '4',
            value: 'complete',
            createdAt: Date.now()
        },
        {
            name: 'Ablehnen',
            number: '5',
            value: 'decline',
            createdAt: Date.now()
        },
        {
            name: 'Zurückstellen',
            number: '6',
            value: 'shelved',
            createdAt: Date.now()
        }
    ];

    if(ApprovalStates.find().count() < 1) {
        approvalStates.forEach(approvalState => {
            ApprovalStates.insert(approvalState);
        });
    }

    const mails = [
        {
            _id: '1',
            templateName: 'adminCreateMail',
            templateContent: 'Hallo "Admin", ##"User" hat gerade die Anfrage "Approval.Name" erstellt. ##Schaue jetzt in Approvo vorbei um die Anfrage zu bearbeiten!##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '2',
            templateName: 'adminOrderMail',
            templateContent: 'Hallo "Admin", ##"Einkauf" hat soeben die Freigabe "Approval.Name" von "User" bestellt.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '3',
            templateName: 'adminCompleteMail',
            templateContent: 'Hallo "Admin", ##die Freigabe "Approval.Name" von "User" wurde gerade von "Einkauf" entgegen genommen.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '4',
            templateName: 'shoppingApproveMail',
            templateContent: 'Hallo "Shopping", ##"Admin" hat soeben die Anfrage "Approval.Name" von "User" freigegeben. Schau jetzt in Approvo vorbei um die freigabe zu bestellen!##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '5',
            templateName: 'userCreateMail',
            templateContent: 'Hallo "User", ##deine Anfrage "Approval.Name" wurde soeben erfolgreich erstellt.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '6',
            templateName: 'userApproveMail',
            templateContent: 'Hallo "User", ##"Admin" hat soeben deine Anfrage "Approval.Name" freigegeben.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '7',
            templateName: 'userOrderMail',
            templateContent: 'Hallo "User", ##"Shopping" hat soeben deine Freigabe "Approval.Name" bestellt.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '8',
            templateName: 'userCompleteMail',
            templateContent: 'Hallo "User", ##deine Freigabe "Approval.Name" ist soeben angekommen. ##Schaue jetzt bei "Shopping" im Büro nach um es abzuholen!##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '9',
            templateName: 'userDeclineMail',
            templateContent: 'Hallo "User", ##deine Anfrage "Approval.Name" wurde soeben von "Admin" abgelehnt.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '10',
            templateName: 'userShelvedMail',
            templateContent: 'Hallo "User", ##deine Anfrage "Approval.Name" wurde soeben von "Admin" zurückgestellt.##Sie kann also zu einem späteren Zeitpunkt angenommen bzw. abgelehnt werden.##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        },
        {
            _id: '11',
            templateName: 'userRoleMail',
            templateContent: 'Hallo "User", ##du hast soeben die Rolle "Role" von "Admin" zugewiesen bekommen. ##Nutze deine neu gewonnenen Rechte nicht aus!##http://app.approvo.de/',
            createdAt: moment(new Date()).format('DD.MM.YYYY')
        }
    ];

    if(EmailTemplates.find().count() < 1) {
        mails.forEach(element => {
            EmailTemplates.insert(element); 
        });
    }
    
    // if(Approvals.find().count() < 1 && Meteor.isDevelopment()) {
    //     for(let i = 0; i < 100; i++) {
    //         Approvals.insert({
    //             name: faker.commerce.productName(),
    //             amount: faker.finance.amount(),
    //             reason: faker.lorem.sentence(),
    //             link: faker.internet.url(),
    //             state: 'requested',
    //             owner: this.userId,
    //             date: faker.date.past(),
    //             deleted: false,
    //             createdAt: new Date,
    //         });
    //     }
    // }

    if(Approvals.find().count() > 0) {
        let approvals = Approvals.find().fetch();

        approvals.forEach(approval => {
            if(!approval.quantity) {
                approval.quantity = 1;
            }
            if(!approval.price) {
                if(approval.quantity && approval.amount) {
                    approval.price = approval.amount;    
                }
                approval.price = parseFloat(approval.amount) * parseFloat(approval.quantity);
            }

            Meteor.call('Approval.DevUpdate', approval);
        });
    }
});