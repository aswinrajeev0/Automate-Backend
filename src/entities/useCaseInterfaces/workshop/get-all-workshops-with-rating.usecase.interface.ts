import { IWorkshopWithRatings } from "../../models/workshop-with-rating.entity";


export interface IGetAllWorkshopsWithRatingUseCase {
    execute(page: number, limit: number, searchTerm: string, sort: string ): Promise<{workshops: Partial<IWorkshopWithRatings[]>; total: number}>
}