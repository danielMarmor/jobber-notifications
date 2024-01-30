import { Channel } from 'amqplib';
declare const createConnection: () => Promise<Channel | undefined>;
export { createConnection };
