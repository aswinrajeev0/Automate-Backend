export interface IChangeWorkshopPasswordUseCase {
    execute(workshopId: string, data: { oldPassword: string, newPassword: string, confirmPassword: string }): Promise<void>
}