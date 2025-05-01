export interface IDashboardDataUseCase {
    dashboardData(): Promise<{
        totalCustomers: number;
        totalWorkshops: number;
        totalBookings: number;
        totalRequests: number;
    }>

    workshopData(filter: string): Promise<{name: string, workshops: number}[]>
}