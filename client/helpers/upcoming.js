Template.upcoming.onRendered(function() {
  this.autorun(function () {
    if (GoogleMaps.loaded()) {
      $("input[name='address']").geocomplete({ details: "#insertViewing" });
    }
  });
});

/*
/ Template Helper for upcoming events
/ Returns a reactive cursor of all user's upcoming events
*/
Template.upcoming.helpers({
    upcomings: ()=> {
        return Viewings.find({});
    }
});
