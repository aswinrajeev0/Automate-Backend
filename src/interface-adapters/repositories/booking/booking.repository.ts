import { injectable } from "tsyringe";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntity } from "../../../entities/models/booking.entity";
import { BookingModel, IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";

@injectable()
export class BookingRepository implements IBookingRepository {
    async find(condition: Partial<IBookingEntity>): Promise<IBookingModel[]> {
        const bookings = BookingModel.find(condition);
        return bookings
    }

    async save(data: Partial<IBookingEntity>): Promise<IBookingModel> {
        const booking = await BookingModel.create(data);
        return booking;
    }

    async findOneAndDelete(filter: Partial<IBookingEntity>): Promise<IBookingModel | null> {
        const booking = await BookingModel.findOneAndDelete(filter);
        return booking ? booking : null
    }

    async findUpcomingBookings(filter: any): Promise<IBookingModel[]> {
        const bookings = await BookingModel.find({ ...filter, status: { $nin: ["cancelled"] } });
        return bookings
    }

    async findAllWorkshopBookings(filter: Partial<IBookingEntity>, skip: number, limit: number): Promise<{ bookings: IBookingModel[]; total: number }> {
        const bookings = await BookingModel.find(filter)
            .populate("workshopId", "name")
            .populate("customerId", "name phone")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        const total = await BookingModel.countDocuments(filter)
        return { bookings, total };
    }

    async findOneAndUpdate(filter: Partial<IBookingEntity>, update: Partial<IBookingEntity>): Promise<IBookingModel | null> {
        const booking = await BookingModel.findOneAndUpdate(filter, update).populate("customerId", "name, phone").populate("workshopId", "name");
        return booking
    }

    async findOne(filter: any): Promise<IBookingModel | null> {
        const booking = await BookingModel.findOne(filter);
        return booking
    }

    async findAllCustomerBookings(customerId: string, skip: number, limit: number): Promise<{ bookings: IBookingModel[]; total: number; }> {
        const bookings = await BookingModel.find({ customerId })
            .populate("workshopId", "name phone")
            .populate("customerId", "name phone")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);
        const total = await BookingModel.countDocuments({ customerId });
        return { bookings, total }
    }

    async findAllAdminBookings(filter: Partial<IBookingEntity>, skip: number, limit: number): Promise<{ bookings: IBookingModel[]; totalBookings: number; }> {
        const bookings = await BookingModel.find(filter).populate("customerId", "name phone").populate("workshopId", "name phone").sort({createdAt: -1}).skip(skip).limit(limit);
        const totalBookings = await BookingModel.countDocuments(filter);
        return {bookings, totalBookings}
    }

    async totalBookings(filter: Partial<IBookingEntity>): Promise<number> {
        return await BookingModel.countDocuments(filter);
    }
}