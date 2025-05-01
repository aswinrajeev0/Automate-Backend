export interface ICustomerResetPasswordUseCase {
    execute(token: string, password: string, cpassword: string): Promise<void>
}