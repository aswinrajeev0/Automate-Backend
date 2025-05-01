import { Schema } from "mongoose";
import { IConversationModel, IMessageModel } from "../models/conversation.model";

export const messageSchema = new Schema<IMessageModel>({
    content: { type: String },
    sender: { type: String, enum: ["customer", "workshop"], required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    conversationId: { type: String, required: true },
    imageUrl: {type: String}
});

export const conversationSchema = new Schema<IConversationModel>({
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    workshopId: { type: Schema.Types.ObjectId, ref: "Workshop" },
    workshopName: { type: String, required: true },
    latestMessage: { 
        type: {
            content: String, 
            timestamp: Date,
            sender: String,
            status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
            imageUrl: {type: String}
        } 
    }
}, {timestamps: true})