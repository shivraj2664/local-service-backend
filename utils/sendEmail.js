const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmail = async (to, subject, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,       
        pass: process.env.EMAIL_PASS    
      }
    });

    const templatePath = path.join(__dirname, "./emailTemplates/forgotPassword.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email error", error);
    throw error;
  }
};

module.exports = sendEmail;