"use strict";

const Recipient = use("App/Models/Recipient");

class CheckRecipientExistance {
  async handle({ response, params, request, session }, next) {
    //check existing email
    const found = await Recipient.query()
      .where("id", params.id)
      .with("recipient_email", builder => {
        builder.setVisible(["email"]); //same as JOIN 'recipient_email' table and SELECT 'email'
      })
      .fetch();

    //validate existance
    if (!found.rows[0]) {
      session.flash({
        status: "error",
        notification: "Recipient not found"
      });
      return response.redirect("back");
    }

    //set as request so controller can read it
    request.recipient = found.rows[0];

    //call next to advance the request
    await next();
  }
}

module.exports = CheckRecipientExistance;
