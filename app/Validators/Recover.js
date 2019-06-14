"use strict";

class Login {
  //define the rules in here
  get rules() {
    return {
      email: "required|email"
    };
  }

  //define the custom message in here
  get messages() {
    return {
      "email.required": "email is required",
      "email.email": "email must be in valid format"
    };
  }

  //when validation failed, flash with session and redirect back
  async fails(errorMessages) {
    this.ctx.session.withErrors(errorMessages[0]).flashAll(); //this.ctx is current context so we just use it to call session method
    return this.ctx.response.redirect("back"); //redirect back to the page before
  }
}

module.exports = Login;
