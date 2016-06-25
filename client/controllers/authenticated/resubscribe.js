Template.resubscribe.events({
   'submit form': function(e){
     e.preventDefault();

     var selectedPlan    = 'basic',
     addingNewCreditCard = Session.get('addingNewCreditCard'),
     resubscribeButton   = $(".resubscribe").button('loading');

     var updateSubscription = function(plan){
      Meteor.call("stripeUpdateSubscription", plan, function(error, response){
        if (error){
          resubscribeButton.button("reset");
          Bert.alert(error.message, "danger");
        } else {
          resubscribeButton.button("reset");
          Bert.alert("Successfully resubscribed. Welcome back!", "success");
          FlowRouter.go('/account');
        }
      });
    }
    updateSubscription(selectedPlan);
   }
});
