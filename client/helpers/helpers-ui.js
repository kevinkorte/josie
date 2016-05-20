/*
* Capitalize
* Take the passed string and capitalize it. Helpful for when we're pulling
* data out of the database that's stored in lowercase.
* Thanks to Meteorchef for this helper
*/
UI.registerHelper('capitalize', function(string){
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});

UI.registerHelper('plan', function(){
  var user = Meteor.userId();
      plan = Session.get('currentUserPlan_' + user);

  if ( user ) {
    Meteor.call('checkUserPlan', user, function(error, response){
      if (error) {
        alert(error.reason);
      } else {
        Session.set('currentUserPlan_' + user, response);
      }
    });
  }
  return plan;
});

UI.registerHelper('epochToString', function(timestamp){
  if (timestamp){
    var length = timestamp.toString().length;
    if ( length = 10 ) {
      return moment.unix(timestamp).format("MMMM Do, YYYY");
    } else {
      return moment.unix(timestamp / 1000).format("MMMM Do, YYYY");
    }
  }
});
