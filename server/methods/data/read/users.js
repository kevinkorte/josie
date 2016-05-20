Meteor.methods({
  checkUserPlan: function(user){
    check(user, String);
    var getUser = Meteor.users.findOne({"_id": user}, {fields: {"subscription": 1}}),
    subscription = getUser.subscription;

    if(subscription){
      var planData = {
        subscription: subscription
      }
      return planData;
    } else {
      return false;
    }
  }//ends check user plan
})
