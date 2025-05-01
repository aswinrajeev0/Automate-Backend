import { UserRequest } from "../../../interface-adapters/middlewares/auth.midleware";

export interface IAdminLogoutUseCase {
    execute(user: UserRequest): Promise<void>
}