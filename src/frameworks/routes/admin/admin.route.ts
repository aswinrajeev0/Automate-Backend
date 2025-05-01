import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "../base.route";
import { adminController, bookingController, customerController, requestController, workshopController } from "../../di/resolver";
import { authenticate, decodeToken } from "../../../interface-adapters/middlewares/auth.midleware";


export class AdminRoute extends BaseRoute {

    constructor() {
        super();
    }

    protected initializeRoute(): void {
        this.router.post('/login', (req: Request, res: Response, next: NextFunction) => {
            adminController.login(req, res, next);
        })

        this.router.get("/customers", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            customerController.getAllCustomers(req, res, next);
        })

        this.router.patch("/customer-status/:userId", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            customerController.updateCustomerStatus(req, res, next);
        })

        this.router.get("/workshops", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            workshopController.getAllWorkshops(req, res, next);
        })

        this.router.patch("/workshop-status/:workshopId", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            workshopController.updateWorkshopStatus(req, res, next);
        })

        this.router.post("/logout", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.logout(req, res, next);
        })

        this.router.patch("/workshop-approval", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            workshopController.updateWorkshopApprovalStatus(req, res, next);
        })

        this.router.post("/refresh-token", decodeToken("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.handleRefreshToken(req, res, next)
        })

        this.router.get("/all-requests", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            requestController.allAdminRequests(req, res, next);
        })

        this.router.get("/all-bookings", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            bookingController.allAdminBookings(req, res, next);
        })

        this.router.get("/customer-growth", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            customerController.customerGrowthData(req, res, next);
        })

        this.router.get("/workshop-growth", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.workshopGrowthData(req, res, next);
        })

        this.router.get("/dashboard-data", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.dashboardData(req, res, next);
        })

        this.router.get("/report-page-data", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.reportPageData(req, res, next);
        })

        this.router.get("/get-report-requests", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.reportPageRequests(req, res, next);
        })

        this.router.get("/get-report-bookings", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.reportPageBookings(req, res, next);
        })

        this.router.get("/report-download", authenticate("admin"), (req: Request, res: Response, next: NextFunction) => {
            adminController.reportDownload(req, res, next);
        })
    }
}