import { NextFunction, Request, Response } from "express";
import { blockStatusMiddleware, healthController, workshopController } from "../../di/resolver";
import { BaseRoute } from "../base.route";

export class PublicRoute extends BaseRoute {

    constructor() {
        super();
    }

    protected initializeRoute(): void {
        this.router.get("/workshops/featured", blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            workshopController.getFeaturedWorkshops(req, res, next);
        })

        this.router.get("/workshop-details/:id", blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            workshopController.getWorkshopDetails(req, res, next)
        })

        this.router.get("/all-workshops", blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            workshopController.getAllWorkshopsWithRating(req, res, next)
        })

        this.router.get("/pagination-demo", (req: Request, res: Response, next: NextFunction) => {
            healthController.paginationDemo(req, res, next);
        })
    }
}