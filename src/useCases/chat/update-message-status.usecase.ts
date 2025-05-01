import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../entities/repositoryInterfaces/chat/chat-repository.interface";
import { IUpdateMessageStatusUseCase } from "../../entities/useCaseInterfaces/chat/update-message-status.usecase.interface";

@injectable()
export class UpdateMessageStatusUseCase implements IUpdateMessageStatusUseCase {
    constructor(
        @inject("IChatRepository") private _chatRepo: IChatRepository
    ) {}

    async markMessageAsRead(conversationId: string, userType: string): Promise<void> {
        await this._chatRepo.markMessagesAsRead(conversationId, userType);
    }
}