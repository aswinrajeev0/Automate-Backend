import { IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";

export interface IGetBookedSlotsUseCase {
    execute(workshopId: string, type: string): Promise<IBookingModel[]>
}