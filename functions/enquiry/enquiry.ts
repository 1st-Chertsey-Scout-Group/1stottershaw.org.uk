import { type Handler, type HandlerEvent } from "@netlify/functions";
import {
  EmailClient,
  type EmailMessage,
  type EmailSendResponse,
} from "@azure/communication-email";

interface ContactForm {
  email: string;
  name: string;
  subject: string;
  message: string;
  number?: string;
}

declare var process: {
  env: {
    EMAIL_CONNECTION_STRING: string;
    EMAIL_RECIPIENTS: string;
    EMAIL_SENDER: string;
    DOMAIN: string;
  };
};

export const handler: Handler = async (event: HandlerEvent, _) => {
  const form = event.queryStringParameters as unknown as ContactForm;

  if (
    process.env.EMAIL_CONNECTION_STRING == undefined ||
    process.env.EMAIL_CONNECTION_STRING.trim() == ""
  ) {
    return errorResponse(process.env.DOMAIN);
  }

  if (
    process.env.EMAIL_RECIPIENTS == undefined ||
    process.env.EMAIL_RECIPIENTS.trim() == ""
  ) {
    return errorResponse(process.env.DOMAIN);
  }

  if (
    process.env.EMAIL_SENDER == undefined ||
    process.env.EMAIL_SENDER.trim() == ""
  ) {
    return errorResponse(process.env.DOMAIN);
  }

  if (process.env.DOMAIN == undefined || process.env.DOMAIN.trim() == "") {
    return errorResponse(process.env.DOMAIN);
  }

  if (
    event.headers["referer"] == undefined ||
    !event.headers["referer"].includes(process.env.DOMAIN)
  ) {
    return errorResponse(process.env.DOMAIN);
  }

  if (!isInvalid(form.number)) {
    return errorResponse(process.env.DOMAIN);
  }

  if (
    isInvalid(form.email) ||
    isInvalid(form.name) ||
    isInvalid(form.subject) ||
    isInvalid(form.message)
  ) {
    return errorResponse(process.env.DOMAIN);
  }

  const sent = await sendEmail(
    form,
    process.env.EMAIL_CONNECTION_STRING,
    process.env.EMAIL_RECIPIENTS,
    process.env.EMAIL_SENDER,
  );

  if (!sent) {
    return errorResponse(process.env.DOMAIN);
  }

  return successResponse(process.env.DOMAIN);
};

async function sendEmail(
  form: ContactForm,
  EMAIL_CONNECTION_STRING: string,
  EMAIL_RECIPIENTS: string,
  EMAIL_SENDER: string,
) {
  const client = new EmailClient(EMAIL_CONNECTION_STRING);

  const recipients = EMAIL_RECIPIENTS.split(",").map((recipient) => {
    return {
      address: recipient,
    };
  });

  const message: EmailMessage = {
    senderAddress: EMAIL_SENDER,
    content: {
      subject: `New Website Enquiry (${form.subject})`,
      html: emailBody(form),
    },
    recipients: {
      to: [...recipients],
    },
  };

  const poller = await client.beginSend(message);
  const response: EmailSendResponse = await poller.pollUntilDone();

  switch (response.status) {
    case "NotStarted":
    case "Running":
    case "Failed":
    case "Canceled":
      return false;
    case "Succeeded":
      return true;
    default:
      throw new Error("Unknown status");
  }
}

function errorResponse(domain: string) {
  return {
    statusCode: 302,
    headers: {
      location: `${domain}/error`,
    },
  };
}

function successResponse(domain: string) {
  return {
    statusCode: 302,
    headers: {
      location: `${domain}/success`,
    },
  };
}

function isInvalid(str: string | undefined | null): boolean {
  return str == undefined || str == null || str.trim() == "";
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
