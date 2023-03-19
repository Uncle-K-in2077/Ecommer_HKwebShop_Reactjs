/** @format */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: true,
  port: 587,
  auth: {
    user: "vaiii147258@gmail.com",
    pass: "",
  },
});
module.exports = transporter;
