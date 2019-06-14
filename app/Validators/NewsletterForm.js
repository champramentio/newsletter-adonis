"use strict";

class NewsletterForm {
  //define the rules in here
  get rules() {
    return {
      subject: "required",
      content: "required",
      sender_email: "required|email",
      sender_name: "required",
      recipient_id: "required"
    };
  }

  //define the custom message in here
  get messages() {
    return {
      "subject.required": "subject is required",
      "content.required": "content is required",
      "sender_email.required": "sender email is required",
      "sender_email.email": "sender email must be in valid format",
      "sender_name.required": "sender name is required",
      "recipient_id.required": "recipient group is required"
    };
  }

  //when validation failed, flash with session and redirect back
  async fails(errorMessages) {
    this.ctx.session.withErrors(errorMessages[0]).flashAll(); //this.ctx is current context so we just use it to call session method
    return this.ctx.response.redirect("back"); //redirect back to the page before
  }
}

module.exports = NewsletterForm;
