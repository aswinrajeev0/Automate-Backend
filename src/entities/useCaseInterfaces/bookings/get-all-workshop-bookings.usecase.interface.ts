import { BookingDto } from "../../../shared/dtos/booking.dto";

export interface IGetAllWorkshopBookingUseCase {
    execute(workshopId: string, skip: number, limit: number, searchString: string, status: string): Promise<{bookings: BookingDto[], total: number}>
}