"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RecipientSchema extends Schema {
  async up() {
    const exists = await this.hasTable("recipient");

    //only if the table doesn't exist yet
    if (!exists) {
      this.createTable("recipient", table => {
        table.increments("id"); //auto increment for PRIMARY KEY
        table.string("label", 255); //equals to VARCHAR(255)
        table.datetime("created_datetime"); //equals to DATETIME
        table.datetime("updated_datetime"); //equals to DATETIME
      });
    }
  }

  //whenever we rollback, this "down" function will be executed
  async down() {
    const exists = await this.hasTable("recipient");

    if (exists) {
      this.drop("recipient");
    }
  }
}

module.exports = RecipientSchema;
