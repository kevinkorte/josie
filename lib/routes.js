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
