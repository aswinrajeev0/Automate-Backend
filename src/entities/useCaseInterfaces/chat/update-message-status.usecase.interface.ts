export interface IUpdateMessageStatusUseCase {
    markMessageAsRead(conversationId: string, userType: string): Promise<void>
}