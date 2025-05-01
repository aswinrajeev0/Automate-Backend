import { Schema, Types } from "mongoose";
import { IBookingModel } from "../models/booking.model";

export const bookingSchema = new Schema<IBookingModel>({
    bookingId: {type: String, required: true},
    customerId: {type: Types.ObjectId, ref: "Customer", required: true},
    workshopId: {type: Types.ObjectId, ref: "Workshop", required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    type: {type: String, required: true},
    endTime: {type: String, required: true },
    duration: {type: Number, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    status: {type: String, enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"], default: "pending"},
    gst: {type: Number},
    slotId: {type: String}  
},{
    timestamps: true
})