import { inject, injectable } from "tsyringe";
import { ICustomerGrowthDataUseCase } from "../../entities/useCaseInterfaces/customer/customer-growth-data.usecase.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";

@injectable()
export class CustomerGrowthDataUseCase implements ICustomerGrowthDataUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ) { }

    async execute(filter: string): Promise<{ name: string; customers: number; }[]> {
        let groupStage;

        if (filter === 'yearly') {
            groupStage = {
                _id: { year: { $year: "$createdAt" } },
                count: { $sum: 1 }
            };
        } else {
            groupStage = {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                count: { $sum: 1 }
            };
        }

        const customerData = await this._customerRepo.findCustomerGrowthData(groupStage, filter);

        return customerData;
    }
}