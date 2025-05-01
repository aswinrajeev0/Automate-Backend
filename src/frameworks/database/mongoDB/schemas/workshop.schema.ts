import { Schema } from "mongoose";
import { IWorkshopModel } from "../models/workshop.model";

export const workshopSchema = new Schema<IWorkshopModel>({
    workshopId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String },
    bio: {type: String},
    password: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    buildingNo: { type: String, required: true },
    approvalStatus: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    rejectionReason: {type: String},
    isActive: { type: Boolean, default: false },
    isRejected: {type: Boolean, default: false},
    isBlocked: { type: Boolean, default: false }
}, {
    timestamps: true
})