import { inject, injectable } from "tsyringe";
import { IGetAllUserRequestsUseCase } from "../../entities/useCaseInterfaces/requests/get-all-user-requests.usecase.interface";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { IRequestDto } from "../../shared/dtos/request.dto";

@injectable()
export class GetAllUserRequestsUseCase implements IGetAllUserRequestsUseCase {
    constructor(
        @inject("IRequestRepository") private _requestRepo: IRequestRepository,
    ) { }

    async execute(customerId: string, skip: number, limit: number): Promise<{ requests: IRequestDto[]; total: number }> {
        const { requests, total } = await this._requestRepo.find({ customerId }, skip, limit)

        return {
            requests: requests.map((request) => ({
                requestId: request.requestId,
                name: request.name,
                type: request.type as string,
                date: request.createdAt,
                amount: request.amount,
                status: request.status as string,
                workshop: {name: (request.workshopId as any).name},
                carBrand: request.carBrand,
                carType: request.carType,
                gst: request.gst,
                location: request.location,
                vehicleNo: request.vehicleNo,
                description: request.description,
                image: request.image,
                notes: request.notes,
                mobile: request.mobile
            })), total
        }
    }
}