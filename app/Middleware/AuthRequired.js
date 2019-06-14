"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthRequired {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, response, session }, next) {
    //to prevent user clicking BACK button and seeing the cache before
    response.header("Cache-Control", "nocache, no-store, max-age=0, must-revalidate");
    response.header("Pragma", "no-cache");
    response.header("Expires", "Fri, 01 Jan 1990 00:00:00 GMT");

    try {
      //Adonis method to check whether we are logged in or not
      await auth.check();
    } catch (error) {
      session.flash({
        status: "error",
        notification: "Unauthorized access. Please login first"
      });
      response.redirect("/admin/login");
      return null;
    }
    //call next to advance the request
    await next();
  }
}

module.exports = AuthRequired;
