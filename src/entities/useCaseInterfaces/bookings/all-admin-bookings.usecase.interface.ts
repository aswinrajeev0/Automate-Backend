import { IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";
import { IBookingEntity } from "../../models/booking.entity";

export interface IAllAdminBookingsUseCase {
    execute(skip: number, limit: number, filter: string): Promise<{bookings: IBookingModel[]; totalBookings: number}>;
}