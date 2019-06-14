"use strict";

/** @type {import('@adonisjs/lucid/src/Factory')} */
const User = use("App/Models/User");
const Database = use("Database");

class UserSeeder {
  async run() {
    await Database.raw("SET FOREIGN_KEY_CHECKS = 0;");
    await Database.truncate("users");

    //create first row
    await User.create({
      username: "JohnWick",
      email: "johnwick@mail.com",
      password: "123456"
    });

    //create second row
    await User.create({
      username: "JackReacher",
      email: "jackreacher@mail.com",
      password: "123456"
    });

    await Database.raw("SET FOREIGN_KEY_CHECKS = 1;");
  }
}

module.exports = UserSeeder;
