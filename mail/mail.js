// import { Resend } from "resend";
const { Resend } = require("resend");
const resend = new Resend("re_Jhs1WAqJ_8pQiK97ZRiMjYZSvdkAkMiuP");

async function RegisterMail(email, rol) {
  const resposne = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Thank you for the accessing this api.",
    html:
      "<p>Thank you for the accessing this api.<hr/>Here is your one time password<b>" +
      rol +
      "</b></p>",
  });

  // console.log(resposne);
  return resposne;
}

module.exports = { RegisterMail };
