import { createTransport, type SentMessageInfo } from "nodemailer";

export function sendEmail(options: {
    smtp: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        }
    },
    mail: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }
}): Promise<SentMessageInfo> {
    try {
        const transporter = createTransport({
            host: options.smtp.host,
            port: options.smtp.port,
            secure: true,
            auth: {
                user: options.smtp.auth.user,
                pass: options.smtp.auth.pass
            },
        });

        return transporter.sendMail({
            from: options.mail.from,
            to: options.mail.to,
            subject: options.mail.subject,
            html: options.mail.html
        });

    } catch (error) {
        return Promise.reject(error);
    }
}