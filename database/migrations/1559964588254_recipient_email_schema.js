"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RecipientEmailSchema extends Schema {
  async up() {
    const exists = await this.hasTable("recipient_email");

    //only if the table doesn't exist yet
    if (!exists) {
      this.createTable("recipient_email", table => {
        table.increments("id"); //auto increment for PRIMARY KEY
        table.string("email", 100); //equals to VARCHAR(100)
        table
          .integer("recipient_id") //define FOREIGN KEY
          .unsigned()
          .references("id")
          .inTable("recipient")
          .onDelete("CASCADE"); //auto delete in here also whenever a row in recipient table is deleted
      });
    }
  }

  //whenever we rollback, this "down" function will be executed
  async down() {
    const exists = await this.hasTable("recipient_email");

    if (exists) {
      this.drop("recipient_email");
    }
  }
}

module.exports = RecipientEmailSchema;
