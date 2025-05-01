import { injectable } from "tsyringe";
import { IRequestRepository } from "../../../entities/repositoryInterfaces/requests/request-repository.interface";
import { IRequestEntity } from "../../../entities/models/request.entity";
import { IRequestModel, RequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

@injectable()
export class RequestRepository implements IRequestRepository {
    async save(data: Partial<IRequestEntity>): Promise<IRequestModel> {
        const request = await RequestModel.create(data);
        return request
    }

    async find(condition: Partial<IRequestEntity>, skip: number, limit: number): Promise<{requests: IRequestModel[] | []; total: number}> {
        const requests = await RequestModel.find(condition).sort({createdAt: -1}).populate("workshopId", "name").populate("customerId", "name").skip(skip).limit(limit);
        const total = await RequestModel.countDocuments(condition)
        return {requests, total};
    }

    async findOne(filter: Partial<IRequestEntity>): Promise<IRequestModel | null> {
        const request = await RequestModel.findOne(filter);
        return request ? request : null
    }

    async findOneAndUpdate(filter: Partial<IRequestEntity>, update: Partial<IRequestEntity>): Promise<IRequestModel | null> {
        const request = await RequestModel.findOneAndUpdate(filter, update);
        return request ? request : null;
    }

    async totalRequests(filter: Partial<IRequestEntity>): Promise<number> {
        return await RequestModel.countDocuments(filter);
    }
}