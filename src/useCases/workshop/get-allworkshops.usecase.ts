import { PaginatedWorkshops } from "../../entities/models/paginated-workshop.entity";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { IGetAllWorkshopsUseCase } from "../../entities/useCaseInterfaces/workshop/get-allworkshops-usecase.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetAllWorkshopsUseCase implements IGetAllWorkshopsUseCase {

    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ) { }

    async execute(pageNumber: number, pageSize: number, searchTerm: string): Promise<PaginatedWorkshops> {
        let filter: any = {}

        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } }
            ]
        }

        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const limit = validPageSize;

        const { workshops, total } = await this._workshopRepo.find(
            filter,
            skip,
            limit
        );

        const response: PaginatedWorkshops = {
            workshops,
            total: Math.ceil(total / validPageSize),
        };

        return response;
    }
}