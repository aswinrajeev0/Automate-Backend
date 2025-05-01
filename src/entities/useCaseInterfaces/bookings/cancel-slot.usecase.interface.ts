import { IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";

export interface ICancelSlotUseCase {
    execute(bookingId: string): Promise<IBookingModel>
}