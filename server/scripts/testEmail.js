const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing Email Configuration...');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`Port: ${process.env.SMTP_PORT}`);
    console.log(`User: ${process.env.SMTP_USER}`);
    console.log(`To: ${process.env.ADMIN_EMAIL}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        debug: true, // show debug output
        logger: true // log information in console
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "Diagnostic Test Email",
            text: "如果有 (If you receive this), the SMTP config is working.",
            html: "<b>SMTP Config is working!</b>"
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error occurred: ", error);
    }
};

testEmail();
