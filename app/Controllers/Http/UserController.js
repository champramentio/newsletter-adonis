"use strict";

const TokenRecoverPassword = use("App/Models/TokenRecoverPassword");
const Moment = use("moment");
const Utility = use("Utility");
const Event = use("Event");
const bcrypt = use("bcryptjs");
const User = use("App/Models/User");

class UserController {
  //displaying the login view
  async getLogin({ view }) {
    return view.render("admin/login");
  }

  //process submitted login form
  async postLogin({ request, response, session, auth }) {
    const formData = request.only(["email", "password", "remember"]);

    try {
      //Adonis method to remember successful login and create new token in tokens table
      await auth.remember(!!formData.remember).attempt(formData.email, formData.password);

      //return message
      session.flash({
        status: "success",
        notification: "You have logged in successfully"
      });
      return response.redirect("/admin/dashboard");
    } catch (error) {
      //return message
      session.flash({
        status: "error",
        notification: "Invalid login credentials. Please try again"
      });
      return response.redirect("back");
    }
  }

  //process logout request (using POST method)
  async postLogout({ auth, session, response }) {
    await auth.logout();

    // return message
    session.flash({
      status: "success",
      notification: "You have logged out successfully"
    });
    response.redirect("/admin/login");
  }

  async getRecoverPassword({ view }) {
    return view.render("admin/recover");
  }

  async postRecoverPassword({ request, response, session }) {
    try {
      //save to database
      const row = new TokenRecoverPassword();
      row.token = Utility.generateRandomString(100);
      row.email = request.user.email;
      row.status = 0;
      row.created_datetime = Moment().format("YYYY-MM-DD HH:mm:ss");
      row.expired_datetime = Moment()
        .add(1, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      await row.save();

      //send email
      Event.fire("recoverPassword", {
        recipient_username: request.user.username,
        recipient_email: request.user.email,
        reset_token: row.token,
        expired_datetime: row.expired_datetime
      });

      //return message
      session.flash({
        status: "success",
        notification: "Reset link has been sent to your email address"
      });

      return response.redirect("/admin/recover_password");
    } catch (error) {
      //return message
      session.flash({
        status: "error",
        notification: "An error has ocurred. Please try again"
      });
      return response.redirect("/admin/recover_password");
    }
  }

  async getResetPassword({ view, request }) {
    const token = request.get("token");
    return view.render("admin/reset", token);
  }

  async postResetPassword({ request, response, session }) {
    //hashing password
    const hash = bcrypt.hashSync(request.password, bcrypt.genSaltSync(10));

    //update new password in database
    await User.query()
      .where("email", request.email)
      .update({ password: hash });

    //update token as used
    await TokenRecoverPassword.query()
      .where("token", request.token)
      .update({ status: 1 });

    //return message
    session.flash({
      status: "success",
      notification: "You have setup new password successfully"
    });
    return response.redirect("/admin/login");
  }
}

module.exports = UserController;
