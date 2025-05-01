import { Request, Response, Router } from "express";
import { healthController } from "../di/resolver";

export abstract class BaseRoute {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoute();
    }

    protected abstract initializeRoute(): void;
}

export class HealthRoute extends BaseRoute {
    constructor() {
        super()
    }

    protected initializeRoute(): void {
        this.router.get('/health', (req: Request, res: Response) => {
            healthController.healthCheck(req, res);
        })
    }
}