import { IEmailLocals, winstonLogger } from "@danielmarmor/jobber-shared";
import { Logger } from "winston";
import { config } from "@notifications/config";
import { emailTemplates } from "./helpers";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, "notificationsServer mail.transports", "debug");

const sendEmail = async (template: string, reciever: string, locals: IEmailLocals): Promise<void> => {
    try {
        await emailTemplates(template, reciever, locals);
        logger.info("notification service mail sent sucssesfully!");
    } catch (error) {
        logger.log("error", "notification service falied to send mail!", error);
    }
}
export { sendEmail }