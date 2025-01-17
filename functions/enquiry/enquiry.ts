import { type Handler, type HandlerEvent } from "@netlify/functions";
import nodemailer from 'nodemailer';


interface ContactForm {
  email: string;
  name: string;
  subject: string;
  message: string;
  number?: string;
}

declare var process: {
  env: {
    EMAIL_HOST: string;
    EMAIL_PORT: number;
    EMAIL_DOMAIN: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
  };
};

export const handler: Handler = async (event: HandlerEvent, _) => {

  processEnquiry(event)
    .then((message) => console.log(message))
    .catch((error) => console.log(error));

  return {
    statusCode: 200,
    headers: {
      location: `https://${process.env.EMAIL_DOMAIN}/form-submitted`,
    },
    body: `
    <!DOCTYPE HTML>
    <html lang="en-US">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=https://${process.env.EMAIL_DOMAIN}/form-submitted">
        <script type="text/javascript">
            window.location.href = "https://${process.env.EMAIL_DOMAIN}/form-submitted"
       </script>
        <title>Page Redirection</title>
      </head>
      <body>
        If you are not redirected automatically, follow this <a href='https://${process.env.EMAIL_DOMAIN}/form-submitted'>link</a>.
      </body>
    </html>
  `
  };

};

function processEnquiry(event: HandlerEvent): Promise<string> {

  return new Promise(async (resolve, reject) => {

    const form = event.queryStringParameters as unknown as ContactForm;

    if (!environmentVariablesAreConfigured()) {
      reject("Environment variables are not configured");
      return;
    }

    if (!requestFromAValidDomain(event)) {
      reject("Request not from a valid domain");
      return;
    }


    if (!isInvalid(form.number)) {
      reject("Potential bot");
      return;
    }

    if (
      isInvalid(form.email) ||
      isInvalid(form.name) ||
      isInvalid(form.subject) ||
      isInvalid(form.message)
    ) {
      reject("Missing field properties");
      return;
    }

    const sent = await sendEmail(
      form
    );

    if (!sent) {
      reject("Email didnt sent.");
      return;
    }


    resolve("Successfully sent the email");
    return;
  });

}

function environmentVariablesAreConfigured(): boolean {

  if (
    process.env.EMAIL_HOST == undefined ||
    process.env.EMAIL_HOST.trim() == ""
  ) {
    return false;
  }

  if (
    process.env.EMAIL_USER == undefined ||
    process.env.EMAIL_USER.trim() == ""
  ) {
    return false;
  }


  if (
    process.env.EMAIL_PASSWORD == undefined ||
    process.env.EMAIL_PASSWORD.trim() == ""
  ) {
    return false;
  }

  if (
    process.env.EMAIL_PORT == undefined ||
    !isNumber(process.env.EMAIL_PORT)
  ) {
    return false;
  }

  if (process.env.EMAIL_DOMAIN == undefined || process.env.EMAIL_DOMAIN.trim() == "") {
    return false;
  }

  return true;
}

function requestFromAValidDomain(event: HandlerEvent): boolean {
  return true;
  if (
    event.headers["referer"] == undefined ||
    !event.headers["referer"].includes(process.env.EMAIL_DOMAIN)
  ) {
    return false;
  }

  return true;
}

async function sendEmail(
  form: ContactForm,
) {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: `${form.subject}@${process.env.EMAIL_DOMAIN}`,
    subject: `New Submission - ${process.env.EMAIL_DOMAIN}`,
    html: emailBody(form, process.env.EMAIL_DOMAIN)
  });

  return true;

}

function isInvalid(str: string | undefined | null): boolean {
  return str == undefined || str == null || str.trim() == "";
}

function isNumber(value?: string | number): boolean {
  return ((value != null) &&
    (value !== '') &&
    !isNaN(Number(value.toString())));
}

