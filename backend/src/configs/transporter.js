import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
  host: 'smtp.resend.com',
  secure: true,
  port: 465,
  auth: {
    user: 'resend',
    pass: 're_AmiymhnR_PhLV71K8J7vbPwChuETetH33', // process.env.SMTP_PASSWORD not working
  },
});
