const express = require("express");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (req, res) => {
  const { name, email, subject, text } = req.body;

  console.log(`${name} ${email} ${subject} ${text}`);
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });
  let mailOptions = {
    from: name,
    to: "weexploreapp2020@gmail.com",
    subject: `Message from Contact Form: Subject: ${subject}`,
    text: `Name: ${name}, Email: ${email}, Message: ${text}`
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.end();
    }
  });
  res.end();
};

module.exports = { sendEmail };
