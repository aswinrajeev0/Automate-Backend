import { IConversationModel } from "../../../frameworks/database/mongoDB/models/conversation.model";

export interface IStartConversationUseCase {
    execute(customerId: string, workshopId: string): Promise<IConversationModel>;
}