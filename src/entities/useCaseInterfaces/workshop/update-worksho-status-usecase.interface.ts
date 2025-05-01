export interface IUpdateWorkshopStatusUseCase {
    execute(workshopId: string): Promise<void>
}