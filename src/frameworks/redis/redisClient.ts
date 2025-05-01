import Redis from "ioredis";
import { injectable } from "tsyringe";
import { config } from "../../shared/config";
import { IRedisClient } from "../../entities/serviceInterfaces.ts/redisClient.interface";

@injectable()
export class RedisClient implements IRedisClient {

    private client: Redis;

    constructor() {
        this.client = new Redis(`${config.redis.REDIS_URL}`)
        this.client.on("connect", () => console.log("✅ Connected to Redis!"))
        this.client.on("error", (err) => console.error("❌ Redis connection error:", err))
    }

    async blackListToken(token: string, expiresIn: number): Promise<void> {
        await this.client.set(token, "blacklisted", "EX", expiresIn);
    }

    async deleteResetToken(userId: string): Promise<void> {
        const key = `reset_token:${userId}`;
        await this.client.del(key);
    }

    async isTokenBlackListed(token: string): Promise<boolean> {
        const result = await this.client.get(token);
        return result === "blacklisted";
    }

    async storeResetToken(userId: string, token: string): Promise<void> {
        const key = `reset_token:${userId}`;
        await this.client.setex(key, 300, token);
    }

    async verifyResetToken(userId: string, token: string): Promise<boolean> {
        const key = `reset_token:${userId}`;
        const storedToken = await this.client.get(key);
        return storedToken === token;
    }

    async saveSlotId(slotId: string): Promise<boolean> {
        const key = `slot:${slotId}`;
        const result = await this.client.set(key, slotId, "EX", 300, "NX");
        return result === "OK";
    }

    async getSlotId(slotId: string): Promise<boolean> {
        const key = `slot:${slotId}`;
        const result = await this.client.get(key);
        return result !== null;
    }
}