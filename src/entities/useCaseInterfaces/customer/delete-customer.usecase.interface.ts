export interface IDeleteCustomerUseCase {
    execute(userId: string | undefined): Promise<void>
}