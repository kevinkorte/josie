Template.account.events({
  'click .cancel-subscription': function(){
    var confirmCancel = confirm("Are you sure you want to cancel? This means your subscription will no longer be active and your account will be disabled on the cancellation date. If you'd like, you can resubscribe later.");
    if (confirmCancel){
      Meteor.call('stripeCancelSubscription', function(error, response){
        if (error){
          Bert.alert(error.reason, "danger");
        } else {
          if (response.error){
            Bert.alert(response.error.message, "danger");
          } else {
            Session.set('currentUserPlan_' + Meteor.userId(), null);
            Bert.alert("Subscription successfully canceled!", "success");
          }
        }
      });
    }
  }
});
