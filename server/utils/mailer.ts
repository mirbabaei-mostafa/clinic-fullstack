import dotenv from 'dotenv';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

dotenv.config();

// https://console.cloud.google.com/
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_APIS_CLIENTID,
  process.env.GOOGLE_APIS_CLIENT_SECRET,
  process.env.BASEURL
);

// const {tokens} = await oauth2Client.getToken(code)
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_APIS_MAIL_REFERESH_TOKEN,
});

// https://nodemailer.com/smtp/oauth2/
const sendVerification = async (email: string, name: string, url: string) => {
  try {
    const accessToken = await oauth2Client.getAccessToken().catch((err) => {
      return err;
    });
    const smtp = nodemailer.createTransport({
      host: String(process.env.GOOGLE_SMTP_HOST),
      port: Number(process.env.GOOGLE_SMTP_PORT),
      secure: true,
      auth: {
        type: 'OAUTH2',
        user: process.env.MAILADDRESS,
        clientId: process.env.GOOGLE_APIS_CLIENTID,
        clientSecret: process.env.GOOGLE_APIS_CLIENT_SECRET,
        accessToken,
        refreshToken: process.env.GOOGLE_APIS_MAIL_REFERESH_TOKEN,
        // expires: 1484314697598,
      },
    } as nodemailer.TransportOptions);

    const message = {
      from: process.env.MAILADDRESS,
      to: email,
      subject: 'Social Network: Verification',
      html: `<div
      style="
        max-width: 600px;
        margin: 20px;
        padding: 15px;
        border: 1px solid #d9caa3;
        border-radius: 5px;
        display: flex;
        gap: 20px;
        flex-direction: column;
        justify-content: center;
      "
    >
      <div style="font: bold 24px Arial; padding: 8px">
        Activate your Social Network account
      </div>
      <div style="font: bold 14px Arial; padding: 4px">Hello ${name},</div>
      <div style="font: normal 13px Arial; padding: 4px; line-height: 28px">
        You recently created an account on our Social Network website. Please
        verify your email to complete your registration by click at below link:
      </div>
      <div style="font: bold 16px Arial; padding: 7px">
        <a href="${url}">Confirm your account</a>
      </div>
    </div>`,
    };

    // https://nodemailer.com/usage/
    smtp.sendMail(message, (err: Error | null, res) => {
      if (err) {
        return err;
      } else {
        return res;
      }
    });
  } catch (err) {
    return err;
  }
};

// Send reset password code by email
export const sendResetPasswordCodeByEmail = async (
  email: string,
  name: string,
  code: string
) => {
  try {
    const accessToken = await oauth2Client.getAccessToken().catch((err) => {
      return err;
    });
    const smtp = nodemailer.createTransport({
      host: String(process.env.GOOGLE_SMTP_HOST),
      port: Number(process.env.GOOGLE_SMTP_PORT),
      secure: true,
      auth: {
        type: 'OAUTH2',
        user: process.env.MAILADDRESS,
        clientId: process.env.GOOGLE_APIS_CLIENTID,
        clientSecret: process.env.GOOGLE_APIS_CLIENT_SECRET,
        accessToken,
        refreshToken: process.env.GOOGLE_APIS_MAIL_REFERESH_TOKEN,
        // expires: 1484314697598,
      },
    } as nodemailer.TransportOptions);

    const message = {
      from: process.env.MAILADDRESS,
      to: email,
      subject: 'Social Network: Reset Password',
      html: `<div
      style="
        max-width: 600px;
        margin: 20px;
        padding: 15px;
        border: 1px solid #d9caa3;
        border-radius: 5px;
        display: flex;
        gap: 20px;
        flex-direction: column;
        justify-content: center;
      "
    >
      <div style="font: bold 24px Arial; padding: 8px">
        Reset your Social Network account's password
      </div>
      <div style="font: bold 14px Arial; padding: 4px">Hello ${name},</div>
      <div style="font: normal 13px Arial; padding: 4px; line-height: 28px">
        You requsted to reset your password. Use this code:
      </div>
      <div style="font: bold 16px Arial; padding: 7px">Code: ${code}</div>
    </div>`,
    };

    // https://nodemailer.com/usage/
    smtp.sendMail(message, (err: Error | null, res) => {
      if (err) {
        return err;
      } else {
        return res;
      }
    });
  } catch (err) {
    return err;
  }
};

export default sendVerification;
