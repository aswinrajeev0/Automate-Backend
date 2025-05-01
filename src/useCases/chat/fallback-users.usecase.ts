import { inject, injectable } from "tsyringe";
import { IFallBackUsersUseCase } from "../../entities/useCaseInterfaces/chat/fallback-users.usecase.interface";
import { IChatRepository } from "../../entities/repositoryInterfaces/chat/chat-repository.interface";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";

@injectable()
export class FallBackUsersUseCase implements IFallBackUsersUseCase {
    constructor(
        @inject("IChatRepository") private _chatRepo: IChatRepository,
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ) { }

    async execute(userId: string, userType: "customer" | "workshop"): Promise<{ name: string; _id: string; }[]> {
        const conversations = await this._chatRepo.findByUser(userId, userType);

        const connectedUserIds = conversations.map((conv) =>
            userType === "customer" ? conv.workshopId.toString() : conv.customerId.toString()
        );

        if (userType === "customer") {
            return this._workshopRepo.findByIdsNotIn(connectedUserIds);
        } else {
            return this._customerRepo.findByIdsNotIn(connectedUserIds);
        }
    }
}