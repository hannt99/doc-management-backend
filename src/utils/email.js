import nodeMailer from 'nodemailer';

// Send verify mail
const sendMail = async (receiver, subject, html) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.PASS_SENDER,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: receiver,
            subject: subject,
            html: html,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error in sending email: ' + error);
            } else {
                console.log('Mail has been sent: ', info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

export default sendMail;
