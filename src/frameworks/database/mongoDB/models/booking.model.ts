import { Document, model, ObjectId, Types } from "mongoose";
import { IBookingEntity } from "../../../../entities/models/booking.entity";
import { bookingSchema } from "../schemas/booking.schema";

export interface IPopulatedId {
    _id: Types.ObjectId;
    name: string;
    phone: number;
}

export interface IBookingModel extends Omit<IBookingEntity, "id" | "customerId" | "workshopId">, Document {
    _id: ObjectId | IPopulatedId;
    customerId: ObjectId | IPopulatedId;
    workshopId: ObjectId | IPopulatedId;
}

export const BookingModel = model<IBookingModel>("Booking", bookingSchema)