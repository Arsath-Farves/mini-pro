const nodemailer = require('nodemailer');

const sendAcceptanceEmail = async (studentEmail, studentName, projectTitle) => {
    try {
        // Create a test account if you don't have one (Ethereal)
        let testAccount = await nodemailer.createTestAccount();

        // Create reusable transporter object
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        const mailOptions = {
            from: '"Bharat-Setu Notifications 🇮🇳" <notifications@bharatsetu.in>',
            to: studentEmail,
            subject: `Accepted! You've been selected for "${projectTitle}"`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #6366f1;">Congratulations ${studentName}! 🎉</h2>
                    <p>An Alumnus has accepted your application for the <strong>${projectTitle}</strong> sandbox project.</p>
                    <p>You can now start working on the task and submit your "Proof of Work" through the dashboard.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8em; color: #888;">This is a simulated notification from the Bharat-Setu Collaborative Sandbox.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log("-----------------------------------------");
        console.log("📧 SIMULATED NOTIFICATION SENT");
        console.log("Email to:", studentEmail);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        console.log("-----------------------------------------");

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

module.exports = {
    sendAcceptanceEmail
};
