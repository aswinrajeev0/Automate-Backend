import { inject, injectable } from "tsyringe";
import { IHandelFavoritesUseCase } from "../../entities/useCaseInterfaces/favorites/handle-favorites.usecase.interface";
import { IFavoritesRepository } from "../../entities/repositoryInterfaces/favorites/favorites.repository.interface";

@injectable()
export class HandelFavoritesUseCase implements IHandelFavoritesUseCase {
    constructor(
        @inject("IFavoritesRepository") private _favoriteRepo: IFavoritesRepository,
    ){}

    async addToFavorites(customerId: string, workshopId: string): Promise<void> {
        await this._favoriteRepo.addToFavorites(customerId, workshopId)
    }

    async removeFromFavorites(customerId: string, workshopId: string): Promise<void> {
        await this._favoriteRepo.removeFromFavorite(customerId, workshopId);
    }

    async isWorkshopFavorite(customerId: string, workshopId: string): Promise<boolean> {
        const favorite = await this._favoriteRepo.findOne(customerId);
        if(!favorite) {
            return false
        }
        return favorite.workshops.some(w => w.toString() === workshopId)
    }

    async getFavoriteWorkshopsId(customerId: string): Promise<string[]> {
        const favorite = await this._favoriteRepo.findOne(customerId);
        return favorite?.workshops || [];
    }
}