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

UI.registerHelper('cardExists', function(){
  var user = Meteor.userId();
      subscription = Session.get('currentUserPlan_' + user);
      if ( user && subscription ) {
        if ( typeof subscription.subscription.payment !== 'undefined' ) {
          return true;
        } else {
          return false;
        }
      }
});

/*
* If Equals
* Take the two passed values and compare them, returning true if they're equal
* and false if they're not.
*/

UI.registerHelper('equals', function(c1,c2){
  // If case1 is equal to case2, return true, else false.
  return c1 == c2 ? true : false;
});
