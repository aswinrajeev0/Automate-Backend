export interface IChangeCustomerPasswordUseCase {
    execute(customerId: string, data: {oldPassword: string, newPassword: string, confirmPassword: string}): Promise<void>
}