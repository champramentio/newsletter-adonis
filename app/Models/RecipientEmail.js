"use strict";

const Model = use("Model");

class RecipientEmail extends Model {
  //define the table name
  static get table() {
    return "recipient_email";
  }

  static get createdAtColumn() {
    return false;
  }

  static get updatedAtColumn() {
    return false;
  }
}

module.exports = RecipientEmail;
