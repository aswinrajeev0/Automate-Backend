export interface IHandelFavoritesUseCase {
    addToFavorites(customerId: string, workshopId: string): Promise<void>;
    removeFromFavorites(customerId: string, workshopId: string): Promise<void>;
    isWorkshopFavorite(customerId: string, workshopId: string): Promise<boolean>;
    getFavoriteWorkshopsId(customerId: string): Promise<string[]>;
}