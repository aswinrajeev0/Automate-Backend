import cron from "node-cron";
import { BookingModel } from "../database/mongoDB/models/booking.model";

export const startBookingCompletionUpdater = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5);

      const result = await BookingModel.updateMany(
        {
          status: { $in: ["pending", "confirmed"] },
          $or: [
            { date: { $lt: currentDate } },
            { date: currentDate, endTime: { $lt: currentTime } },
          ],
        },
        {
          $set: { status: "completed" },
        }
      );

      console.log(`[CRON] Updated ${result.modifiedCount} bookings to completed.`);
    } catch (error) {
      console.error("[CRON] Error updating bookings:", error);
    }
  });
};
