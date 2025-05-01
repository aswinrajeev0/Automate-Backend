import { NextFunction, Request, Response } from "express";

export interface IReviewController {
    submitReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWorkshopReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
}