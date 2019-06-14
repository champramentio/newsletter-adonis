"use strict";

const Newsletter = use("App/Models/Newsletter");
const Recipient = use("App/Models/Recipient");
const Moment = use("moment");
const Event = use("Event");

class NewsletterController {
  async getIndex({ view }) {
    const newsletters = await Newsletter.query()
      .with("recipient", builder => {
        builder.with("recipient_email", builder => {
          builder.setVisible(["email"]);
        });
      })
      .with("created_by", builder => {
        builder.setVisible(["username"]);
      })
      .with("sent_by", builder => {
        builder.setVisible(["username"]);
      })
      .fetch();

    return view.render("admin/newsletter", {
      data: newsletters.toJSON()
    });
  }

  async getInfo({ request, view }) {
    return view.render("admin/newsletter_info", {
      data: request.newsletter.toJSON()
    });
  }

  async getAdd({ view }) {
    const recipients = await Recipient.all();
    return view.render("admin/newsletter_add", {
      recipients: recipients.toJSON()
    });
  }

  async postAdd({ request, response, auth, session }) {
    const formData = request.only(["subject", "content", "sender_email", "sender_name", "recipient_id"]);

    try {
      //save to database
      const row = new Newsletter();
      row.subject = formData.subject;
      row.content = formData.content;
      row.sender_email = formData.sender_email;
      row.sender_name = formData.sender_name;
      row.recipient_id = formData.recipient_id;
      row.created_datetime = Moment().format("YYYY-MM-DD HH:mm:ss");
      row.created_by_user_id = auth.user.id;
      await row.save();

      session.flash({
        status: "success",
        notification: "Newsletter has been created successfully"
      });
      return response.redirect("/admin/newsletter");
    } catch (error) {
      session.flash({
        status: "error",
        notification: error.message
      });
      return response.redirect("back");
    }
  }

  async deleteNewsletter({ request, response, session }) {
    try {
      //delete from database, request.newsletter came from middleware
      await request.newsletter.delete();

      session.flash({
        status: "success",
        notification: "Newsletter has been deleted successfully"
      });
      return response.redirect("/admin/newsletter");
    } catch (error) {
      session.flash({
        status: "error",
        notification: error.message
      });
      return response.redirect("back");
    }
  }

  async getSend({ request, response, auth, session }) {
    try {
      const list = request.newsletter.toJSON().recipient[0].recipient_email;

      for (const i of list) {
        //send email
        Event.fire("sendNewsletter", {
          subject: request.newsletter.toJSON().subject,
          content: request.newsletter.toJSON().content,
          sender_email: request.newsletter.toJSON().sender_email,
          sender_name: request.newsletter.toJSON().sender_name,
          recipient_email: i.email
        });
      }

      //update sent datetime and user
      const row = request.newsletter;
      row.sent_datetime = Moment().format("YYYY-MM-DD HH:mm:ss");
      row.sent_by_user_id = auth.user.id;
      await row.save();

      session.flash({
        status: "success",
        notification: "Newsletter has been sent successfully"
      });
      return response.redirect("/admin/newsletter");
    } catch (error) {
      session.flash({
        status: "error",
        notification: error.message
      });
      return response.redirect("back");
    }
  }
}

module.exports = NewsletterController;
