import { Channel, ConsumeMessage } from "amqplib";
import { Logger } from "winston";
import { createConnection } from "@notifications/queues/connection";
import { IEmailLocals, winstonLogger } from "@danielmarmor/jobber-shared";
import { config } from "../config";
import { sendEmail } from "../mail.transports";

const logger: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, "notificationEmailConsumer", "debug");

const consumeAuthEmailMessages = async (channel: Channel | undefined): Promise<void> => {
    if (!channel) {
        channel = await createConnection() as Channel;
    }
    //SETTINGS
    const exchange = "jobber-email-notification"
    const routingKey = "auth-email"
    const queueName = "auth-email-queue";
    await channel.assertExchange(exchange, "direct");
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchange, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const message = JSON.parse(msg!.content.toString());
        const { receiverEmail, username, verifyLink, resetLink, template } = message;
        const locals: IEmailLocals = {
            appLink: `${config.CLIENT_URL}`,
            appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
            username,
            verifyLink,
            resetLink
        }
        await sendEmail(template, receiverEmail, locals);
        if (channel) {
            channel.ack(msg!);
        }

        //SEND ENAIL
        //ACCKNOWLEDGE
    });
}

const consumeOrderEmailMessages = async (channel: Channel | undefined): Promise<void> => {
    if (!channel) {
        channel = await createConnection() as Channel;
    }
    //SETTINGS
    const exchange = "jobber-order-notification"
    const routingKey = "order-email"
    const queueName = "order-email-queue";
    await channel.assertExchange(exchange, "direct");
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchange, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const orderDetails = JSON.parse(msg!.content.toString());
        const {
            receiverEmail,
            username,
            template,
            sender,
            appLink,
            appIcon,
            offerLink,
            amount,
            buyerUsername,
            sellerUsername,
            title,
            description,
            deliveryDays,
            orderId,
            orderDue,
            requirements,
            orderUrl,
            originalDate,
            newDate,
            reason,
            subject,
            header,
            type,
            message,
            serviceFee,
            total,
            verifyLink,
            resetLink } = orderDetails;
        const locals: IEmailLocals = {
            sender,
            appLink,
            appIcon,
            offerLink,
            amount,
            buyerUsername,
            sellerUsername,
            title,
            description,
            deliveryDays,
            orderId,
            orderDue,
            requirements,
            orderUrl,
            originalDate,
            newDate,
            reason,
            subject,
            header,
            type,
            message,
            serviceFee,
            total,
            username,
            verifyLink,
            resetLink
        }
        if (template === 'orderPlaced') {
            await sendEmail('orderPlaced', receiverEmail, locals);
            await sendEmail('orderReceipt', receiverEmail, locals);
        }
        else {
            await sendEmail(template, receiverEmail, locals);
        }
        if (channel) {
            channel.ack(msg!);
        }
        //SEND ENAIL
        //ACCKNOWLEDGE
    });
}


export { consumeAuthEmailMessages, consumeOrderEmailMessages }