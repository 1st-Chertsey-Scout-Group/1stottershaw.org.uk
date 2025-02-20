import { sendEmail } from "@/code/email";
import { isValidEmail } from "@/lib/utils";
import { getCollection } from "astro:content";
import type { OptionGroup, Option } from "basecamp/models";
import { type SentMessageInfo } from 'nodemailer';


export async function getOptions(): Promise<(Option | OptionGroup)[]> {
    const sections: Option[] = (await getCollection("sections")).map((g) => {
        return { type: "option", label: g.data.name, id: g.slug };
    });

  return [
    { type: "option", label: "General Enquiry", id: "enquiry" },
    {
        type: "group",
        label: "Sections",
        options: sections,
    },
  ];
}

export function getOptionFromId(
  id: string,
  opts: (Option | OptionGroup)[],
): Option | null {
  for (let i = 0; i < opts.length; i++) {
    const element = opts[i];

    if (element.type == "option") {
      if (element.id == id) {
        return element;
      }
    } else if (element.type == "group") {
      var option = getOptionFromId(id, element.options);
      if (option) {
        return option;
      }
    }
  }

  return null;
}

export interface ContactForm {
  email: string;
  name: string;
  subjectId: string;
  subjectOption: Option | null;
  message: string;
  number?: string | null;
}

export function getFormData(data: FormData, options: (Option | OptionGroup)[]): ContactForm {
  const email = data.get("email") as string ?? "";
  const name = data.get("name") as string ?? "";
  const subjectId = data.get("subject") as string ?? "";
  const message = data.get("message") as string ?? "";
  const number = data.get("number") as string ?? null;

  const subjectOption = getOptionFromId(subjectId, options);

  return {
    email,
    message,
    name,
    subjectId,
    subjectOption,
    number
  }
}

export function isFormDataValid(data: ContactForm): boolean {
  try {
    if (typeof data.email !== "string" || data.email.length < 1 || !isValidEmail(data.email)) {
      return false;
    }

    if (typeof data.name !== "string" || data.name.length < 1) {
      return false;
    }

    if (typeof data.subjectId !== "string" || data.subjectId.length < 1) {
      return false;
    }

    if (data.subjectOption == null) {
      return false;
    }

    if (typeof data.message !== "string" || data.message.length < 1) {
      return false;
    }

    // Honeypot, this needs to be empty
    if (data.number !== undefined && data.number !== null && data.number.trim() !== "") {
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  return true;
}

export function sendEnquiryEmail(data: ContactForm, smtpSettings: { SMTP_HOST: string, SMTP_PASSWORD: string, SMTP_PORT: number, SMTP_ALIAS: string, SMTP_DOMAIN: string }): Promise<SentMessageInfo> {
  try {
    return sendEmail({
      smtp: {
        host: smtpSettings.SMTP_HOST,
        port: smtpSettings.SMTP_PORT,
        auth: {
          user: `${smtpSettings.SMTP_ALIAS}@${smtpSettings.SMTP_DOMAIN}`,
          pass: smtpSettings.SMTP_PASSWORD
        }
      },
      mail: {
        from: `${smtpSettings.SMTP_ALIAS}@${smtpSettings.SMTP_DOMAIN}`,
        to: `${data.subjectId}@${smtpSettings.SMTP_DOMAIN}`,
        subject: `New Submission - ${smtpSettings.SMTP_DOMAIN}`,
        html: `<!DOCTYPE html
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
      id="__react-email-preview">${data.subjectOption!.label} Notification for ${smtpSettings.SMTP_DOMAIN}<div>
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
              ${data.subjectOption!.label} Notification</h1>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px" />
            <p
              style="font-size:15px;line-height:24px;margin:16px 0;text-align:left;margin-bottom:20px;margin-top:0px;color:#374151;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
              You have received a submission notification for ${smtpSettings.SMTP_DOMAIN}.</p>
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
                      ${data.name}</p>
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
                      ${data.email}</p>
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
                      ${data.message}</p>
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
                style="color:#1864dd"><u>webmaster@${smtpSettings.SMTP_DOMAIN}</u></span>.</p>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px" />
            <p
              style="font-size:14px;line-height:24px;margin:16px 0;color:#64748B;margin-top:0px;margin-bottom:20px;text-align:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
              Do not reply directly, this is an automatic notification.</p>
          </td>
        </tr>
      </tbody>
    </table><!--/$-->
  </body>
  
  </html>`
      }
    });

  } catch (error) {
    return Promise.reject(error);
  }
}