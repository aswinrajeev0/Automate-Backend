
export interface IConversationEntity {
    id: string;
    customerId: string;
    customerName: string;
    workshopId: string;
    workshopName: string;
    latestMessage: {
        content: string;
        timestamp: Date;
        sender: string;
        status: string;
        imageUrl: string | null;
    };
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}