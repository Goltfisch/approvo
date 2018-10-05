import faker from 'faker';
import { UserRoles } from '/imports/api/user/userRoles/userRoles.js';
import { EmailTemplates } from '/imports/api/emailTemplates/emailTemplates.js';
import { ApprovalStates } from '/imports/api/approvals/approvalStates/approvalStates.js';
import { Approvals } from '/imports/api/approvals/approvals.js';

Meteor.startup(() => {

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
            name: 'Abgeschlossen',
            number: '6',
            value: 'completed',
            createdAt: Date.now()
        }
    ];

    if(ApprovalStates.find().count() < 1) {
        approvalStates.forEach(approvalState => {
            ApprovalStates.insert(approvalState);
        });
    }

    const admincreatemail = 'Hallo "Admin", ##"User" hat gerade eine Anfrage "Approval.Name" erstellt. ##schaue jetzt in Approvo vorbei um die Anfrage zu bearbeiten!';
    const adminordermail = 'Hallo "Admin", ##"Einkauf" hat soeben die Freigabe "Approval.Name" von "User" bestellt.';
    const admincompletemail = 'Hallo, "Admin", ##die Freigabe "Approval.name" von "User" wurde gerade von "Einkauf" entgegen genommen.';
    const adminroleemail = 'Hallo "Admin", ##"Admin" hat soeben die Rolle von "User" auf "Role" geändert.';

    const shoppingapprovemail = 'Hallo "Shopping", ##"Admin" hat soeben die Anfrage "Approval.Name" von "User" freigegeben. Schau jetzt in Approvo vorbei um die freigabe zu bestellen!';

    const usercreatemail = 'Hallo "User", ##deine Anfrage "Approval.Name" wurde soeben erfolgreich erstellt.' ;
    const userapprovemail = 'Hallo "User", ##"Admin" hat soeben deine Anfrage "Approval.Name" freigegeben.' ;
    const userordermail = 'Hallo "User", ##"Shopping" hat soeben deine Freigabe "Approval.Name" bestellt.' ;
    const usercompletemail = 'Hallo "User", ##deine Freigabe "Approval.Name" ist soeben angekommen. ##schaue jetzt bei "Shopping" im Büro nach um es abzuholen!' ;
    const userdeclinemail = 'Hallo "User", ##deine Anfrage "Approval.Name" wurde soeben von "Admin" abgelehnt.' ;
    const userroleemail = 'Hallo "User", ##du hast soeben die Rolle "Role" von "Admin" zugewiesen bekommen. ##Nutze deine neu gewonnenen Rechte nicht aus!';

    const mail = {
        _id: '1',
        adminCreateMsgEmail: admincreatemail,
        adminOrderMsgEmail: adminordermail,
        adminCompleteMsgEmail: admincompletemail,
        adminRoleMsgEmail: adminroleemail,
        shoppingApproveMsgEmail: shoppingapprovemail,
        userCreateMsgEmail: usercreatemail,
        userApproveMsgEmail: userapprovemail,
        userOrderMsgEmail: userordermail,
        userCompleteMsgEmail: usercompletemail,
        userDeclineMsgEmail: userdeclinemail,
        userRoleMsgEmail: userroleemail,
        createdAt: new Date()
    };

    if(EmailTemplates.find().count() < 1) {
        EmailTemplates.insert(mail);

    }
    
    if(Approvals.find().count() < 1) {
        for(let i = 0; i < 100; i++) {
            Approvals.insert({
                name: faker.commerce.productName(),
                amount: faker.finance.amount(),
                reason: faker.lorem.sentence(),
                link: faker.internet.url(),
                state: 'requested',
                owner: this.userId,
                date: moment(new Date()).format('DD.MM.YYYY'),
                deleted: false,
                createdAt: new Date,
            });
        }
    }
});