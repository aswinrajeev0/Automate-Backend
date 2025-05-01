import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IFinishedJobsUseCase {
    execute(
        workshopId: string,
        pageNumber: number,
        pageSize: number,
        searchTerm: string
    ): Promise<{ requests: IRequestModel[]; total: number }>
}