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
  const form = event.queryStringParameters as unknown as ContactForm;

  if (!environmentVariablesAreConfigured()) {
    return {
      statusCode: 302,
      headers: {
        location: `https://${process.env.EMAIL_DOMAIN}/error?1`,
      },
    };
  }

  if (!requestFromAValidDomain(event)) {
    return {
      statusCode: 302,
      headers: {
        location: `https://${process.env.EMAIL_DOMAIN}/error?2`,
      },
    };
  }


  if (!isInvalid(form.number)) {
    return {
      statusCode: 302,
      headers: {
        location: `https://${process.env.EMAIL_DOMAIN}/error?3`,
      },
    };
  }

  if (
    isInvalid(form.email) ||
    isInvalid(form.name) ||
    isInvalid(form.subject) ||
    isInvalid(form.message)
  ) {
    return {
      statusCode: 302,
      headers: {
        location: `https://${process.env.EMAIL_DOMAIN}/error?4`,
      },
    };
  }

  const sent = await sendEmail(
    form,
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_DOMAIN,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  );

  if (!sent) {
    return {
      statusCode: 302,
      headers: {
        location: `https://${process.env.EMAIL_DOMAIN}/error?5`,
      },
    };
  }

  return {
    statusCode: 200,
    headers: {
      location: `https://${process.env.EMAIL_DOMAIN}/success`,
    },
  };;
};

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
  EMAIL_HOST: string,
  EMAIL_PORT: number,
  EMAIL_DOMAIN: string,
  EMAIL_USER: string,
  EMAIL_PASSWORD: string,
) {

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    },
  });

  var message = await transporter.sendMail({
    from: EMAIL_USER,
    to: `${form.subject}@${EMAIL_DOMAIN}`,
    subject: `${EMAIL_DOMAIN.toUpperCase()} Website Enquiry (${form.subject})`,
    html: emailBody(form)
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

function emailBody({ email, message, name, subject }: ContactForm) {
  return `
  <!doctype html>
<html>
  <body>
    <div
      style='background-color:#F0ECE5;color:#262626;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#FFFFFF;border-radius:4px"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <h1
                style="font-weight:bold;text-align:center;margin:0;font-size:32px;padding:16px 24px 16px 24px"
              >
                New Website Enquiry
              </h1>
              <div style="padding:16px 0px 16px 0px">
                <hr
                  style="width:100%;border:none;border-top:1px solid #CCCCCC;margin:0"
                />
              </div>
              <div style="padding:16px 24px 16px 24px">
                <table
                  align="center"
                  width="100%"
                  cellpadding="0"
                  border="0"
                  style="table-layout:fixed;border-collapse:collapse"
                >
                  <tbody style="width:100%">
                    <tr style="width:100%">
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:0;padding-right:8px;width:150px"
                      >
                        <h3
                          style="font-weight:bold;text-align:right;margin:0;font-size:20px;padding:16px 24px 16px 24px"
                        >
                          Name:
                        </h3>
                      </td>
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:8px;padding-right:0"
                      >
                        <div
                          style="background-color:#FAFAFA;font-weight:normal;padding:16px 24px 16px 24px"
                        >
                        ${name}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="padding:16px 24px 16px 24px">
                <table
                  align="center"
                  width="100%"
                  cellpadding="0"
                  border="0"
                  style="table-layout:fixed;border-collapse:collapse"
                >
                  <tbody style="width:100%">
                    <tr style="width:100%">
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:0;padding-right:8px;width:150px"
                      >
                        <h3
                          style="font-weight:bold;text-align:right;margin:0;font-size:20px;padding:16px 24px 16px 24px"
                        >
                          Email:
                        </h3>
                      </td>
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:8px;padding-right:0"
                      >
                        <div
                          style="background-color:#FAFAFA;font-weight:normal;padding:16px 24px 16px 24px"
                        >
                          ${email}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="padding:16px 24px 16px 24px">
                <table
                  align="center"
                  width="100%"
                  cellpadding="0"
                  border="0"
                  style="table-layout:fixed;border-collapse:collapse"
                >
                  <tbody style="width:100%">
                    <tr style="width:100%">
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:0;padding-right:8px;width:150px"
                      >
                        <h3
                          style="font-weight:bold;text-align:right;margin:0;font-size:20px;padding:16px 24px 16px 24px"
                        >
                          Subject:
                        </h3>
                      </td>
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:8px;padding-right:0"
                      >
                        <div
                          style="background-color:#FAFAFA;font-weight:normal;padding:16px 24px 16px 24px"
                        >
                        ${subject}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="padding:16px 24px 16px 24px">
                <table
                  align="center"
                  width="100%"
                  cellpadding="0"
                  border="0"
                  style="table-layout:fixed;border-collapse:collapse"
                >
                  <tbody style="width:100%">
                    <tr style="width:100%">
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:0;padding-right:8px;width:150px"
                      >
                        <h3
                          style="font-weight:bold;text-align:right;margin:0;font-size:20px;padding:16px 24px 16px 24px"
                        >
                          Message:
                        </h3>
                      </td>
                      <td
                        style="box-sizing:content-box;vertical-align:top;padding-left:8px;padding-right:0"
                      >
                        <div style="height:16px"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="padding:16px 24px 16px 24px">
                <div
                  style="background-color:#FAFAFA;font-weight:normal;padding:16px 24px 16px 24px"
                >
                ${message}
                </div>
              </div>
              <div style="padding:16px 0px 16px 0px">
                <hr
                  style="width:100%;border:none;border-top:1px solid #CCCCCC;margin:0"
                />
              </div>
              <div
                style="font-size:10px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px"
              >
                You can reply directly to this email.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;
}