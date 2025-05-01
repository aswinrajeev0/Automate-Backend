export interface IFetchAvailableDatesUseCase {
    execute(workshopId: string, month: number, year: number, serviceType: string): Promise<string[]>;
}