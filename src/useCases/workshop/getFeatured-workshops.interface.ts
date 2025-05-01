import { inject, injectable } from "tsyringe";
import { IFeaturedWorkshopsUseCase } from "../../entities/useCaseInterfaces/workshop/getFeatured-workshops.usecase.interface";
import { IWorkshopEntity } from "../../entities/models/workshop.entity";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";

@injectable()
export class FeaturedWorkshopsUseCase implements IFeaturedWorkshopsUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ) { }

    async execute(): Promise<IWorkshopEntity[] | []> {
        const filter = { isBlocked: false, approvalStatus: "approved" }
        const {workshops, total} = await this._workshopRepo.find(filter, 0, 4)

        return workshops
    }
}