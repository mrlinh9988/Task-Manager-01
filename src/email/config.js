let nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mrlinhdeptrai98@gmail.com',
        pass: 'deobiet12'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMail = function (req, toEmail, token) {
    var mailOptions = {
        from: 'mrlinhdeptrai98@gmail.com',
        to: toEmail,
        subject: 'Welcome to mrLinh app',
        text: `You received this message from mrLinh`,
        html: `<p>You have got a new message</p></b><a href="${req.protocol}://${req.get('host')}/verify?token=${token}">Click hear to verify your email</a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log('error1: ', error);
        }

        console.log('message sent: %s', info.messageId);
    });
}

module.exports = sendMail;
