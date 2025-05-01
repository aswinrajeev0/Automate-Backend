import { inject, injectable } from "tsyringe";
import { IBookSlotUseCase } from "../../entities/useCaseInterfaces/bookings/slot-book.usecase.interface";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingModel } from "../../frameworks/database/mongoDB/models/booking.model";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";

@injectable()
export class BookSlotUseCase implements IBookSlotUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
        @inject("ISlotRepository") private _slotRepo: ISlotRepository
    ){}

    async execute(data: Partial<IBookingEntity>): Promise<IBookingModel> {
        const bookingId = generateUniqueId("bkng");
        const bookingData = {
            ...data,
            bookingId,
        }
        const isBooked = await this._bookingRepo.findOne({date: data.date, time: data.time, endTime: data.endTime, status: { $nin: ["cancelled", "completed"] }});
        if(isBooked){
            throw new CustomError(
                ERROR_MESSAGES.SLOT_ALREADY_BOOKED,
                HTTP_STATUS.CONFLICT
            )
        }
        const booking = await this._bookingRepo.save(bookingData);
        await this._slotRepo.findByIdAndUpdate(data.slotId as string, {isAvailable: false, isBooked: true})
        return booking
    }
}