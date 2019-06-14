"use strict";

const Newsletter = use("App/Models/Newsletter");

class CheckNewsletterExistance {
  async handle({ response, params, request, session }, next) {
    //check existing email
    const found = await Newsletter.query()
      .where("id", params.id)
      .with("recipient", builder => {
        builder.with("recipient_email");
      })
      .fetch();

    //validate existance
    if (!found.rows[0]) {
      session.flash({
        status: "error",
        notification: "Newsletter not found"
      });
      return response.redirect("back");
    }

    //set as request so controller can read it
    request.newsletter = found.rows[0];

    //call next to advance the request
    await next();
  }
}

module.exports = CheckNewsletterExistance;
