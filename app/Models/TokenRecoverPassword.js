"use strict";

const Model = use("Model");

class TokenRecoverPassword extends Model {
  //define the table name
  static get table() {
    return "token_recover_password";
  }

  static get createdAtColumn() {
    return false;
  }

  static get updatedAtColumn() {
    return false;
  }
}

module.exports = TokenRecoverPassword;
