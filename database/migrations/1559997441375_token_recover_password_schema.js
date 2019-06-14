"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TokenRecoverPasswordSchema extends Schema {
  async up() {
    const exists = await this.hasTable("token_recover_password");

    //only if the table doesn't exist yet
    if (!exists) {
      this.createTable("token_recover_password", table => {
        table.increments("id"); //auto increment for PRIMARY KEY
        table.string("email", 100); //equals to VARCHAR(100)
        table.string("token", 100); //equals to VARCHAR(100)
        table.datetime("expired_datetime"); //equals to DATETIME
        table.datetime("created_datetime"); //equals to DATETIME
        table.datetime("updated_datetime"); //equals to DATETIME
        table
          .specificType("status", "tinyint(1)") //equals to TINYINT(1)
          .unsigned()
          .default(0);
      });
    }
  }

  //whenever we rollback, this "down" function will be executed
  async down() {
    const exists = await this.hasTable("token_recover_password");

    if (exists) {
      this.drop("token_recover_password");
    }
  }
}

module.exports = TokenRecoverPasswordSchema;
