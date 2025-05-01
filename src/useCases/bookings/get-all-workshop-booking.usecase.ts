import { inject, injectable } from "tsyringe";
import { IGetAllWorkshopBookingUseCase } from "../../entities/useCaseInterfaces/bookings/get-all-workshop-bookings.usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingDto } from "../../shared/dtos/booking.dto";
import { IPopulatedId } from "../../frameworks/database/mongoDB/models/booking.model";

@injectable()
export class GetAllWorkshopBookingUseCase implements IGetAllWorkshopBookingUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository
    ) { }

    async execute(workshopId: string, skip: number, limit: number, searchString: string = "", status: string = ""): Promise<{ bookings: BookingDto[]; total: number }> {
        const filter: any = {
            workshopId,
        }

        if(status){
            filter.status = status
        }

        if (searchString) {
            filter.$or = [
                { name: { $regex: searchString, $options: "i" } },
                { bookingId: { $regex: searchString, $options: "i" } }
            ]
        }
        const { bookings: paginatedBookings, total } = await this._bookingRepo.findAllWorkshopBookings(filter, skip, limit)

        const bookings = paginatedBookings.map((booking) => ({
            customer: (booking.customerId as IPopulatedId).name,
            customerId: (booking.customerId as IPopulatedId)._id.toString(),
            customerPhone: (booking.customerId as IPopulatedId).phone,
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

        return {bookings, total };
    }
}