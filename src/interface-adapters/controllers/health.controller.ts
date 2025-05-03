import { injectable } from "tsyringe";
import { IHealthController } from "../../entities/controllerInterfaces/health-controller.interface";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class HealthController implements IHealthController {
    healthCheck(req: Request, res: Response): void {
        const dbStatus = mongoose.connection.readyState === 1 ? "UP" : "DOWN";

        res.status(HTTP_STATUS.OK).json({
            status: "UP",
            database: dbStatus,
            timestamp: new Date().toISOString(),
        });
    }

    async paginationDemo(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = req.query.limit;
            const currentPage = req.query.currentPage;
            const searchQuery = req.query.searchQuery as string;
            const limitNumber = Number(limit);
            const pageNumber = Number(currentPage);
            const skip = (pageNumber - 1) * limitNumber
            const users = await this
        } catch (error) {
            next(error)
        }
    }
}