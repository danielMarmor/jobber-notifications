import express, { Express } from 'express';
import { start } from "@notifications/server";

export const initialize = async () => {
    const app: Express = express();
    start(app);
};

initialize();