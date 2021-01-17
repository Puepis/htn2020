const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendVerificationEmail = async (email, pin) => {
  let success = true;
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL, // Use the email address or domain you verified above
    subject: "Gitalk Verification Pin",
    text: `Here's your Gitalk verification pin: ${pin}`,
    html: `<strong>Here's your Gitalk verification pin: ${pin}</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log("email successfully sent to: ", email);
  } catch (error) {
    success = false;
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
  return success;
};
