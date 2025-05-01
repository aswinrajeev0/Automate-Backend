import { Schema } from "mongoose";
import { ICustomerModel } from "../models/customer.model";

export const customerSchema = new Schema<ICustomerModel>({
    customerId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String},
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    image: { type: String },
    isBlocked: { type: Boolean, default: false },
    bio: {type: String},
    country: {type: String},
    state: {type: String},
    city: {type: String},
    streetAddress: {type: String},
    buildingNo: {type: String}
}, {
    timestamps: true
})