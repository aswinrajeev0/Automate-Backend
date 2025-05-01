import { inject, injectable } from "tsyringe";
import { IGetConversationsUseCase } from "../../entities/useCaseInterfaces/chat/get-coversations.usecase.interface";
import { ConversationModel, IConversationModel } from "../../frameworks/database/mongoDB/models/conversation.model";
import { IChatRepository } from "../../entities/repositoryInterfaces/chat/chat-repository.interface";

@injectable()
export class GetConversationsUseCase implements IGetConversationsUseCase {
    constructor(
        @inject("IChatRepository") private _chatRepo: IChatRepository,
    ) { }

    async execute(userId: string, userType: string): Promise<IConversationModel[]> {
        const filter = userType === "customer"
            ? { customerId: userId }
            : { workshopId: userId };

        const conversations = await this._chatRepo.findWithMeta(filter, userType as "customer" | "workshop")

        return conversations
    }
}