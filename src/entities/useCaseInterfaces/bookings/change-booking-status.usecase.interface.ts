import { BookingDto } from "../../../shared/dtos/booking.dto";

export interface IChangeBookingStatusUseCase {
    execute(bookingId: string, status: string): Promise<BookingDto>
}