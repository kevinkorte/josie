Viewings = new Mongo.Collection('viewings');

Viewings.allow({
   insert: function(userId, doc) {
       return !!userId;
   }
});

ViewingSchema = new SimpleSchema({
    address: {
        type: String,
        label: "Address",
    },
    lat: {
        type: String,
        label: "Latitude",
        autoform: {
            type: "hidden"
        }
    },
    lng: {
        type: String,
        label: "Longitude",
        autoform: {
            type: "hidden"
        }
    },
    author: {
        type: String,
        label: "Author",
        autoValue: function() {
            return this.userId
        },
        autoform: {
            type: "hidden"
        }
    },
    createdAt: {
        type: Date,
        label: "Created At",
        autoValue: function() {
            return new Date()
        },
        autoform: {
            type: "hidden"
        }
    }
});

Viewings.attachSchema( ViewingSchema );
