import { IFavoriteModel } from "../../../frameworks/database/mongoDB/models/favorite-workshops.model";
import { IFavoriteWorkshops } from "../../../shared/dtos/workshop.dto";

export interface IFavoritesRepository {
    wokrkshops(customerId: string, skip: number, limit: number): Promise<{workshops: IFavoriteWorkshops[]; total: number}>;
    addToFavorites(customerId: string, workshopId: string): Promise<IFavoriteModel | null>;
    removeFromFavorite(customerId: string, workshopId: string): Promise<IFavoriteModel | null>;
    findOne(customerId: string): Promise<IFavoriteModel | null>
}