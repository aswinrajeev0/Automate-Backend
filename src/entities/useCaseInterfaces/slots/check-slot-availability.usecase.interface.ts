export interface ICheckSlotAvailabilityUseCase {
    execute(slotId: string): Promise<boolean>
}