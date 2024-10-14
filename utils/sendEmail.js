const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Gmail service
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: Array.isArray(options.email) ? options.email.join(',') : options.email,
        subject: options.subject,
        text: options.message, // For plain text fallback
        html: options.html // Include HTML content
    };

    if (!message.to) {
        throw new Error('No recipients defined');
    }

    await transporter.sendMail(message);
};

module.exports = sendEmail;
