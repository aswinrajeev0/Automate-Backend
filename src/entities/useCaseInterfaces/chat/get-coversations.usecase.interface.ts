import { IConversationModel } from "../../../frameworks/database/mongoDB/models/conversation.model";

export interface IGetConversationsUseCase {
    execute(userId: string, userType: string): Promise<IConversationModel[]>;
}