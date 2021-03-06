Template.signup.rendered = function(){
  $('#application-signup').validate({
    rules: {
      name: {
        required: true
      },
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      name: {
        required: "Please enter your name."
      },
      emailAddress: {
        required: "Please enter your email address to sign up.",
        email: "Please enter a valid email address."
      },
      password: {
        required: "Please enter a password to sign up.",
        minlength: "Please use at least six characters."
      }
    },
    submitHandler: function(){
      /*
      *
      * NOT GETTING CARD DETAILS AT THIS TIME
      * SIGN CUSTOMER UP ON TRIAL WITHOUT CARD
      *
      */
      // STRIPE.getToken( '#application-signup', {
      //   number: $('[data-stripe="cardNumber"]').val(),
      //   exp_month: $('[data-stripe="expMo"]').val(),
      //   exp_year: $('[data-stripe="expYr"]').val(),
      //   cvc: $('[data-stripe="cvc"]').val()
      // }, function() {
        var customer = {
          name: $('[name="fullName"]').val(),
          emailAddress: $('[name="emailAddress"]').val(),
          password: $('[name="password"]').val(),
          plan: 'basic'
        };

        var submitButton = $('input[type="submit"]').button('loading');
        
        Meteor.call('createTrialCustomer', customer, function(error, response){

          if (error) {
            alert(error.reason);
            submitButton.button('reset');
          } else {
            if ( response.error ) {
              alert(response.message);
              submitButton.button('reset');
            } else {
              Meteor.loginWithPassword(customer.emailAddress, customer.password, function(error){
                if (error) {
                  alert(error.reason);
                  submitButton.button('reset');
                } else {
                  FlowRouter.go('/home');
                  submitButton.button('reset');
                }
              });
            }
          }
        });
      //}); Because we are not getting the token at this time
    }
  });
}
