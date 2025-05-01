import { inject, injectable } from "tsyringe";
import { IAllAdminBookingsUseCase } from "../../entities/useCaseInterfaces/bookings/all-admin-bookings.usecase.interface";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingModel } from "../../frameworks/database/mongoDB/models/booking.model";

@injectable()
export class AllAdminBookingsUseCase implements IAllAdminBookingsUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
    ) { }

    async execute(skip: number, limit: number, filterString: string): Promise<{bookings: IBookingModel[]; totalBookings: number}> {
        const filter: any = {}
        if(filterString) {
            filter.status = filterString
        }

        const {bookings, totalBookings } = await this._bookingRepo.findAllAdminBookings(filter, skip, limit);

        return {bookings, totalBookings}

    }
}