import { PaginatedWorkshops } from "../../models/paginated-workshop.entity";

export interface IGetAllWorkshopsUseCase {
    execute(
        pageNumber: number,
        pageSize: number,
        searchTerm: string
    ): Promise<PaginatedWorkshops>
}