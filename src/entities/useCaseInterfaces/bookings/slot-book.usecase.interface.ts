import { IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";
import { IBookingEntity } from "../../models/booking.entity";

export interface IBookSlotUseCase {
    execute(data:Partial<IBookingEntity>): Promise<IBookingModel>
}