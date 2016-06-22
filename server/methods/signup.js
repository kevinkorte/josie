var Future = Npm.require('fibers/future');

Meteor.methods({
  createTrialCustomer: function(customer){
    check(customer, {
      name: String,
      emailAddress: String,
      password: String,
      plan: String
    });

    var emailRegex     = new RegExp(customer.emailAddress, "i");
    var lookupCustomer = Meteor.users.findOne({"emails.address": emailRegex});

    if ( !lookupCustomer ) {
      // Our next step will take place in here.
      var newCustomer = new Future();

      Meteor.call('stripeCreateCustomer', customer.emailAddress, function(error, stripeCustomer){
        if (error) {
          console.log(error);
        } else {
          var customerId = stripeCustomer.id,
              plan       = customer.plan;

              Meteor.call('stripeCreateSubscription', customerId, plan, function(error, response){
                if (error) {
                  console.log(error);
                } else {
                  try {
                    var user = Accounts.createUser({
                      email: customer.emailAddress,
                      password: customer.password,
                      name: customer.name
                    })
                    var subscription = {
                      customerId: customerId,
                      subscription: {
                        plan: {
                          name_id: customer.plan,
                          name_retail: response.plan.name,
                          cost: response.plan.amount,
                          currency: response.plan.currency,
                          interval: response.plan.interval
                          },
                          subscription_id: response.id,
                          delinquent: stripeCustomer.delinquent,
                          created: response.created,
                          current_period_end: response.current_period_end,
                          current_period_start: response.current_period_start,
                          status: response.status,
                          trial_end: response.trial_end,
                          trial_start: response.trial_start
                        }
                      }
                    Meteor.users.update(user, {
                      $set: subscription
                    }, function(error, response){
                      if (error){
                        console.log(error);
                      } else {
                        console.log(response);
                        // Once the subscription data has been added, return to our Future.
                        newCustomer.return(user);
                      }
                    });
                  } catch(exception) {
                    newCustomer.return(exception);
                  }
                }
              });
            }
          });
          return newCustomer.wait();
        } else {
          throw new Meteor.Error('customer-exists', 'Sorry, that customer email already exists!');
        }
      }
    });
