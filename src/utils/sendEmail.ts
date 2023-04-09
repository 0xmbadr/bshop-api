import nodemailer from 'nodemailer';
import { EMAIL } from '../config';

const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL.HOST,
    port: EMAIL.PORT,
    auth: {
      user: EMAIL.AUTH.USER,
      pass: EMAIL.AUTH.PASS,
    },
  });

  const mailOpts = {
    from: 'Bshop.Inc <bshop@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email
  await transporter.sendMail(mailOpts);
};

export default sendEmail;
