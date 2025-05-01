import { Schema, SchemaTypes } from "mongoose";
import { IWorkshopSlotModel } from "../models/workshop-slot.model";

export const workshopSlotSchema = new Schema<IWorkshopSlotModel>({
    workshopId: {type: SchemaTypes.ObjectId, ref: "Workshop", required: true},
    date: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    serviceType: {type: String, enum: ["basic", "interim", "full"], required: true},
    maxBookings: {type: Number,default: 1},
    currentBookings: {type: Number, default: 0},
    isBooked: {type: Boolean, default: false},
    isAvailable: {type: Boolean}
})