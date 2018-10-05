import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
    const customizedUser = Object.assign({
    userRole: options.userRole,
    name: options.name,
    createMsgState: true,
    approveMsgState: true,
    orderMsgState: true,
    completeMsgState: true,
    declineMsgState: true,
    roleMsgState: true
  }, user);

  if (options.profile) {
    customizedUser.profile = options.profile;
  }

  return customizedUser;
});

Accounts.config({
  //forbidClientAccountCreation : true
})