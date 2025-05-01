import { inject, injectable } from "tsyringe";
import { IGetMessagesUseCase } from "../../entities/useCaseInterfaces/chat/get-messages.usecase.interface";
import { IMessageModel } from "../../frameworks/database/mongoDB/models/conversation.model";
import { IChatRepository } from "../../entities/repositoryInterfaces/chat/chat-repository.interface";

@injectable()
export class GetMessagesUseCase implements IGetMessagesUseCase {
    constructor(
        @inject("IChatRepository") private _charRepo: IChatRepository
    ){}

    async execute(conversationId: string): Promise<IMessageModel[]> {
        const messages = await this._charRepo.getMessages(conversationId);
        return messages
    }
}