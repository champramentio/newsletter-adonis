"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

//non-login
Route.group("non-login", function() {
  //login
  Route.get("login", "UserController.getLogin");
  Route.post("login", "UserController.postLogin").validator("Login");

  //recover password
  Route.get("recover_password", "UserController.getRecoverPassword");
  Route.post("recover_password", "UserController.postRecoverPassword")
    .validator("Recover")
    .middleware("checkEmailExistance");

  //reset password
  Route.get("reset_password", "UserController.getResetPassword");
  Route.post("reset_password", "UserController.postResetPassword")
    .validator("Reset")
    .middleware("validateToken");
})
  .prefix("admin")
  .middleware(["guestOnly"]);

//admin area
Route.group("login-group", function() {
  //dashboard
  Route.get("dashboard", "DashboardController.index");

  //recipient
  Route.get("recipient", "RecipientController.getIndex");
  Route.get("recipient/:id/info", "RecipientController.getInfo").middleware("checkRecipientExistance");
  Route.get("recipient/add", "RecipientController.getAdd");
  Route.post("recipient/add", "RecipientController.postAdd").validator("RecipientForm");
  Route.get("recipient/:id/edit", "RecipientController.getEdit").middleware("checkRecipientExistance");
  Route.put("recipient/:id/edit", "RecipientController.putEdit")
    .validator("RecipientForm")
    .middleware("checkRecipientExistance");
  Route.delete("recipient/:id/delete", "RecipientController.deleteRecipient").middleware("checkRecipientExistance");

  //newsletter
  Route.get("newsletter", "NewsletterController.getIndex");
  Route.get("newsletter/:id/info", "NewsletterController.getInfo").middleware("checkNewsletterExistance");
  Route.get("newsletter/add", "NewsletterController.getAdd");
  Route.post("newsletter/add", "NewsletterController.postAdd").validator("NewsletterForm");
  Route.get("newsletter/:id/send", "NewsletterController.getSend").middleware("checkNewsletterExistance");
  Route.delete("newsletter/:id/delete", "NewsletterController.deleteNewsletter").middleware("checkNewsletterExistance");

  //logout
  Route.post("logout", "UserController.postLogout");
})
  .prefix("admin")
  .middleware(["authRequired"]);
