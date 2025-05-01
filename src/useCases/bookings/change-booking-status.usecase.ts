import { inject, injectable } from "tsyringe";
import { IChangeBookingStatusUseCase } from "../../entities/useCaseInterfaces/bookings/change-booking-status.usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { BookingDto } from "../../shared/dtos/booking.dto";
import { IPopulatedId } from "../../frameworks/database/mongoDB/models/booking.model";

@injectable()
export class ChangeBookingStatusUseCase implements IChangeBookingStatusUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
    ) { }

    async execute(bookingId: string, status: "confirmed" | "in-progress" | "completed"): Promise<BookingDto> {
        const booking = await this._bookingRepo.findOneAndUpdate({ bookingId }, { status })
        if (!booking) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        return {
            customer: (booking.customerId as IPopulatedId).name,
            customerId: (booking.customerId as IPopulatedId)._id.toString(),
            customerPhone: (booking.customerId as IPopulatedId).phone,
            amount: booking.amount,
            bookingId: booking.bookingId,
            date: booking.date,
            endTime: booking.endTime,
            gst: booking.gst || 0,
            price: booking.price,
            status: booking.status,
            time: booking.time,
            type: booking.type
        }
    }

}