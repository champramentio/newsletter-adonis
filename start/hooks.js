const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
  const View = use("View");
  const Moment = use("moment");

  //method to format datetime as relative
  View.global("getRelativeDate", function(dateData) {
    return dateData ? Moment(dateData, "YYYY-MM-DD HH:mm:ss").fromNow() : "";
  });
});
