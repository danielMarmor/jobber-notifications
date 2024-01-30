import { Channel } from "amqplib";
declare const consumeAuthEmailMessages: (channel: Channel | undefined) => Promise<void>;
declare const consumeOrderEmailMessages: (channel: Channel | undefined) => Promise<void>;
export { consumeAuthEmailMessages, consumeOrderEmailMessages };
