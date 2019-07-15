const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); // CSS inliner 
const htmlToText = require('html-to-text'); // for people who use text editors to read emails
const promisify = require('es6-promisify');

// mailtrap.io for mail
// the transport
const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// generating HTML. A views folder with an email subfolder will be targetted
const generateHTML = (filename, options = {}) => {
    // __dirname is equal to the current directory the file is running
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
};

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);
    const mailOptions = {
        from:  `Jones <fuckerjones@yahoomail.com>`,
        to: options.user.email,
        subject: options.subject,
        html,
        text,
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
};