import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IRejectRequestUSeCase {
    execute(requestId: string): Promise<IRequestModel>
}