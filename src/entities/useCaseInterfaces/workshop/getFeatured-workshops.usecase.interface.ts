import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IFeaturedWorkshopsUseCase {
    execute(): Promise<IWorkshopEntity [] | []>
}