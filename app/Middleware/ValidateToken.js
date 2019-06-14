"use strict";

const TokenRecoverPassword = use("App/Models/TokenRecoverPassword");
const Moment = use("moment");

class ValidateToken {
  async handle({ response, request, session }, next) {
    const formData = request.only(["token", "email", "password", "password2"]);

    //validate email, token, status and expired datetime
    const exist = await TokenRecoverPassword.query()
      .where("email", formData.email)
      .where("token", formData.token)
      .where("status", 0)
      .where("expired_datetime", ">", Moment().format("YYYY-MM-DD HH:mm:ss"))
      .getCount();

    //if validation of token failed
    if (exist === 0) {
      //return message
      session.flash({
        status: "error",
        notification: "Invalid or expired token"
      });
      return response.redirect("back");
    }

    //set as request so controller can read it
    request.email = formData.email;
    request.token = formData.token;
    request.password = formData.password;

    //call next to advance the request
    await next();
  }
}

module.exports = ValidateToken;
