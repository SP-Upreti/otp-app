const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
    const { receiver: mail } = req.body; // Destructure correctly
    // console.log("receiver:", mail);

    // Check if mail is provided
    // if (!mail) {
    //     return res.status(400).json({ success: false, message: "Receiver email is required" });
    // }

    try {
        // Create a transporter using your Gmail account
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'surendraexperiment@gmail.com', // Your Gmail address
                pass: 'drcg pheh idtk xqxd',    // Your Gmail app password
            },
        });

        // Sending email
        let info = await transporter.sendMail({
            from: '"OTP" <surendraexperiment@gmail.com>', // sender address
            to: mail, // list of receivers
            subject: "OTP From Surendra", // Subject line
            text: "Hello There", // plain text body
            html: "<b>Your secret key is</b>: <h1>231524</h1> Please do not share with anyone. Thank you", // html body
        });

        console.log("Message sent: %s", info.messageId);

        // Send success response
        res.json({ success: true, message: "Mail sent successfully" });

    } catch (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
    }
};

module.exports = sendMail;
