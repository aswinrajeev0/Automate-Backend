import { inject, injectable } from "tsyringe";
import { IDashboardDataUseCase } from "../../entities/useCaseInterfaces/admin/admin-dashboard-data.usecase.interface";
import { IAdminAnalyticsService } from "../../entities/serviceInterfaces.ts/admin-analytics-service.interface";

@injectable()
export class DashboardDataUseCase implements IDashboardDataUseCase {
    constructor(
        @inject("IAdminAnalyticsService") private _adminAnalytics: IAdminAnalyticsService
    ) { }

    async dashboardData(): Promise<{
        totalCustomers: number;
        totalWorkshops: number;
        totalBookings: number;
        totalRequests: number;
        totalEarnings: number;
    }> {
        const totalCustomers = await this._adminAnalytics.getTotalCustomers();
        const totalWorkshops = await this._adminAnalytics.getTotalWorkshops();
        const totalRequests = await this._adminAnalytics.getTotalRequests();
        const totalBookings = await this._adminAnalytics.getTotalBookings();
        const totalEarnings = await this._adminAnalytics.getTotalEarnings();

        return {
            totalCustomers,
            totalWorkshops,
            totalBookings,
            totalRequests,
            totalEarnings
        }
    }

    async workshopData(filter: string): Promise<{ name: string; workshops: number; }[]> {
        let groupStage;

        if (filter === 'yearly') {
            groupStage = {
                _id: { year: { $year: "$createdAt" } },
                count: { $sum: 1 }
            };
        } else {
            groupStage = {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            };
        }

        const workshopData = await this._adminAnalytics.workshopGrowthData(groupStage, filter);

        return workshopData
    }
}