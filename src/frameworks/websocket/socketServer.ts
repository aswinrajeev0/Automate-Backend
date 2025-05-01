import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "../../shared/config";
import { ConversationModel, MessageModel } from "../database/mongoDB/models/conversation.model";

let io: SocketIOServer;

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = config.cors.ALLOWED_ORIGIN.split(',').map(o => o.trim());
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("joinRoom", (roomId: string, userId: string) => {
            socket.join(roomId);
            onlineUsers.set(userId, socket.id);
            io.to(roomId).emit("onlineStatus", { id: userId, online: true });
            console.log(`${socket.id} joined room ${roomId}`);
        });

        socket.on("checkOnlineStatus", (recipientId: string) => {
            const isOnline = onlineUsers.has(recipientId);
            socket.emit("onlineStatus", { id: recipientId, online: isOnline });
        });

        socket.on("sendMessage", async (data) => {
            const { roomId, message } = data;
            io.to(roomId).emit("receiveMessage", message);
            try {
                const savedMessage = await MessageModel.create({
                    content: message.content,
                    conversationId: roomId,
                    sender: message.sender,
                    timestamp: message.timestamp,
                    imageUrl: message.imageUrl
                });

                await ConversationModel.findByIdAndUpdate(roomId, {
                    latestMessage: {
                        content: savedMessage.content,
                        sender: savedMessage.sender,
                        timestamp: savedMessage.timestamp,
                        status: savedMessage.status,
                        imageUrl: message.imageUrl
                    }
                });

                io.emit("latestMessage", {
                    conversationId: roomId,
                    latestMessage: {
                        content: savedMessage.content,
                        sender: savedMessage.sender,
                        timestamp: savedMessage.timestamp,
                        status: savedMessage.status,
                        imageUrl: message.imageUrl
                    }
                });
            } catch (error) {
                console.error("Failed to save message:", error);
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(userId);
                    socket.broadcast.emit("onlineStatus", { id: userId, online: false });
                    break;
                }
            }
            console.log("Client disconnected:", socket.id);
        });
    });
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
