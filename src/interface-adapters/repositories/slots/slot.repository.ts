import { injectable } from "tsyringe";
import { ISlotRepository } from "../../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { IWorkshopSlotEntity } from "../../../entities/models/workshop-slot.entity";
import { IWorkshopSlotModel, WorkshopSlotModel } from "../../../frameworks/database/mongoDB/models/workshop-slot.model";

@injectable()
export class SlotRepository implements ISlotRepository {

    async getAllWorkshopSlots(filter: Partial<IWorkshopSlotEntity>): Promise<IWorkshopSlotModel[]> {
        const slots = await WorkshopSlotModel.find(filter);
        return slots;
    }

    async createSlots(data: Partial<IWorkshopSlotEntity>[]): Promise<void> {
        const slots = await WorkshopSlotModel.insertMany(data);
        console.log(slots)
    }

    async deleteSlot(slotId: string): Promise<IWorkshopSlotModel | null> {
        const slot = await WorkshopSlotModel.findByIdAndDelete(slotId);
        return slot ? slot :  null;
    }

    async findByIdAndUpdate(slotId: string, update: Partial<IWorkshopSlotEntity>): Promise<IWorkshopSlotModel | null> {
        const slot = await WorkshopSlotModel.findByIdAndUpdate(slotId, update);
        return slot ? slot : null;
    }

    async find(filter: Partial<IWorkshopSlotEntity>): Promise<IWorkshopSlotModel[]> {
        const slots = await WorkshopSlotModel.find(filter);
        return slots;
    }

    async findById(slotId: string): Promise<IWorkshopSlotModel | null> {
        const slot = await WorkshopSlotModel.findById(slotId);
        return slot
    }
}