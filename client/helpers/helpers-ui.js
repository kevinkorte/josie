/*
* Capitalize
* Take the passed string and capitalize it. Helpful for when we're pulling
* data out of the database that's stored in lowercase.
* Thanks to Meteorchef for this helper
*/
UI.registerHelper('capitalize', function(string){
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});

/* MAY NOT NEED
* Limit string
* Return the proper string based on the number of lists.
* Credit: Meteorchef
*/
UI.registerHelper('limitString', function(limit){
  return limit > 1 ? limit + " lists" : limit + " lists";
});
