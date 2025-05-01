import { injectable } from 'tsyringe';
import { BookingModel } from '../../frameworks/database/mongoDB/models/booking.model';
import { IAnalyticsService } from '../../entities/serviceInterfaces.ts/anaytic-service.interface';
import mongoose from 'mongoose';
import { RequestModel } from '../../frameworks/database/mongoDB/models/request.model';

@injectable()
export class AnalyticsService implements IAnalyticsService {
    async getTotalUniqueCustomers(workshopId: string): Promise<number> {
        const objectId = new mongoose.Types.ObjectId(workshopId)
        const result = await BookingModel.aggregate([
            {
                $match: {
                    workshopId: objectId,
                },
            },
            {
                $project: {
                    customerId: 1,
                },
            },
            {
                $unionWith: {
                    coll: 'requests',
                    pipeline: [
                        {
                            $match: {
                                workshopId: objectId,
                            },
                        },
                        {
                            $project: {
                                customerId: 1,
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: '$customerId',
                },
            },
            {
                $count: 'totalUniqueCustomers',
            },
        ]);

        return result[0]?.totalUniqueCustomers || 0;
    }

    async getTotalWorkshopEarnings(workshopId: string): Promise<number> {
        const objectId = new mongoose.Types.ObjectId(workshopId);

        const result = await BookingModel.aggregate([
            {
                $match: {
                    workshopId: objectId,
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
                                workshopId: objectId,
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

    async getWorkshopStats(workshopId: string): Promise<{
        totalBookings: number;
        totalRequests: number;
    }> {
        const objectId = new mongoose.Types.ObjectId(workshopId);

        const [bookingCount, requestCount] = await Promise.all([
            BookingModel.countDocuments({ workshopId: objectId }),
            RequestModel.countDocuments({ workshopId: objectId }),
        ]);

        return {
            totalBookings: bookingCount,
            totalRequests: requestCount,
        };
    }

    async getGrowthChartData(workshopId: string, timeframe: 'week' | 'month' | 'year'): Promise<{ name: string; bookings: number; requests: number }[]> {
        const now = new Date();
        let groupFormat: string;
        let startDate: Date;

        switch (timeframe) {
            case 'week':
                groupFormat = '%Y-%m-%d';
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                groupFormat = '%Y-%m-%d';
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                groupFormat = '%Y-%m';
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                groupFormat = '%Y-%m-%d';
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
        }

        const objectId = new mongoose.Types.ObjectId(workshopId);

        const [bookingData, requestData] = await Promise.all([
            BookingModel.aggregate([
                { $match: { workshopId: objectId, createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id': 1 } }
            ]),
            RequestModel.aggregate([
                { $match: { workshopId: objectId, createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id': 1 } }
            ])
        ]);

        const mergedData: { [key: string]: any } = {};

        bookingData.forEach(b => {
            if (!mergedData[b._id]) mergedData[b._id] = { name: b._id, bookings: 0, requests: 0 };
            mergedData[b._id].bookings = b.count;
        });

        requestData.forEach(r => {
            if (!mergedData[r._id]) mergedData[r._id] = { name: r._id, bookings: 0, requests: 0 };
            mergedData[r._id].requests = r.count;
        });

        console.log(bookingData, requestData)

        return Object.values(mergedData);
    }

    async getEarningsChartData(
        workshopId: string,
        timeframe: 'week' | 'month' | 'year'
    ): Promise<{ name: string; earnings: number }[]> {
        const now = new Date();
        let groupFormat: string;
        let startDate: Date;

        switch (timeframe) {
            case 'week':
                groupFormat = '%Y-%m-%d';
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                groupFormat = '%Y-%m-%d';
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                groupFormat = '%Y-%m';
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                groupFormat = '%Y-%m-%d';
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
        }

        const objectId = new mongoose.Types.ObjectId(workshopId);

        const earningsData = await BookingModel.aggregate([
            {
                $match: {
                    workshopId: objectId,
                    status: 'completed',
                    createdAt: { $gte: startDate },
                },
            },
            {
                $project: {
                    createdAt: 1,
                    amount: 1,
                },
            },
            {
                $unionWith: {
                    coll: 'requests',
                    pipeline: [
                        {
                            $match: {
                                workshopId: objectId,
                                status: 'delivered',
                                createdAt: { $gte: startDate },
                            },
                        },
                        {
                            $project: {
                                createdAt: 1,
                                amount: 1,
                            },
                        },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: '$createdAt',
                        },
                    },
                    earnings: { $sum: '$amount' },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    earnings: 1,
                },
            },
        ]);

        return earningsData;
    }


}
