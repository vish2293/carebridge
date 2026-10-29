require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../../.env') });
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

function gmailApiTransport() {
    return {
        name: 'gmail-api-transport',
        version: '1.0.0',
        async send(mail, callback) {
            try {
                const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

                // mail.message.createReadStream() gives the raw message stream
                const raw = await mail.message.createReadStream().reduce(
                    (acc, chunk) => Buffer.concat([acc, chunk]),
                    Buffer.from([])
                ).then(buf => buf.toString('base64')
                    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''));

                const res = await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: { raw }
                });

                // nodemailer expects a certain info object
                callback(null, {
                    envelope: mail.data.envelope || mail.message.getEnvelope(),
                    messageId: mail.message.messageId(),
                    response: JSON.stringify(res.data)
                });
            } catch (err) {
                callback(err);
            }
        }
    };
}

const createTransporter = nodemailer.createTransport(gmailApiTransport());

module.exports = { createTransporter };