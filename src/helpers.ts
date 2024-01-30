import { winstonLogger } from "@danielmarmor/jobber-shared";
import { Logger } from "winston";
import { config } from "@notifications/config";
import nodemailer, { Transporter } from 'nodemailer'
import Email from "email-templates";
import path from 'path'
import { IEmailLocals } from "@danielmarmor/jobber-shared";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, "notifications email templates", "debug");

const emailTemplates = async (template: string, reciever: string, locals: IEmailLocals): Promise<void> => {
    try {
        const smptTransport: Transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASSWORD
            }
        });

        const email: Email = new Email({
            message: {
                from: `Jobber App <>${config.SENDER_EMAIL}`
            },
            send: true,
            preview: false,
            transport: smptTransport,
            views: {
                options: {
                    extension: 'ejs'
                }
            },
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: path.join(__dirname, '../build')
                }
            },
        });
        await email.send({
            template: path.join(__dirname, "..", "src/emails", template),
            message: { to: reciever },
            locals
        });
    }
    catch (error) {
        logger.log("error", "notification service emailTemplates method()", error);
    }
}

export { emailTemplates }