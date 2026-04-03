const nodemailer = require('nodemailer');

// Create a transporter using Ethereal (fake SMTP service) for testing
// In production, this would be Gmail or SendGrid
let transporter;

const createTransporter = async () => {
    if (transporter) return transporter;

    try {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        const testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        console.log("Email Transporter Initialized");
        return transporter;
    } catch (error) {
        console.error("Failed to create email transporter:", error);
        return null;
    }
};

const sendEmail = async (to, subject, html) => {
    try {
        const mailTransport = await createTransporter();
        if (!mailTransport) {
            console.log("Email simulation (No transport):", { to, subject });
            return false;
        }

        const info = await mailTransport.sendMail({
            from: '"CareerHub Advisor" <advisor@careerhub.com>', // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

module.exports = { sendEmail };
