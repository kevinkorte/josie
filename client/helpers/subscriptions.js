Template.body.onCreated(function() {
  this.autorun(() => {
    this.subscribe('todos.inList');
  });
});

Template.upcoming.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe('viewings.user');
    });
});

Template.singleViewing.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var id = FlowRouter.getParam('id');
        self.subscribe('viewings.single', id);
    });
});

Template.singleViewingEdit.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var id = FlowRouter.getParam('id');
        self.subscribe('viewings.single', id);
        self.subscribe('this.user');
    });
});
