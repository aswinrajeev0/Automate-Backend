import { Schema } from "mongoose";
import { IFavoriteModel } from "../models/favorite-workshops.model";

export const favoriteSchema = new Schema<IFavoriteModel>({
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    workshops: [
        {type: Schema.Types.ObjectId, ref: "Workshop"}
    ]
}, {
    timestamps: true
})