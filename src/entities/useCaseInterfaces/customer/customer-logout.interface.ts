import { UserRequest } from "../../../interface-adapters/middlewares/auth.midleware";

export interface ICustomerLogutUseCase {
    execute(user: UserRequest): Promise<void>
}