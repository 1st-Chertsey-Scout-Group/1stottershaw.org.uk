import { Document } from "yaml";

import { githubRepo, githubUser } from "@/customisations/site.json";

export async function GET() {
  const isDev = import.meta.env.DEV;

  const titleMinLength = 5;
  const titleMaxLength = 100;
  const titleValidation = [
    `.{${titleMinLength},${titleMaxLength}}`,
    `Titles must be between ${titleMinLength} and ${titleMaxLength} characters long.`,
  ];

  const subtitleMaxLength = 250;
  const subTitleValidation = [
    `.{0,${subtitleMaxLength}}`,
    `Subtitles must be ${subtitleMaxLength} characters or fewer.`,
  ];

  const labelMaxLength = 25;
  const labelValidation = [
    `.{0,${labelMaxLength}}`,
    `Labels must be ${labelMaxLength} characters or fewer.`,
  ];

  const placeholderMaxLength = 50;
  const placeholderValidation = [
    `.{0,${placeholderMaxLength}}`,
    `Placeholders must be ${placeholderMaxLength} characters or fewer.`,
  ];

  const buttonMaxLength = 25;
  const buttonValidation = [
    `.{0,${buttonMaxLength}}`,
    `Button label's must be ${buttonMaxLength} characters or fewer.`,
  ];

  const numberValidation = ["d+", "This field must be a valid number."];

  const altTextMaxLength = 250;
  const altTextValidation = [
    `.{0,${altTextMaxLength}}`,
    `Alt texts must be ${altTextMaxLength} characters or fewer.`,
  ];

  const announcementMessageMaxLength = 100;
  const announcementMessageValidation = [
    `.{0,${announcementMessageMaxLength}}`,
    `message must be ${announcementMessageMaxLength} characters or fewer.`,
  ];

  let backend = {};

  if (isDev) {
    backend = {
      name: "git-gateway",
    };
  } else {
    backend = {
      name: "github",
      repo: `${githubUser}/${githubRepo}`,
      branch: "release",
    };
  }

  const doc = new Document({
    local_backend: true,
    backend: backend,
    media_folder: "public/media",
    public_folder: "public",
    publish_mode: "simple",
    collections: [
      {
        name: "sections",
        label: "Sections",
        label_singular: "Section",
        folder: "src/content/sections",
        identifier_field: "name",
        extension: "json",
        publish: false,
        create: true,
        nested: {
          depth: 2,
          summary: "{{title}}",
        },
        media_folder: "",
        public_folder: "",
        fields: [
          {
            label: "Name",
            name: "name",
            widget: "string",
            hint: "If you only have one section of the same age group, use a simple name like 'Cubs.' For multiple sections, use the full name, such as 'Hunter Cubs.'",
          },
          {
            label: "Order",
            name: "order",
            widget: "number",
            hint: "The display order for this section on the website. Example: Squirrels = 1, Beavers = 2, Cubs = 3, Scouts = 4, and so on.",
          },
          {
            label: "Age",
            name: "age",
            widget: "string",
            hint: "Specify the age range for this section. Use '½' for half years if needed.",
          },
          {
            label: "Meeting Day",
            name: "meetingDay",
            widget: "select",
            options: [
              {
                label: "Monday",
                value: "Monday",
              },
              {
                label: "Tuesday",
                value: "Tuesday",
              },
              {
                label: "Wednesday",
                value: "Wednesday",
              },
              {
                label: "Thursday",
                value: "Thursday",
              },
              {
                label: "Friday",
                value: "Friday",
              },
            ],
            hint: "The regular weekday meeting day",
          },
          {
            label: "Meeting Start Time",
            name: "meetingStartTime",
            widget: "string",
            hint: "Specify the regular meeting start time using the 24-hour clock format.",
          },
          {
            label: "Meeting End Time",
            name: "meetingEndTime",
            widget: "string",
            hint: "Specify the regular meeting end time using the 24-hour clock format.",
          },
          {
            label: "Image",
            name: "image",
            widget: "image",
            media_folder: ".",
            choose_url: false,
            hint: "An image to represent the section. We recommend using a photo of a young person or a group of young people in uniform.",
          },
        ],
      },
      {
        name: "content",
        label: "Content",
        files: [
          {
            label: "Header",
            name: "header",
            file: "src/customisations/header.json",
            fields: [
              {
                label: "Links",
                name: "links",
                widget: "list",
                allow_add: true,
                fields: [
                  {
                    label: "Label",
                    name: "text",
                    widget: "string",
                    pattern: labelValidation,
                    hint: `Label text for the link, ${buttonMaxLength} characters max.`,
                  },
                  {
                    label: "Url",
                    name: "url",
                    widget: "string",
                    hint: "Enter the full URL, including http:// or https://. Or link to the page headers using #sections, #address or #contact",
                  },
                  {
                    label: "Target",
                    name: "target",
                    widget: "select",
                    default: ["_blank"],
                    options: [
                      { label: "Open in new tab", value: "_blank" },
                      { label: "Open in same window", value: "_self" },
                    ],
                    hint: "We recommend opening internal links in the same window and external links in a new tab.",
                  },
                ],
              },
            ],
          },
          {
            label: "Address",
            name: "address",
            file: "src/customisations/address.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Address",
                name: "address",
                widget: "string",
                pattern: subTitleValidation,
                hint: `Provide the full address, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Map Url",
                name: "mapUrl",
                widget: "string",
                hint: `Enter a Google Maps Embed URL, including https://`,
              },
              {
                label: "Map Title",
                name: "mapTitle",
                widget: "string",
                pattern: altTextValidation,
                hint: `Describe the map for accessibility, up to ${altTextMaxLength} characters.`,
              },
            ],
          },
          {
            label: "Announcement",
            name: "announcement",
            file: "src/customisations/announcement.json",
            fields: [
              {
                label: "Message",
                name: "message",
                widget: "string",
                required: false,
                pattern: announcementMessageValidation,
                hint: `Enter a message, up to ${announcementMessageMaxLength} characters.`,
              },
              {
                label: "Url",
                name: "url",
                widget: "string",
                hint: "Enter the full URL, including http:// or https://",
                required: false,
              },
              {
                label: "Expiry",
                name: "expiry",
                widget: "datetime",
                hint: `When should the announcement be removed from the website`,
                required: false,
                date_format: "YYYY-MM-DD",
              },
            ],
          },
          {
            label: "Form",
            name: "contact-form",
            file: "src/customisations/contact-form.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "text",
                pattern: subTitleValidation,
                hint: `Enter a subtitle, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Email Label",
                name: "emailLabel",
                widget: "string",
                pattern: labelValidation,
                hint: `Label text for the email field, ${labelMaxLength} characters max.`,
              },
              {
                label: "Email Placeholder",
                name: "emailPlaceholder",
                widget: "string",
                pattern: placeholderValidation,
                hint: `Placeholder text for the email field, ${placeholderMaxLength} characters max.`,
              },
              {
                label: "Name Label",
                name: "nameLabel",
                widget: "string",
                pattern: labelValidation,
                hint: `Label text for the name field, ${labelMaxLength} characters max.`,
              },
              {
                label: "Name Placeholder",
                name: "namePlaceholder",
                widget: "string",
                pattern: placeholderValidation,
                hint: `Placeholder text for the name field, ${placeholderMaxLength} characters max.`,
              },
              {
                label: "Subject Label",
                name: "sujectLabel",
                widget: "string",
                pattern: labelValidation,
                hint: `Label text for the subject field, ${labelMaxLength} characters max.`,
              },
              {
                label: "Subject Options",
                name: "subjectOptions",
                widget: "list",
                allow_add: true,
                fields: [
                  {
                    label: "Label",
                    name: "label",
                    widget: "string",
                    pattern: labelValidation,
                    hint: `Label text for the option, ${labelMaxLength} characters max.`,
                  },
                ],
              },
              {
                label: "Message Label",
                name: "messageLabel",
                widget: "string",
                pattern: labelValidation,
                hint: `Label text for the message field, ${buttonMaxLength} characters max.`,
              },
              {
                label: "Message Placeholder",
                name: "messagePlaceholder",
                widget: "string",
                pattern: placeholderValidation,
                hint: `Placeholder text for the message field, ${placeholderMaxLength} characters max.`,
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                pattern: buttonValidation,
                hint: `Text for the button label, ${buttonMaxLength} characters max.`,
              },
              {
                label: "Privacy Notice",
                name: "privacyNotice",
                widget: "string",
                pattern: labelValidation,
                hint: `Privacy notice text below the submit button, ${buttonMaxLength} characters max.`,
              },
            ],
          },
          {
            label: "Footer",
            name: "footer",
            file: "src/customisations/footer.json",
            fields: [
              {
                label: "Links",
                name: "links",
                widget: "list",
                allow_add: true,
                fields: [
                  {
                    label: "Label",
                    name: "text",
                    widget: "string",
                    pattern: labelValidation,
                    hint: `Label text for the link, ${labelMaxLength} characters max.`,
                  },
                  {
                    label: "Url",
                    name: "url",
                    widget: "string",
                    hint: "Enter the full URL, including http:// or https://",
                  },
                  {
                    label: "Target",
                    name: "target",
                    widget: "select",
                    default: ["_blank"],
                    options: [
                      { label: "Open in new tab", value: "_blank" },
                      { label: "Open in same window", value: "_self" },
                    ],
                    hint: "We recommend opening internal links in the same window and external links in a new tab.",
                  },
                ],
              },
              {
                label: "Copyright",
                name: "copyright",
                widget: "string",
                pattern: labelValidation,
                hint: `Copyright text at the bottom of the page, ${buttonMaxLength} characters max.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "string",
                pattern: subTitleValidation,
                hint: `Text for the footer section, up to ${subtitleMaxLength} characters.`,
              },
            ],
          },

          {
            label: "Hero",
            name: "hero",
            file: "src/customisations/hero.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Line One",
                name: "lineOne",
                widget: "text",
                pattern: subTitleValidation,
                hint: `First line of text, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Line Two",
                name: "lineTwo",
                widget: "text",
                pattern: subTitleValidation,
                hint: `Second line of text, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                pattern: buttonValidation,
                hint: `Text for the button label, ${buttonMaxLength} characters max.`,
              },
              {
                label: "Image Alt Text",
                name: "imageAlt",
                widget: "string",
                pattern: altTextValidation,
                hint: `Describe the hero image for accessibility, up to ${altTextMaxLength} characters.`,
              },
            ],
          },
          {
            label: "Join CTA",
            name: "join-cta",
            file: "src/customisations/join-cta.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "text",
                pattern: subTitleValidation,
                hint: `Enter a subtitle, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                pattern: buttonValidation,
                hint: `Text for the button label, ${buttonMaxLength} characters max.`,
              },
            ],
          },
          {
            label: "Sections",
            name: "sections",
            file: "src/customisations/sections.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "text",
                pattern: subTitleValidation,
                hint: `Enter a subtitle, up to ${subtitleMaxLength} characters.`,
              },
            ],
          },
          {
            label: "SEO",
            name: "seo",
            file: "src/customisations/seo.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Description",
                name: "description",
                widget: "text",
                pattern: [".{,500}", "Must have no more than 500 characters"],
                hint: `Provide a description, up to 500 characters.`,
              },
            ],
          },
          {
            label: "Site",
            name: "site",
            file: "src/customisations/site.json",
            fields: [
              {
                label: "Url",
                name: "url",
                widget: "string",
                hint: "Enter the full URL, including http:// or https://",
              },
              {
                label: "Group Name",
                name: "groupName",
                widget: "string",
                pattern: subTitleValidation,
                hint: `Enter the name of the group, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Primary",
                name: "primary",
                widget: "color",
                default: "#000000",
                allowInput: true,
                hint: "Select the main color for your scarfs.",
              },
              {
                label: "Primary Foreground",
                name: "primaryForeground",
                widget: "color",
                default: "#fffffff",
                allowInput: true,
                hint: "Pick a contrasting color. Use white (#ffffff) or black (#000000) if unsure.",
              },
              {
                label: "Logo Alt Text",
                name: "logoAlt",
                widget: "string",
                pattern: altTextValidation,
                hint: `Describe the logo for accessibility, up to ${altTextMaxLength} characters.`,
              },
              {
                label: "Charity Number",
                name: "charityNumber",
                widget: "string",
                pattern: numberValidation,
                hint: "Enter the official charity registration number.",
              },
              {
                label: "Github User",
                name: "githubUser",
                widget: "string",
              },
              {
                label: "Github Repo",
                name: "githubRepo",
                widget: "string",
              },
            ],
          },
          {
            label: "Success",
            name: "success",
            file: "src/customisations/success.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "string",
                pattern: subTitleValidation,
                hint: `Enter a subtitle, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                pattern: buttonValidation,
                hint: `Text for the button label, ${buttonMaxLength} characters max.`,
              },
            ],
          },
          {
            label: "Error",
            name: "error",
            file: "src/customisations/error.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "string",
                pattern: subTitleValidation,
                hint: `Enter a subtitle, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                pattern: buttonValidation,
                hint: `Text for the button label, ${buttonMaxLength} characters max.`,
              },
            ],
          },
          {
            label: "404",
            name: "404",
            file: "src/customisations/404.json",
            fields: [
              {
                label: "Title",
                name: "title",
                widget: "string",
                pattern: titleValidation,
                hint: `Enter a title between ${titleMinLength} and ${titleMaxLength} characters.`,
              },
              {
                label: "Subtitle",
                name: "subtitle",
                widget: "string",
                pattern: subTitleValidation,
                hint: `Enter a subtitle, up to ${subtitleMaxLength} characters.`,
              },
              {
                label: "Button",
                name: "button",
                widget: "string",
                pattern: buttonValidation,
                hint: `Text for the button label, ${buttonMaxLength} characters max.`,
              },
            ],
          },
        ],
      },
    ],
  });

  return new Response(String(doc), {
    headers: {
      "Content-Type": "text/yaml",
    },
  });
}
