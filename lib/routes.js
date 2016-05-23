FlowRouter.route('/', {
  name: 'front-page',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'signup' });
  }
});

FlowRouter.route('/lists', {
  name: 'lists',
  action() {
    BlazeLayout.render('frontPageLayout', { main: 'signup-mc' });
    console.log('logged in, do something');
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
