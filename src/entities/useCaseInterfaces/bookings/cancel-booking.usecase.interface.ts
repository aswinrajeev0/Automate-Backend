import { BookingDto } from "../../../shared/dtos/booking.dto";

export interface ICancelBookingUseCase {
    execute(bookingId: string): Promise<BookingDto>
}