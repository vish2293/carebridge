const { createTransporter } = require("../../services/emailServices/transPorter");


const sendEmail = async (subject, text, to) => {

  const transporter = createTransporter;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    }
  });
};

module.exports = {
  sendEmail
}