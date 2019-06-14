"use strict";

const Event = use("Event");
const Mail = use("Mail");
const Env = use("Env");

//accept object data
Event.on("recoverPassword", async data => {
  await Mail.send(
    "emails.recover",
    {
      recipient_username: data.recipient_username,
      link: Env.get("APP_URL") + "/admin/reset_password/?token=" + data.reset_token,
      expired_datetime: data.expired_datetime
    },
    message => {
      message.from("noreply@cs.com");
      message.to(data.recipient_email);
      message.subject("Reset Your Password");
    }
  );
});

Event.on("sendNewsletter", async data => {
  //this Mail API will decode HTML directly without view
  await Mail.raw(`${data.content}`, message => {
    message.from(data.sender_email, data.sender_name);
    message.to(data.recipient_email);
    message.subject(data.subject);
  });
});
