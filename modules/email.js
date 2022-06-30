const nodemailer = require('nodemailer');
const { google } = require("googleapis")
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('./../config');

const CLIENT_ID = process.env.MAIL_CLIENT_ID;
const CLEINT_SECRET = process.env.MAIL_CLEINT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;

module.exports = class Email {
  constructor (user, code) {
    this.to = user.email;
    this.firstName = user.name;
    this.code = code;
    this.from = config.email.user;
    this.oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLEINT_SECRET,
      REDIRECT_URI
    );
    this.oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  }

  async newTransport () {
    const accessToken = await new Promise((resolve, reject) => {
      this.oAuth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token.')
        }
        resolve(token);
      });
    })
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.User_Email,
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken

      },
      logger: true,
      debug: false,
    });
  }

  // send the actual email
  async send (template, subject) {
    // 1) Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      code: this.code,
      subject
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
      // html:
    };

    // 3) Create a tranport and send email
    let transport = await this.newTransport()
    await transport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error.message);
      } else {
       // console.log('Send', response.response);
      }
    });
  }

  async sendWelcome () {
    await this.send('welcome', 'Welcome to Arab Security Cyber Wargames Family!');
  }

  async sendPasswordReset () {
    await this.send(
      'passwordReset',
      'Your Password reset code'
    );
  }
};