import { inject, injectable } from "tsyringe";
import { IFetchAvailableDatesUseCase } from "../../entities/useCaseInterfaces/slots/fetch-available-dates.usecase.interface";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { format } from "date-fns";

@injectable()
export class FetchAvailableDatesUseCase implements IFetchAvailableDatesUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository,
    ) { }

    async execute(workshopId: string, month: number, year: number, serviceType: string): Promise<string[]> {

        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)

        const slots = await this._slotRepo.find({
            workshopId,
            date: { $gte: format(startDate,"yyyy-MM-dd"), $lte: format(endDate,"yyyy-MM-dd") },
            serviceType,
            isAvailable: true,
            $expr: {
                $lt: ["$currentBookings", "$maxBookings"]
            }
        })

        const uniqueDatesSet = new Set();
        slots.forEach(slot => {
            uniqueDatesSet.add(slot.date);
        });

        const availableDates = Array.from(uniqueDatesSet) as string[];

        return availableDates;
    }
}