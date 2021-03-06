// if(Meteor.isClient) {
//   Accounts.onLogin(function() {
//     FlowRouter.go('home');
//   });
//   Accounts.onLogout(function() {
//     FlowRouter.go('front-page');
//   });
// };

FlowRouter.route('/', {
  name: 'front-page',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'signup' });
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'login' });
  }
});

FlowRouter.route('/signup', {
  name: 'signup',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'signup' });
  }
});

FlowRouter.route('/home', {
  name: 'home',
  action() {
    BlazeLayout.render('dashboardLayout', { main: 'home'});
  }
});

FlowRouter.route('/lists', {
  name: 'lists',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'signup-mc' });
  }
});

FlowRouter.route('/account', {
  name: 'account',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'account' });
  }
});

FlowRouter.route('/account/billing', {
  name: 'billing',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'billing' });
  }
});

FlowRouter.route('/account/add-card', {
  name: 'add-card',
  action() {
    BlazeLayout.render('accountLayout', { main: 'addCard' });
  }
});

FlowRouter.route('/account/resubscribe', {
  name: 'resubscribe',
  action() {
    BlazeLayout.render('accountLayout', { main: 'resubscribe' });
  }
});

FlowRouter.route('/:author/:id', {
    name: 'singleViewing',
    action() {
        BlazeLayout.render('singleLayout', {main: 'singleViewing'})
    }
});

FlowRouter.route('/:author/:id/edit', {
    name: 'singleViewingEdit',
    action() {
        BlazeLayout.render('singleLayout', {main: 'singleViewingEdit'})
    }
});
