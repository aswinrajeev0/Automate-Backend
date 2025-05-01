
export interface IResetPasswordOtpUseCase {
    execute(email: string): Promise<void>
}