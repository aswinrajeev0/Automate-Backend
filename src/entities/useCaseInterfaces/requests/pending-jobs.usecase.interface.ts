import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IPendingJobsUseCase {
    execute(
        workshopId: string,
        pageNumber: number,
        pageSize: number,
        searchTerm: string
    ): Promise<{ requests: IRequestModel[]; total: number }>
}