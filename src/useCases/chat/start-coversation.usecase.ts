import { inject, injectable } from "tsyringe";
import { IStartConversationUseCase } from "../../entities/useCaseInterfaces/chat/start-chat.usecase.interface";
import { IConversationModel } from "../../frameworks/database/mongoDB/models/conversation.model";
import { IChatRepository } from "../../entities/repositoryInterfaces/chat/chat-repository.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";

@injectable()
export class StartConversationUseCase implements IStartConversationUseCase {
    constructor(
        @inject("IChatRepository") private _chatRepo: IChatRepository,
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository,
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ){}

    async execute(customerId: string, workshopId: string): Promise<IConversationModel> {
        const existingChat = await this._chatRepo.findOne({customerId, workshopId});
        if(existingChat){
            return existingChat
        }

        const customer = await this._customerRepo.findById(customerId);
        const workshop = await this._workshopRepo.findById(workshopId);

        const newChat = await this._chatRepo.createChat({
            customerId,
            customerName: customer?.name,
            workshopId,
            workshopName: workshop?.name
        })

        return newChat;
    }
}