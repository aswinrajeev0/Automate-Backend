import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IWorkshopSignupUseCase {
    execute(workshop: Partial<IWorkshopEntity>): Promise<IWorkshopEntity>;
}