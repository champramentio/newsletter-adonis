"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NewsletterSchema extends Schema {
  async up() {
    const exists = await this.hasTable("newsletter");

    //only if the table doesn't exist yet
    if (!exists) {
      this.createTable("newsletter", table => {
        table.increments("id"); //auto increment for PRIMARY KEY
        table.string("subject", 255); //equals to VARCHAR(255)
        table.text("content"); //equals to TEXT
        table.string("sender_email", 100); //equals to VARCHAR(100)
        table.string("sender_name", 100); //equals to VARCHAR(100)
        table
          .integer("recipient_id") //define FOREIGN KEY
          .unsigned()
          .references("id")
          .inTable("recipient");
        table.datetime("created_datetime"); //equals to DATETIME
        table.datetime("updated_datetime"); //equals to DATETIME
        table
          .integer("created_by_user_id") //define FOREIGN KEY
          .unsigned()
          .references("id")
          .inTable("users");
        table.datetime("sent_datetime"); //equals to DATETIME
        table
          .integer("sent_by_user_id") //define FOREIGN KEY
          .unsigned()
          .references("id")
          .inTable("users");
      });
    }
  }

  //whenever we rollback, this "down" function will be executed
  async down() {
    const exists = await this.hasTable("newsletter");

    if (exists) {
      this.drop("newsletter");
    }
  }
}

module.exports = NewsletterSchema;
