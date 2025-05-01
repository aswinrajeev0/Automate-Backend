import { IFavoriteWorkshops } from "../../../shared/dtos/workshop.dto";

export interface IFavoriteWorkshopsUseCase {
    execute(customerId: string, page: number, limit: number): Promise<{workshops: IFavoriteWorkshops[]; total: number}>
}