import { inject, injectable } from "tsyringe";
import { IGetBookedSlotsUseCase } from "../../entities/useCaseInterfaces/bookings/get-booked-slots.usecase.interface";
import { IBookingModel } from "../../frameworks/database/mongoDB/models/booking.model";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { date } from "zod";

@injectable()
export class GetBookedSlotsUseCase implements IGetBookedSlotsUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository
    ) { }

    async execute(workshopId: string, type: string): Promise<IBookingModel[]> {

        if (!workshopId) {
            throw new CustomError(
                ERROR_MESSAGES.ID_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if (!type) {
            throw new CustomError(
                ERROR_MESSAGES.MISSING_PARAMETERS,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const now = new Date();
        const slots = await this._bookingRepo.findUpcomingBookings({ workshopId, type, date: { $gte: now },  })

        if (!slots) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        return slots
    }
}