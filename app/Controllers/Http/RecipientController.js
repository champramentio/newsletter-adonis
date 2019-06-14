"use strict";

const Recipient = use("App/Models/Recipient");
const RecipientEmail = use("App/Models/RecipientEmail");
const Moment = use("moment");
const _ = use("lodash");
const Utility = use("Utility");

class RecipientController {
  async getIndex({ view }) {
    const recipients = await Recipient.query()
      .with("recipient_email")
      .fetch();

    return view.render("admin/recipient", {
      data: recipients.toJSON()
    });
  }

  async getInfo({ request, view }) {
    return view.render("admin/recipient_info", {
      data: request.recipient.toJSON(),
      email_list: this._convertBackToLines(request.recipient.toJSON().recipient_email, "<br />")
    });
  }

  //function to convert from array to string for displaying inside textarea
  _convertBackToLines(lines, breaks = "\r\n") {
    let email_list = "";
    lines.forEach(e => {
      email_list += `${e.email}${breaks}`;
    });

    return email_list;
  }

  async getAdd({ view }) {
    return view.render("admin/recipient_add");
  }

  async postAdd({ request, response, session }) {
    const formData = request.only(["label", "email_list"]);

    try {
      //save to database
      const row = new Recipient();
      row.label = formData.label;
      row.created_datetime = Moment().format("YYYY-MM-DD HH:mm:ss");
      await row.save();

      //split each line of textarea
      const lines = formData.email_list.split("\r\n");

      //delete invalid email format
      const valid = _.filter(lines, e => {
        return Utility.validateEmail(e); //one of function inside our custom helper file
      });

      //save to recipient_email table
      for (const i of valid) {
        await RecipientEmail.query().insert({
          email: i,
          recipient_id: row.id //this id is from inserting to recipient table before
        });
      }

      session.flash({
        status: "success",
        notification: "Recipient has been created successfully"
      });
      return response.redirect("/admin/recipient");
    } catch (error) {
      session.flash({
        status: "error",
        notification: error.message
      });
      return response.redirect("back");
    }
  }

  async getEdit({ request, view }) {
    const recipient = await Recipient.query()
      .where("id", request.recipient.id)
      .with("recipient_email", builder => {
        builder.setVisible(["email"]); //JOIN 'recipient_email' table and SELECT 'email' only
      })
      .fetch();

    return view.render("admin/recipient_edit", {
      recipient: recipient.toJSON()[0],
      email_list: this._convertBackToLines(recipient.toJSON()[0].recipient_email)
    });
  }

  async putEdit({ request, params, response, session }) {
    const formData = request.only(["label", "email_list"]);

    try {
      //save to database
      await Recipient.query()
        .where("id", params.id)
        .update({
          label: formData.label,
          updated_datetime: Moment().format("YYYY-MM-DD HH:mm:ss")
        });

      //split each line of textarea
      const lines = formData.email_list.split("\r\n");

      //delete invalid email format
      const valid = _.filter(lines, e => {
        return Utility.validateEmail(e);
      });

      //delete recipient_email table first
      await RecipientEmail.query()
        .where("recipient_id", params.id)
        .delete();

      //save to recipient_email table
      for (const i of valid) {
        await RecipientEmail.query().insert({
          email: i,
          recipient_id: params.id
        });
      }

      session.flash({
        status: "success",
        notification: "Recipient has been updated successfully"
      });
      return response.redirect("/admin/recipient");
    } catch (error) {
      session.flash({
        status: "error",
        notification: error.message
      });
      return response.redirect("back");
    }
  }

  async deleteRecipient({ request, response, session }) {
    try {
      //delete from database, request.recipient came from middleware
      await request.recipient.delete();

      session.flash({
        status: "success",
        notification: "Recipient has been deleted successfully"
      });
      return response.redirect("/admin/recipient");
    } catch (error) {
      session.flash({
        status: "error",
        notification: error.message
      });
      return response.redirect("back");
    }
  }
}

module.exports = RecipientController;
