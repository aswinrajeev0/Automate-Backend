import { BookingDto } from "../../../shared/dtos/booking.dto";

export interface IGetAllCustomerBookingsUseCase {
    execute(customerId: string, skip: number, limit: number): Promise<{bookings: BookingDto[], total: number}>
}