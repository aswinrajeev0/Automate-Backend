export interface IWorkshopResetPasswordUseCase {
    execute(token: string, password: string, cpassword: string): Promise<void>
}