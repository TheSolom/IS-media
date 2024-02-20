import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
        user: process.env.RESEND_USERNAME,
        pass: process.env.RESEND_PASSWORD,
    },
});

export default transporter;
