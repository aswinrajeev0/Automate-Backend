import { model, ObjectId } from "mongoose";
import { IFavoritesEntity } from "../../../../entities/models/favorite-workshops.entity";
import { favoriteSchema } from "../schemas/favorite-workshop.schema";

export interface IFavoriteModel extends Omit<IFavoritesEntity, "customer"> {
    customer: ObjectId;
}

export const FavoriteModel = model<IFavoriteModel>("FavoriteWorkshop", favoriteSchema)