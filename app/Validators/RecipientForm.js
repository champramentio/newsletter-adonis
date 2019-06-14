"use strict";

class RecipientForm {
  //define the rules in here
  get rules() {
    return {
      label: "required",
      email_list: "required"
    };
  }

  //define the custom message in here
  get messages() {
    return {
      "label.required": "group label is required",
      "email_list.required": "email list is required"
    };
  }

  //when validation failed, flash with session and redirect back
  async fails(errorMessages) {
    this.ctx.session.withErrors(errorMessages[0]).flashAll(); //this.ctx is current context so we just use it to call session method
    return this.ctx.response.redirect("back"); //redirect back to the page before
  }
}

module.exports = RecipientForm;
