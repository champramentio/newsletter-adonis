"use strict";

class GuestOnly {
  async handle({ auth, response }, next) {
    try {
      //Adonis method to check whether we are logged in or not
      await auth.check();
    } catch (error) {
      //call next to advance the request
      await next();
      return null;
    }

    return response.json({
      error: "Guest access only"
    });
  }
}

module.exports = GuestOnly;
