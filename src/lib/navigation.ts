import type { NavigationLink } from "basecamp/models";

export const HEADER_LINKS: NavigationLink[] = [
    {
        text: "Our Sections",
        url: "/#sections",
        target: "_self",
    },
    {
        text: "Find Us",
        url: "/#address",
        target: "_self",
    },
    {
        text: "Get in Touch",
        url: "/#contact",
        target: "_self",
    },
    {
        text: "Our History",
        url: "/our-history",
        target: "_self",
    },
]

export const FOOTER_LINKS: NavigationLink[] = [
    {
        target: "_blank",
        text: "Accounts and Annual Returns",
        url: "https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/3997492/accounts-and-annual-returns",
    },
    {
        target: "_self",
        text: "Privacy Policy",
        url: "/privacy-policy",
    },
    {
        target: "_blank",
        text: "Runnymede District",
        url: "http://runnymedescouts.org.uk/",
    },
    {
        target: "_blank",
        text: "Surrey County",
        url: "http://www.surrey-scouts.org.uk/",
    },
    {
        target: "_blank",
        text: "The Scout Association",
        url: "http://www.scouts.org.uk/",
    },
]