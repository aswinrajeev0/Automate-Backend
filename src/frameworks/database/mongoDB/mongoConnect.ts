import mongoose, { mongo } from "mongoose";
import { config } from "../../../shared/config";

export class MongoConnect {
    private _dbUrl: string;
    constructor() {
        this._dbUrl = config.database.URI;
    }

    async connectDb() {
        try {
            await mongoose.connect(this._dbUrl);

            console.log("Database connected successfully");

            mongoose.connection.on("error", (error) => {
                console.error("MongoDB connection error:", error);
            });

            mongoose.connection.on("disconnected", () => {
                console.log("Mongo db disconnected");
            });

        } catch (error) {
            console.error("Failed to connect to MongoDB", error);
            throw new Error("Database connection failed.");
        }
    }
}