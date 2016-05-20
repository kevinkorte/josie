Template.Body.onCreated(function() {
  console.log("sub");

  this.autorun(() => {
    this.subscribe('todos.inList');
  });
});
