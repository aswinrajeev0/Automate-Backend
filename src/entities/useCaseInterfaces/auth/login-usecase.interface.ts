import { IUserEntity } from "../../../entities/models/user.entity"
import { CustomerLoginDTO } from "../../../shared/dtos/auth.dto"
import { ICustomerEntity } from "../../models/customer.entity"

export interface ILoginCustomerUseCase {
    execute(user: CustomerLoginDTO): Promise<Partial<ICustomerEntity>>
}