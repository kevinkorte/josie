var secret = Meteor.settings.private.stripe.testSecretKey;
var Stripe = StripeAPI(secret);

Meteor.methods({

  stripeCreateCustomer: function(token, email){
    check(token, String);
    check(email, String);

    var stripeCustomer = new Future();

    Stripe.customers.create({
      source: token,
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

    Stripe.customers.createSubscription(customer, {
      plan: plan
    }, function(error, subscription){
      if (error) {
        stripeSubscription.return(error);
      } else {
        stripeSubscription.return(subscription);
      }
    });

    return stripeSubscription.wait();
  }
})
