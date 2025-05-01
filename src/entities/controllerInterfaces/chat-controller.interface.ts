import { NextFunction, Request, Response } from "express";

export interface IChatController {
    getConversations(req: Request, res: Response, next: NextFunction): Promise<void>;
    fallBackUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    startChat(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    markMessagesAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}