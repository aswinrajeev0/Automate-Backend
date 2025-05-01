export interface IMessageEntity {
    id: string;
    content: string;
    sender: "customer" | "workshop";
    timestamp: Date;
    status: "sent" | "delivered" | "read";
    conversationId: string;
    imageUrl: string | null;
}