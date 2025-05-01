import { Request, Response, NextFunction } from "express";
import { BaseRoute } from "../base.route";
import { authController } from "../../di/resolver";


export class AuthRoute extends BaseRoute {
    constructor() {
        super()
    }

    protected initializeRoute(): void {
        this.router.get("/generate-signature", (req: Request, res: Response, next: NextFunction) => {
            authController.generateToken(req, res, next);
        })
    }
}