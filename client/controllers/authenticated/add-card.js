Template.addCard.events({
  'submit form': function( e ){
    e.preventDefault();

    var currentUser = Meteor.userId();
    var updateCardButton = $(".update-card").button('loading');

    STRIPE.getToken('#add-card', {
      number: $('[data-stripe="cardNumber"]').val(),
      exp_month: $('[data-stripe="expMo"]').val(),
      exp_year: $('[data-stripe="expYr"]').val(),
      cvc: $('[data-stripe="cvc"]').val()
    }, function() {
      var token = $("#add-card [name='stripeToken']").val();

      Meteor.call('stripeSwapCard', token, function(error, response) {
        if(error){
          Bert.alert(error.reason.message, 'danger');
          updateCardButton.button('reset');
        } else {
            if(response != undefined) {
              //Better erorr handling Here
              //Review Stripe API for instuction how to do that
              Bert.alert("There was an error processing your card. Try again later, please.", "danger");
              updateCardButton.button('reset');
          // if(response.rawType !== undefined && response.rawType == "card_error") {
          //   Bert.alert(response.message, 'danger');
          //   updateCardButton.button('reset');
          } else {
            updateCardButton.button('reset');
            Session.set('currentUserPlan_'+currentUser, null);
            Session.set('addingNewCreditCard', false);
            Bert.alert('New card successfully added!', 'success');
          }
        }
      })//ends Meteor.call('stripeSwapCard')
    });// ends STRIPE.getToken
  }//ends submit function
});
