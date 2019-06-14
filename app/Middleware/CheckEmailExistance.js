"use strict";

const User = use("App/Models/User");

class CheckEmailExistance {
  async handle({ response, request, session }, next) {
    //check existing email
    const found = await User.query()
      .where("email", request.input("email"))
      .fetch();

    //if email doesn't exist
    if (!found.rows[0]) {
      session.flash({
        status: "error",
        notification: "Email not found"
      });
      return response.redirect("back");
    }

    //set as request so controller can read it
    request.user = found.rows[0];

    //call next to advance the request
    await next();
  }
}

module.exports = CheckEmailExistance;
