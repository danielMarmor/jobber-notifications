import { winstonLogger } from "@danielmarmor/jobber-shared"
import 'express-async-errors'
import { Logger } from "winston";
import { config } from "@notifications/config"
import http from 'http';
import { Application } from 'express';
import { healthRoutes } from "./routes";
//import { checkConnection } from "./elasticsrearch";
import { createConnection } from "@notifications/queues/connection";
import {
    consumeAuthEmailMessages,
    consumeOrderEmailMessages
} from "./queues/email.queue";
import { IEmailMessageDetails } from "@danielmarmor/jobber-shared"

const SEVER_PORT = 4001;

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, "notifications server", "debug");

export const start = async (app: Application): Promise<void> => {
    startServer(app);
    app.use("", healthRoutes);
    startQueues();
    startElasticSearch();
}

const startQueues = async (): Promise<void> => {
    const emailChannel = await createConnection();
    await consumeAuthEmailMessages(emailChannel);
    await consumeOrderEmailMessages(emailChannel);
    //TEST - -SEND ENAIL
    await emailChannel!.assertExchange("jobber-email-notification", "direct");

    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=12345abebebebbeb`;
    const authMessageDetails: IEmailMessageDetails = {
        receiverEmail: `${config.SENDER_EMAIL}`,
        verifyLink: verificationLink,
        template: 'verifyEmail'
    }
    // const forgotPaswordDetails: IEmailMessageDetails = {
    //     receiverEmail: `${config.SENDER_EMAIL}`,
    //     resetLink: verificationLink,
    //     template: 'forgotPassword'
    // }
    const authMessage = JSON.stringify(authMessageDetails);
    emailChannel?.publish("jobber-email-notification", "auth-email", Buffer.from(authMessage));


    // await emailChannel!.assertExchange("jobber-order-notification", "direct");
    // const orderMessage = JSON.stringify({ user: 'jobber', service: 'order notification' });
    // emailChannel?.publish("jobber-order-notification", "auth-email", Buffer.from(orderMessage));

}

const startElasticSearch = (): void => {
    //checkConnection();
}

const startServer = (app: Application): void => {
    try {
        const httpServer: http.Server = new http.Server(app);
        logger.info(`Worker with process id ${process.pid} on notification server has started `)
        httpServer.listen(SEVER_PORT, () => {
            logger.info(`notification service running on port ${SEVER_PORT}`)
        })
    }
    catch (error) {
        logger.log("error", "notification service startServer() method", error);
    }
}