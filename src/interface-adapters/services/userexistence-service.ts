import { inject, injectable } from "tsyringe";
import { IUserExistenceService } from "../../entities/serviceInterfaces.ts/userExistance-service.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";

@injectable()
export class UserExistenceService implements IUserExistenceService {
    constructor(
        @inject("ICustomerRepository") private _customerRepository: ICustomerRepository,
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ) { }

    async emailExists(email: string): Promise<boolean> {
        const user = await this._customerRepository.findByEmail(email);
        if (user) return true;

        const workshopUser = await this._workshopRepo.findByEmail(email);
        return Boolean(workshopUser);
    }
}