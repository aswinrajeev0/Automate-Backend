import { IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";
import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IAdminReportUseCase {
    reportData(): Promise<{
        totalBookingRevenue: number;
        totalRequestRevenue: number;
        totalRevenue: number;
        totalGST: number;
        totalRequests: number;
        totalBookings: number;
    }>;
    allRequests(startDate: Date, endDate: Date, skip: number, limit: number): Promise<{requests: IRequestModel[]; totalRequests: number}>;
    allBookings(startDate: Date, endDate: Date, skip: number, limit: number): Promise<{bookings: IBookingModel[]; totalBookings: number}>;
    downloadPdf(startDate: string, endDate: string, serviceType: string): Promise<string>;
}