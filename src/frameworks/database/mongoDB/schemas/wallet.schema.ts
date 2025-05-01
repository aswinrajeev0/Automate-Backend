import { Schema, Types } from "mongoose";

export const walletSchema = new Schema({
    walletId: {type: String, required: true},
    customerId: {type: Types.ObjectId, ref: "Customer", required: true},
    balance: {type: Number, default: 0}
},{
    timestamps: true
})