import { NextFunction, Request, Response } from "express";

export interface IAdminController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>
    logout(req: Request, res: Response, next: NextFunction): Promise<void>
    handleRefreshToken(req: Request, res: Response, next: NextFunction): void;
    dashboardData(req: Request, res: Response, next: NextFunction): Promise<void>;
    workshopGrowthData(req: Request, res: Response, next: NextFunction): Promise<void>;
    reportPageData(req: Request, res: Response, next: NextFunction): Promise<void>;
    reportPageRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    reportPageBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    reportDownload(req: Request, res: Response, next: NextFunction): Promise<void>;
}