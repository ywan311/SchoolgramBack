import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import jwt from "jsonwebtoken";


export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

const sendMail = email => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENGRID_PASSWORD
    }
  };
  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email);
};

export const sendSecretMail = (adress, secret) => {
  const email = {
    from: "yoowanKim@skhu.com",
    to: adress,
    subject: "🔒Login Secret for SKHUgagram🔒",
    html: `Hi! I sincerely congratulate you 
    on becoming a member of skhugram. Please remember the keywords required 
    for membership verification and input. 
    Your login secret is <strong>${secret}</strong>.
    <br/>Copy paste on the app/website to log in`
  };
  return sendMail(email);
};

export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET);