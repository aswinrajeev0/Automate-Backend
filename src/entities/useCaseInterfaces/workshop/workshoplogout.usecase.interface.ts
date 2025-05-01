import { UserRequest } from "../../../interface-adapters/middlewares/auth.midleware";

export interface IWorkshopLogoutUseCase {
    execute(user: UserRequest): Promise<void>
}