import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router: Router = express.Router();

export const healthRoutes = (): Router => {
    router.get("/notifications-health", (_req: Request, res: Response) => {
        res.status(StatusCodes.OK).send("Notification service is healthy");
    });
    return router;
}