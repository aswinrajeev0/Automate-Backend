export interface ICustomerGrowthDataUseCase {
    execute(filter: string): Promise<{name: string; customers: number}[]>;
}