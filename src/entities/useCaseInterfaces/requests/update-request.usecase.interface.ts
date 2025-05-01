import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IAcceptRequestUseCase {
    execute(requestId: string): Promise<IRequestModel>
}