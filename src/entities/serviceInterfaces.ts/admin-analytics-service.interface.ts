export interface IAdminAnalyticsService {
    getTotalCustomers(): Promise<number>;
    getTotalWorkshops(): Promise<number>;
    getTotalRequests(): Promise<number>;
    getTotalBookings(): Promise<number>;
    getTotalEarnings(): Promise<number>;
    workshopGrowthData(groupStage: any, filter: string): Promise<{ name: string; workshops: number; }[]>
}