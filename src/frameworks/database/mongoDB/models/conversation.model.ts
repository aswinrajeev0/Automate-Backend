import { model, Types } from "mongoose";
import { IConversationEntity } from "../../../../entities/models/conversation.entity";
import { IMessageEntity } from "../../../../entities/models/message.entity";
import { conversationSchema, messageSchema } from "../schemas/conversation.schema";

export interface IMessageModel extends Omit<IMessageEntity, "id">{
    _id: Types.ObjectId;
}

export interface IConversationModel extends Omit<IConversationEntity, "id" | "customerId" | "workshopId">{
    _id: Types.ObjectId;
    customerId: Types.ObjectId;
    workshopId: Types.ObjectId;
}

export const MessageModel = model<IMessageModel>("Message", messageSchema)
export const ConversationModel = model<IConversationModel>("Conversation", conversationSchema)