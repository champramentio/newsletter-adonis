"use strict";

const Model = use("Model");

class Newsletter extends Model {
  //define the table name
  static get table() {
    return "newsletter";
  }

  static get createdAtColumn() {
    return false;
  }

  static get updatedAtColumn() {
    return false;
  }

  //related model, just call this with query builder to have JOIN effect similarity
  recipient() {
    return this.hasMany(
      "App/Models/Recipient",
      "recipient_id", //current key
      "id" //destination key
    );
  }

  //related model, just call this with query builder to have JOIN effect similarity
  created_by() {
    return this.hasMany(
      "App/Models/User",
      "created_by_user_id", //current key
      "id" //destination key
    );
  }

  //related model, just call this with query builder to have JOIN effect similarity
  sent_by() {
    return this.hasMany(
      "App/Models/User",
      "sent_by_user_id", //current key
      "id" //destination key
    );
  }
}

module.exports = Newsletter;
