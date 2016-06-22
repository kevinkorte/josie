var secret = Meteor.settings.private.stripe.testSecretKey;
var Stripe = StripeAPI(secret);
var Future = Npm.require('fibers/future');
var Fiber = Npm.require('fibers');

Meteor.methods({

  stripeCreateCustomer: function(email){
    check(email, String);

    var stripeCustomer = new Future();

    Stripe.customers.create({

      email: email
    }, function(error, customer){
      if (error){
        stripeCustomer.return(error);
      } else {
        stripeCustomer.return(customer);
      }
    });

    return stripeCustomer.wait();
  },

  stripeCreateSubscription: function(customer, plan){
    check(customer, String);
    check(plan, String);

    var stripeSubscription = new Future();

    Stripe.customers.createSubscription(customer,{
      plan: plan
    }, function(error, subscription){
      if (error) {
        stripeSubscription.return(error);
      } else {
        stripeSubscription.return(subscription);
      }
    });

    return stripeSubscription.wait();
  },

  stripeSwapCard: function(token){
    check(token, String);

    var stripeSwapCard = new Future();

    var user = Meteor.userId();
    var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

    Stripe.customers.update(getUser.customerId, {
      source: token
    }, function(error, customer){
      if(error) {
        stripeSwapCard.return(error);
      } else {
        var card = {
          lastFour: customer.sources.data[0].last4,
          type: customer.sources.data[0].brand
        }
        Fiber(function() {
          var update = {
            auth: SERVER_AUTH_TOKEN,
            user: user,
            card: card
          }
          Meteor.call('updateUserCard', update, function(error, response){
            if(error){
              stripeSwapCard.return(error);
            } else {
              stripeSwapCard.return(response);
            }
          });
        }).run();
      }
    })//ends Stripe.customers.update
  }
})
