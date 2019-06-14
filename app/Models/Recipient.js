"use strict";

const Model = use("Model");

class Recipient extends Model {
  //define the table name
  static get table() {
    return "recipient";
  }

  static get createdAtColumn() {
    return false;
  }

  static get updatedAtColumn() {
    return false;
  }

  //related model, just call this with query builder to have JOIN effect similarity
  recipient_email() {
    return this.hasMany(
      "App/Models/RecipientEmail",
      "id", //current key
      "recipient_id" //destination key
    );
  }
}

module.exports = Recipient;
