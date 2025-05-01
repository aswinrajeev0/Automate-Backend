export interface IWorkshopDashboardUseCase {
    dashboardData(workshopId: string): Promise<any>;
    getGrowthChartData(workshopId: string, timeframe: 'week' | 'month' | 'year'): Promise<{ name: string; bookings: number; requests: number }[]>;
    getEarningsData(workshopId: string, timeFrame: "week" | "month" | "year"): Promise<{name: string; earnings: number}[]>
}