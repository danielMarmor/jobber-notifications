import { IEmailLocals } from "@danielmarmor/jobber-shared";
declare const sendEmail: (template: string, reciever: string, locals: IEmailLocals) => Promise<void>;
export { sendEmail };
