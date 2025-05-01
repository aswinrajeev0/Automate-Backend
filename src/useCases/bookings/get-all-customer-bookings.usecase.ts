import { inject, injectable } from "tsyringe";
import { IGetAllCustomerBookingsUseCase } from "../../entities/useCaseInterfaces/bookings/get-all-customer-bookings.usecase.intrface";
import { BookingDto } from "../../shared/dtos/booking.dto";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IPopulatedId } from "../../frameworks/database/mongoDB/models/booking.model";

@injectable()
export class GetAllCustomerBookingsUseCase implements IGetAllCustomerBookingsUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
    ) { }

    async execute(customerId: string, skip: number, limit: number): Promise<{ bookings: BookingDto[], total: number }> {
        const { bookings: allBookings, total } = await this._bookingRepo.findAllCustomerBookings(customerId, skip, limit)
        const bookings = allBookings.map((booking) => ({
            customer: (booking.customerId as IPopulatedId).name,
            customerId: (booking.customerId as IPopulatedId)._id.toString(),
            customerPhone: (booking.customerId as IPopulatedId).phone,
            workshop: (booking.workshopId as IPopulatedId).name,
            workshopId: (booking.workshopId as IPopulatedId)._id.toString(),
            workshopPhone: (booking.workshopId as IPopulatedId).phone,
            bookingId: booking.bookingId,
            price: booking.price,
            gst: booking.gst || 0,
            amount: booking.amount,
            time: booking.time,
            type: booking.type,
            endTime: booking.endTime,
            date: booking.date,
            status: booking.status
        }))

        return { bookings, total }
    }
}