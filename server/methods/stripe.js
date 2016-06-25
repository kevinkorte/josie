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
  },

  stripeCancelSubscription: function(){
    // Because Stripe's API is asynchronous (meaning it doesn't block our function
    // from running once it's started), we need to make use of the Fibers/Future
    // library. This allows us to create a return object that "waits" for us to
    // return a value to it.
    var stripeCancelSubscription = new Future();

    // Before we jump into everything, we need to get our customer's ID. Recall
    // that we can't send this over from the client because we're *not* publishing
    // it to the client. Instead, here, we take the current userId from Meteor
    // and lookup our customerId.
    var user    = Meteor.userId();
    var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

    // Once we have our customerId, call to Stripe to cancel the active subscription.
    Stripe.customers.cancelSubscription(getUser.customerId, {
      at_period_end: true
    }, function(error, response){
      if (error) {
        stripeCancelSubscription.return(error);
      } else {
        // Because we're running Meteor code inside of another function's callback, we need to wrap
        // it in a Fiber. Note: this is a verbose way of doing this. You could refactor this
        // and the call to Stripe to use a Meteor.wrapAsync method instead. The difference is
        // that while wrapAsync is cleaner syntax-wise, it can be a bit confusing. To keep
        // things simple, we'll stick with a Fiber here.
        Fiber(function(){
          var update = {
            auth: SERVER_AUTH_TOKEN,
            user: user,
            subscription: {
              status: response.cancel_at_period_end ? "canceled" : response.status,
              ends: response.current_period_end
            }
          };
          Meteor.call('updateUserSubscription', update, function(error, response){
            if (error){
              stripeCancelSubscription.return(error);
            } else {
              stripeCancelSubscription.return(response);
            }
          });
        }).run();
      }
    });

    return stripeCancelSubscription.wait();
  },

  stripeUpdateSubscription: function(plan){
    // Check our arguments against their expected patterns. This is especially
    // important here because we're dealing with sensitive customer information.
    check(plan, String);

    // Because Stripe's API is asynchronous (meaning it doesn't block our function
    // from running once it's started), we need to make use of the Fibers/Future
    // library. This allows us to create a return object that "waits" for us to
    // return a value to it. Yes, we could use Meteor.wrapAsync to simplify our code
    // a bit, but I've choosen to demonstrate this here so we can better see *how*
    // the function is responding. Put down that pitchfork.
    var stripeUpdateSubscription = new Future();

    // Before we jump into everything, we need to get our customer's ID. Recall
    // that we can't send this over from the client because we're *not* publishing
    // it to the client. Instead, here, we take the current userId from Meteor
    // and lookup our customerId.
    var user    = Meteor.userId();
    var getUser = Meteor.users.findOne({"_id": user}, {fields: {"customerId": 1}});

    // If all is well, call to the Stripe API to update our subscription! Note:
    // here we have to pass *both* the ID of the customer and the ID of their
    // subscription in order for this to work.
    Stripe.customers.updateSubscription(getUser.customerId, {
      plan: plan
    }, function(error, subscription){
      if (error) {
        stripeUpdateSubscription.return(error);
      } else {
        // Here, we know that updating our user's subscription will *only* be used
        // to manage plan's, so, we run our user update method here to keep things simple.
        // First we create our update object (don't forget SERVER_AUTH_TOKEN)...
        // Note: we're using a Fiber() here because we're calling to Meteor code from
        // within another function's callback (without this Meteor will throw an error).
        Fiber(function(){
          var update = {
            auth: SERVER_AUTH_TOKEN,
            user: user,
            plan: plan,
            status: subscription.status,
            date: subscription.current_period_end
          };
          // And then we pass our update over to our updateUserPlan method.
          Meteor.call('updateUserPlan', update, function(error, response){
            if (error){
              stripeUpdateSubscription.return(error);
            } else {
              stripeUpdateSubscription.return(response);
            }
          });
        }).run();
      }
    });

    return stripeUpdateSubscription.wait();
  }
});
