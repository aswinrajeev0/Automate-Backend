import { inject, injectable } from "tsyringe";
import { ICustomerRegisterUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface";
import { ICustomerRegisterStrategy } from "./register-strategies/customer-register.strategy";
import { CustomerDTO } from "../../shared/dtos/auth.dto";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ICustomerEntity } from "../../entities/models/customer.entity";

@injectable()
export class CustomerRegisterUseCase implements ICustomerRegisterUseCase {
    private _strategies: Record<string, ICustomerRegisterStrategy>;
    constructor(
        @inject("CustomerRegisterStrategy") private _customerRegister: ICustomerRegisterStrategy
    ){
        this._strategies = {
            customer: this._customerRegister
        }
    }

    async execute(customer: CustomerDTO): Promise<void> {
        const strategy = this._strategies.customer;
        await strategy.register(customer)
    }
}