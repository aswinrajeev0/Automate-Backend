import cors from "cors";
import helmet from "helmet";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { config } from "../../shared/config";

import { CustomerRoute } from "../routes/customer/customer.route";
import { AdminRoute } from "../routes/admin/admin.route";
import { WorkshopRoute } from "../routes/workshop/workshop.route";
import { errorHandler } from "../../interface-adapters/middlewares/error.middleware";
import morganLogger from "./logger";
import { AuthRoute } from "../routes/auth/auth.route";
import { PublicRoute } from "../routes/public/public.route";
import { HealthRoute } from "../routes/base.route";

export class Server {
    private _app: Application;
    constructor() {
        this._app = express();
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    private configureMiddlewares() {
        this._app.use(morganLogger);
        this._app.use(helmet());
        const allowedOrigins = config.cors.ALLOWED_ORIGIN.split(',').map(o => o.trim());
        this._app.use(cors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Authorization', 'Content-Type'],
            credentials: true
        }));
        this._app.use((req: Request, res: Response, next: NextFunction) => {
            express.json()(req, res, next);
        });
        this._app.use(cookieParser());
        this._app.use(rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000
        }));
    }

    private configureRoutes() {
        this._app.use('/api/v1/customer/', new CustomerRoute().router);
        this._app.use('/api/v1/admin/', new AdminRoute().router);
        this._app.use('/api/v1/workshop/', new WorkshopRoute().router);
        this._app.use('/api/v1/auth/', new AuthRoute().router);
        this._app.use('/api/v1/public/', new PublicRoute().router);

        this._app.use('/', new HealthRoute().router)
        // this._app.use("*", notFound);
    }

    private configureErrorHandling(): void {
        this._app.use(errorHandler);
    }

    public getApp(): Application {
        return this._app;
    }
}