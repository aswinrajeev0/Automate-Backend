import { injectable } from "tsyringe";
import { IAdminAnalyticsService } from "../../entities/serviceInterfaces.ts/admin-analytics-service.interface";
import { CustomerModel } from "../../frameworks/database/mongoDB/models/customer.model";
import { WorkshopModel } from "../../frameworks/database/mongoDB/models/workshop.model";
import { BookingModel } from "../../frameworks/database/mongoDB/models/booking.model";
import { RequestModel } from "../../frameworks/database/mongoDB/models/request.model";

@injectable()
export class AdminAnalyticsService implements IAdminAnalyticsService {

    async getTotalCustomers(): Promise<number> {
        const totalCustomers = await CustomerModel.countDocuments()
        return totalCustomers;
    }

    async getTotalWorkshops(): Promise<number> {
        const totalWorkshops = await WorkshopModel.countDocuments({approvalStatus: "approved"})
        return totalWorkshops;
    }

    async getTotalBookings(): Promise<number> {
        const totalBookings = await BookingModel.countDocuments({status: "completed"})
        return totalBookings
    }

    async getTotalRequests(): Promise<number> {
        const totalRequests = await RequestModel.countDocuments({status: "delivered"});
        return totalRequests
    }

    async getTotalEarnings(): Promise<number> {
        const result = await BookingModel.aggregate([
            {
                $match: {
                    status: 'completed',
                },
            },
            {
                $project: {
                    amount: 1,
                },
            },
            {
                $unionWith: {
                    coll: 'requests',
                    pipeline: [
                        {
                            $match: {
                                status: 'delivered',
                            },
                        },
                        {
                            $project: {
                                amount: 1,
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: '$amount' },
                },
            },
        ]);

        return result[0]?.totalEarnings || 0;
    }

    async workshopGrowthData(groupStage: any, filter: string): Promise<{ name: string; workshops: number; }[]> {
        const growthData = await WorkshopModel.aggregate([
            { $group: groupStage },
            {
                $sort: {
                    "_id.year": 1,
                    ...(filter !== 'yearly' && { "_id.month": 1 }),
                }
            }
        ]);

        const formatted = growthData.map(item => ({
            name: filter === 'yearly'
                ? `${item._id.year}`
                : `${item._id.month}/${item._id.year}`,
            workshops: item.count as number
        }));

        return formatted
    }

}