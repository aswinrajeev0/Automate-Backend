export interface IAnalyticsService {
    getTotalUniqueCustomers(workshopId: string): Promise<number>;
    getTotalWorkshopEarnings(workshopId: string): Promise<number>;
    getWorkshopStats(workshopId: string): Promise<{
        totalBookings: number;
        totalRequests: number;
    }>
    getGrowthChartData(workshopId: string, timeframe: "week" | "month" | "year"): Promise<{
        name: string;
        bookings: number;
        requests: number;
    }[]>
    getEarningsChartData(
        workshopId: string,
        timeframe: 'week' | 'month' | 'year'
    ): Promise<{ name: string; earnings: number }[]>
}