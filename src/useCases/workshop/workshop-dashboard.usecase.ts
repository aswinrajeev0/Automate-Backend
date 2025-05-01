import { inject, injectable } from "tsyringe";
import { IWorkshopDashboardUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-dashboard.usecase.interface";
import { IAnalyticsService } from "../../entities/serviceInterfaces.ts/anaytic-service.interface";

@injectable()
export class WorkshopDashboardUseCase implements IWorkshopDashboardUseCase {
    constructor(
        @inject("IAnalyticsService") private _analyticalService: IAnalyticsService
    ){}

    async dashboardData (workshopId: string): Promise<{
        totalCustomers: number;
        totalEarnings: number;
        totalBookings: number;
        totalRequests: number;
    }> {
        const totalUniqueCustomers = await this._analyticalService.getTotalUniqueCustomers(workshopId);
        const totalEarnings = await this._analyticalService.getTotalWorkshopEarnings(workshopId);
        const {totalBookings, totalRequests} = await this._analyticalService.getWorkshopStats(workshopId);
        return {
            totalCustomers: totalUniqueCustomers,
            totalEarnings,
            totalBookings,
            totalRequests
        }
    }

    async getGrowthChartData(workshopId: string, timeframe: "week" | "month" | "year"): Promise<{ name: string; bookings: number; requests: number; }[]> {
        const data = await this._analyticalService.getGrowthChartData(workshopId, timeframe);
        return data;
    }

    async getEarningsData(workshopId: string, timeFrame: "week" | "month" | "year"): Promise<{name: string; earnings: number}[]>{
        const data = await this._analyticalService.getEarningsChartData(workshopId, timeFrame);
        return data;
    }
}