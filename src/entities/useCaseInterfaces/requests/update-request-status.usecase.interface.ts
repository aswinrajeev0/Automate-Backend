import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export type TType =  "on_way" | "in_progress" | "completed" |  "delivered"

export interface IUpdateRequestStatusUseCase {
    execute(requestId: string, status: TType): Promise<IRequestModel>
}