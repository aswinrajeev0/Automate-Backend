import { IWorkshopSlotEntity } from "../../models/workshop-slot.entity";

export interface ICreateSlotsUseCase {
    execute(data: Partial<IWorkshopSlotEntity>[]): Promise<void>;
}