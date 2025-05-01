import cron from "node-cron";
import { WorkshopSlotModel } from "../database/mongoDB/models/workshop-slot.model";

export const startExpiredSlotCleaner = () => {
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const result = await WorkshopSlotModel.deleteMany({
      $or: [
        { date: { $lt: currentDate } },
        { date: currentDate, endTime: { $lt: currentTime } },
      ],
    });

    console.log(`[CRON] Deleted ${result.deletedCount} expired slots.`);
  });
};
