import * as connection from '@notifications/queues/connection';
import { consumeAuthEmailMessages } from '@notifications/queues/email.queue';
import amqp from 'amqplib';

jest.mock("../connection");
jest.mock("amqplib");
jest.mock("@danielmarmor/jobber-shared");

describe("Email Consumer", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("consumeAuthEmailMessages method", () => {
        it("should be called", async () => {
            const channel = {
                assertExchange: jest.fn(),
                publish: jest.fn(),
                assertQueue: jest.fn(),
                bindQueue: jest.fn(),
                consume: jest.fn(),
            };
            jest.spyOn(channel, 'assertExchange');
            jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
            jest.spyOn(connection, 'createConnection').mockReturnValue(channel as never);
            //PARAM FOR UNIT
            const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
            //THIS IS THE UNIT =>
            await consumeAuthEmailMessages(connectionChannel!);
            //THESE ARE THE EXPECTED RESUTLS =>
            expect(connectionChannel!.assertExchange).toHaveBeenCalledWith('jobber-email-notification', 'direct');
            expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
            expect(connectionChannel!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobber-email-notification', 'auth-email');
        })
    })
});