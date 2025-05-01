import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { generateUniqueId } from "../../../frameworks/security/uniqueuid.bcrypt";
import { CustomerDTO } from "../../../shared/dtos/auth.dto";
import { ICustomerEntity } from "../../../entities/models/customer.entity";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { ICustomerModel } from "../../../frameworks/database/mongoDB/models/customer.model";

export interface ICustomerRegisterStrategy {
    register(user: CustomerDTO): Promise<ICustomerModel | void>;
}

@injectable()
export class CustomerRegisterStrategy implements ICustomerRegisterStrategy {
    constructor(
        @inject("ICustomerRepository") private customerRepository: ICustomerRepository,
        @inject("IPasswordBcrypt") private passwordBcrypt: IBcrypt,
        @inject("IWalletRepository") private _walletRepo: IWalletRepository
    ) { }

    async register(user: CustomerDTO): Promise<ICustomerModel | void> {
        const existingCustomer = await this.customerRepository.findByEmail(user.email);
        if (existingCustomer) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_EXISTS,
                HTTP_STATUS.CONFLICT
            )
        }
        const { name, email, phoneNumber, password } = user as CustomerDTO

        let hashedPassword = null;
        if (password) {
            hashedPassword = await this.passwordBcrypt.hash(password)
        }

        const customerId = generateUniqueId();

        const newCustomer = await this.customerRepository.save({
            name,
            email,
            phone: phoneNumber,
            password: hashedPassword ?? "",
            customerId
        })

        console.log(newCustomer)

        await this._walletRepo.save({
            walletId: generateUniqueId("wlt"),
            customerId: newCustomer._id.toString(),
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return newCustomer
    }
}