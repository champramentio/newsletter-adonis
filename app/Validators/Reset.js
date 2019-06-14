"use strict";

class Login {
  //define the rules in here
  get rules() {
    return {
      email: "required|email",
      password: "required|min:6|alphaNumeric",
      password2: "required|same:password"
    };
  }

  //define the custom message in here
  get messages() {
    return {
      "email.required": "email is required",
      "email.email": "email must be in valid format",
      "password.required": "password is required",
      "password.min": "password must be at least 6 characters length",
      "password.alphaNumeric": "password must contains alphabet and number",
      "password2.required": "password confirmation is required",
      "password2.same": "password confirmation must match with password"
    };
  }

  //when validation failed, flash with session and redirect back
  async fails(errorMessages) {
    this.ctx.session.withErrors(errorMessages[0]).flashAll(); //this.ctx is current context so we just use it to call session method
    return this.ctx.response.redirect("back"); //redirect back to the page before
  }
}

module.exports = Login;
