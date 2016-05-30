Meteor.publish('subscriptions', function(){
  // Publish only the lists for the current user. We can make use of this.userId
  // in our publication to get the user's ID. If we find lists for the user,
  // publish them to the client.
  var user     = this.userId,
      getLists = Meteor.users.find().fetch()

  if (getLists){
    return getLists;
  }
});

Meteor.publish('viewings.user', function() {
    return [
        Viewings.find({})
    ];
});

Meteor.publish('viewings.single', function(id) {
    check(id, String);
    return Viewings.find({_id: id});
});
