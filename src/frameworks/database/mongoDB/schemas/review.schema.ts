import { Schema, Types } from "mongoose";

export const reviewSchema = new Schema({
    reviewId: { type: String, required: true },
    workshopId: { type: Types.ObjectId, ref: "Workshop", required: true },
    userId: { type: Types.ObjectId, ref: "Customer", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
}, {
    timestamps: true
});
