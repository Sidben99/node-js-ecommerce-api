const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  options.from = options.from ?? 'sid-shop App <sidben9991@gmail.com>';
  // 1) create transporter (the service that will send the email)
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) send the email
  await transporter.sendMail(options);
};

module.exports = sendEmail;
