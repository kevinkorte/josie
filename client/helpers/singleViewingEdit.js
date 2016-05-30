Template.singleViewingEdit.helpers({
    viewing: ()=> {
        var id = FlowRouter.getParam('id');
        return Viewings.findOne({_id: id});
    }
});

Template.singleViewingEdit.helpers({
  exampleMapOptions: function(id) {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      var id = FlowRouter.getParam('id');
      var Lat;
      var Lng;
      Lat = Viewings.findOne({_id: id}).lat;
      Lng = Viewings.findOne({_id: id}).lng;
      return {
        center: new google.maps.LatLng(Lat, Lng),
        zoom: 17
      };
    }
  }
});

Template.singleViewingEdit.onRendered(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});
