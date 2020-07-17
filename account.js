const sgMail = require('@sendgrid/mail');

const sendgridAPIkey = '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';

sgMail.setApiKey(sendgridAPIkey);

const sendWelcomeEmail = (name, email, message) => {
    sgMail.send({
        to: 'deepgagan9336@gmail.com',
        from: email,
        subject: `Hey my name is ${name}`,
        text: message
    });
}

module.exports = {
    sendWelcomeEmail
}