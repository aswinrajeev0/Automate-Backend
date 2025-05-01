import { IBookingModel } from "../../../frameworks/database/mongoDB/models/booking.model";
import { IBookingEntity } from "../../models/booking.entity";

export interface IBookingRepository {
    find(condition: Partial<IBookingEntity>): Promise<IBookingModel[]>;
    save(data: Partial<IBookingEntity>): Promise<IBookingModel>;
    findOneAndDelete(filter: Partial<IBookingEntity>): Promise<IBookingModel | null>;
    findUpcomingBookings(filter: any): Promise<IBookingModel[]>
    findAllWorkshopBookings(filter: Partial<IBookingEntity>, skip: number, limit: number): Promise<{bookings: IBookingModel[]; total: number}>;
    findOneAndUpdate(filter: Partial<IBookingEntity>,update: Partial<IBookingEntity>): Promise<IBookingModel | null>;
    findOne(filter: any): Promise<IBookingModel | null>;
    findAllCustomerBookings(customerId: string, skip: number, limit: number): Promise<{bookings: IBookingModel[]; total: number}>;
    findAllAdminBookings(filter: Partial<IBookingEntity>, skip: number, limit: number): Promise<{bookings: IBookingModel[]; totalBookings: number}>;
    totalBookings(filter: Partial<IBookingEntity>): Promise<number>
}