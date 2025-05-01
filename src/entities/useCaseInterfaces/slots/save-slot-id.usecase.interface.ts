export interface ISaveSlotIdUseCase {
    execute(slotId: string): Promise<boolean>;
}