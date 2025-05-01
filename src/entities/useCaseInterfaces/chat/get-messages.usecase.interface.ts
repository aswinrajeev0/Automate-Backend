import { IMessageModel } from "../../../frameworks/database/mongoDB/models/conversation.model";

export interface IGetMessagesUseCase {
    execute(conversationId: string): Promise<IMessageModel[]>
}