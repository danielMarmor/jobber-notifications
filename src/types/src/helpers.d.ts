import { IEmailLocals } from "@danielmarmor/jobber-shared";
declare const emailTemplates: (template: string, reciever: string, locals: IEmailLocals) => Promise<void>;
export { emailTemplates };