function emailBody({ email, message, name, subject }: ContactForm, domain: string) {
  return `<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
  <meta content="width=device-width" name="viewport" />
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta content="IE=edge" http-equiv="X-UA-Compatible" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
  <meta content="light" name="color-scheme" />
  <meta content="light" name="supported-color-schemes" /><!--$-->
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      mso-font-alt: 'sans-serif';
      src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');
    }

    * {
      font-family: 'Inter', sans-serif;
    }
  </style>
  <style>
    blockquote,
    h1,
    h2,
    h3,
    img,
    li,
    ol,
    p,
    ul {
      margin-top: 0;
      margin-bottom: 0
    }

    @media only screen and (max-width:425px) {
      .tab-row-full {
        width: 100% !important
      }

      .tab-col-full {
        display: block !important;
        width: 100% !important
      }

      .tab-pad {
        padding: 0 !important
      }
    }
  </style>
</head>

<body style="margin:0">
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
    id="__react-email-preview">${toTitleCase(subject)} Notification for ${domain}<div>
       ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    </div>
  </div>
  <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
    style="max-width:600px;min-width:300px;width:100%;margin-left:auto;margin-right:auto;padding:0.5rem">
    <tbody>
      <tr style="width:100%">
        <td>
          <h1
            style="text-align:left;color:#111827;margin-bottom:12px;margin-top:0;font-size:36px;line-height:40px;font-weight:800">
            ${toTitleCase(subject)} Notification</h1>
          <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px" />
          <p
            style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
            You have received a submission notification for ${domain}.</p>
          <h2
            style="text-align:left;color:#111827;margin-bottom:12px;margin-top:0;font-size:30px;line-height:36px;font-weight:700">
            Name</h2>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td align="left" data-id="__react-email-column"
                  style="border-color:#e2e2e2;border-width:2px;border-style:solid;background-color:#f7f7f7;border-radius:0;padding-top:8px;padding-right:8px;padding-bottom:8px;padding-left:8px">
                  <p
                    style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:0px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
                    ${name}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="max-width:37.5em;height:32px">
            <tbody>
              <tr style="width:100%">
                <td></td>
              </tr>
            </tbody>
          </table>
          <h2
            style="text-align:left;color:#111827;margin-bottom:12px;margin-top:0;font-size:30px;line-height:36px;font-weight:700">
            Email</h2>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td align="left" data-id="__react-email-column"
                  style="border-color:#e2e2e2;border-width:2px;border-style:solid;background-color:#f7f7f7;border-radius:0;padding-top:8px;padding-right:8px;padding-bottom:8px;padding-left:8px">
                  <p
                    style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:0px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
                    ${email}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="max-width:37.5em;height:32px">
            <tbody>
              <tr style="width:100%">
                <td></td>
              </tr>
            </tbody>
          </table>
          <h2
            style="text-align:left;color:#111827;margin-bottom:12px;margin-top:0;font-size:30px;line-height:36px;font-weight:700">
            Message</h2>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0">
            <tbody style="width:100%">
              <tr style="width:100%">
                <td align="left" data-id="__react-email-column"
                  style="border-color:#e2e2e2;border-width:2px;border-style:solid;background-color:#f7f7f7;border-radius:0;padding-top:8px;padding-right:8px;padding-bottom:8px;padding-left:8px">
                  <p
                    style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:0px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
                    ${message}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="max-width:37.5em;height:64px">
            <tbody>
              <tr style="width:100%">
                <td></td>
              </tr>
            </tbody>
          </table>
          <p
            style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
            <span style="color:rgb(34, 34, 34)">This e-mail message is confidential and is intended for use by the
              addressee only. If this e-mail was not intended for you please delete it.</span></p>
          <p
            style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
            If you no longer wish to recieve website notifications, please email <span
              style="color:#1864dd"><u>webmaster@${domain}</u></span>.</p>
          <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px" />
          <p
            style="font-size:14px;line-height:24px;margin:16px 0;color:#64748B;margin-top:0px;margin-bottom:20px;text-align:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
            Do not reply directly, this is an automatic notification.</p>
        </td>
      </tr>
    </tbody>
  </table><!--/$-->
</body>

</html>`;
}

function toTitleCase(str: string) {
  return str.toLowerCase().split(' ').map((word: string) => {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}