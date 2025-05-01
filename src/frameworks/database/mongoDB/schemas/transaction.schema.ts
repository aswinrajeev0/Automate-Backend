import { Schema, Types } from "mongoose";

export const transactionSchema = new Schema({
    transactionId: {type: String, required: true},
    wallet: {type: Types.ObjectId, ref: "Wallet"},
    type: {type: String, enum: ['credit', 'debit'], required: true},
    reference: {type: String},
    description: {type: String},
    amount: {type: Number, required: true}
},{
    timestamps: true
})