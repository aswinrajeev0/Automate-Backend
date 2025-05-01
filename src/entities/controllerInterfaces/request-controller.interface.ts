import { NextFunction, Request, Response } from "express";

export interface IRequestController {
    carLift(req: Request, res: Response, next: NextFunction): Promise<void>;
    mobileWorkshop(req: Request, res: Response, next: NextFunction): Promise<void>;
    allPendingRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    requestDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    pendingJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    finishedJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllUserRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    allAdminRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
}