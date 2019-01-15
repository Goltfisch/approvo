import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
    const customizedUser = Object.assign({
    userRole: options.userRole,
    name: options.name,
    notifications: [
      'onCreatedRequest', 
      'onApprovedRequest',
      'onPurchasedApproval',
      'onDeclinedRequest',
      'onCompletedOrder',
      'onChangedUserRole'
  ]
  }, user);

  if (options.profile) {
    customizedUser.profile = options.profile;
  }

  return customizedUser;
});

Accounts.config({
  forbidClientAccountCreation : true
})