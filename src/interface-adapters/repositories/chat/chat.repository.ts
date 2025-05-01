import { injectable } from "tsyringe";
import { IChatRepository } from "../../../entities/repositoryInterfaces/chat/chat-repository.interface";
import { ConversationModel, IConversationModel, IMessageModel, MessageModel } from "../../../frameworks/database/mongoDB/models/conversation.model";
import { IConversationEntity } from "../../../entities/models/conversation.entity";

@injectable()
export class ChatRepository implements IChatRepository {
    async find(filter: any): Promise<IConversationModel[]> {
        const conversations = await ConversationModel.find(filter).sort({ createdAt: -1 });
        return conversations
    }

    async findByUser(userId: string, userType: "customer" | "workshop"): Promise<IConversationModel[]> {
        const query = userType === "customer" ? { customerId: userId } : { workshopId: userId };
        return await ConversationModel.find(query);
    }

    async findOne(filter: any): Promise<IConversationModel | null> {
        const chat = await ConversationModel.findOne(filter);
        return chat;
    }

    async createChat(data: Partial<IConversationEntity>): Promise<IConversationModel> {
        const chat = await ConversationModel.create(data);
        return chat;
    }

    async getMessages(conversationId: string): Promise<IMessageModel[]> {
        const messages = await MessageModel.find({ conversationId });
        return messages;
    }

    async findWithMeta(filter: any, userType: "customer" | "workshop"): Promise<IConversationModel[]> {
        const conversations = await ConversationModel.find(filter).populate("customerId", "image").populate("workshopId", "image").sort({updatedAt: -1}).lean();

        const enriched = await Promise.all(conversations.map(async (conv) => {

            const unreadCount = await MessageModel.countDocuments({
                conversationId: conv._id,
                status: "sent",
                sender: { $ne: userType }
            });

            return {
                ...conv,
                unreadCount
            };
        }));

        return enriched;
    }

    async markMessagesAsRead(conversationId: string, userType: string): Promise<void> {
        await MessageModel.updateMany(
            {
                conversationId,
                sender: { $ne: userType },
                status: "sent"
            },
            { $set: { status: "read" } }
        );
    }
}