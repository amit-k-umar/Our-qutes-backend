
const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})


const mail = async function sendMail(name, email, subject, link) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        // console.log(accessToken);
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: process.env.TYPE,
                user: process.env.USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken : accessToken
            }
        })

        const mailOptions = {
            from: `"OUR Quotes"`,
            to: email,
            subject: subject,
            html: `Hello ${name},<br/>You have requested for a password change. Please 
            <a href="${link}"> Click here </a> to reset your password. 
            If you can't click on the link please copy & paste the below link in browser<br/> <small>${link}</small><br/><br/><br/><br/>
            <center><small>This is a system generated email</small></center>`,
        };

        const result = await transport.sendMail(mailOptions)
        return 1;

    } catch (error) {
        return error.message;
    }
}

module.exports = mail;