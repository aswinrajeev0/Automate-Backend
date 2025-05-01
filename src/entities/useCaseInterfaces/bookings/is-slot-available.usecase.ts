export interface IIsSlotAvailableUseCase {
    execute(data: {date: Date, time: string, endTime: string}): Promise<boolean>
}