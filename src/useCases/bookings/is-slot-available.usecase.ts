import { inject, injectable } from "tsyringe";
import { IIsSlotAvailableUseCase } from "../../entities/useCaseInterfaces/bookings/is-slot-available.usecase";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";

@injectable()
export class IsSlotAvailableUseCase implements IIsSlotAvailableUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository
    ){}

    async execute(data: { date: Date; time: string; endTime: string; }): Promise<boolean> {
        const booking = await this._bookingRepo.findOne({date: data.date, time: data.time, endTime: data.endTime});
        return booking ? false : true;
    }
}