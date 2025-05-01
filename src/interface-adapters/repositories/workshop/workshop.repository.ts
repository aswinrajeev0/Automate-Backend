import { IWorkshopRepository } from "../../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { WorkshopModel } from "../../../frameworks/database/mongoDB/models/workshop.model";
import { IWorkshopEntity } from "../../../entities/models/workshop.entity";
import { injectable } from "tsyringe";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
// import { IWorkshopWithRatings } from "../../../entities/models/workshop-with-rating.entity";
import { ReviewModel } from "../../../frameworks/database/mongoDB/models/review.model";
import { IWorkshopWithRatings } from "../../../entities/models/workshop-with-rating.entity";

@injectable()
export class WorkshopRepository implements IWorkshopRepository {
    async save(data: Partial<IWorkshopEntity>): Promise<IWorkshopEntity> {
        const workshop = await WorkshopModel.create(data)
        return workshop;
    }

    async findById(id: string): Promise<IWorkshopEntity | null> {
        const workshop = await WorkshopModel.findById(id);
        return workshop;
    }

    async findByEmail(email: string): Promise<IWorkshopEntity | null> {
        const workshop = await WorkshopModel.findOne({ email });
        return workshop;
    }

    async updateByEmail(email: string, updates: Partial<IWorkshopEntity>): Promise<IWorkshopEntity | null> {
        const workshop = await WorkshopModel.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true }
        );
        if (!workshop) {
            return null
        }
        return workshop;
    }

    async findByIdAndUpdate(id: string, updates: Partial<IWorkshopEntity>): Promise<IWorkshopEntity | null> {
        const workshop = await WorkshopModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean()
        return { ...workshop, id: workshop?._id.toString() } as IWorkshopEntity;
    }

    async find(filter: any, skip: number, limit: number): Promise<{ workshops: IWorkshopEntity[] | []; total: number; }> {
        const workshops = await WorkshopModel.find(filter).skip(skip).limit(limit);
        return { workshops, total: workshops.length }
    }

    async updateBlockStatus(id: string): Promise<IWorkshopEntity> {
        const workshop = await WorkshopModel.findById(id);

        if (!workshop) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }

        workshop.isBlocked = !workshop.isBlocked;

        await workshop.save();

        return workshop;
    }

    async getWorkshopsWithRatings(skip: number, limit: number, searchTerm: string, sortOption: any): Promise<{ workshops: Partial<IWorkshopWithRatings[]>; total: number }> {
        console.log(searchTerm)
        const matchStage: any = {
            approvalStatus: "approved"
        };

        if (searchTerm) {
            matchStage.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { city: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ];
        }

        const workshops = await WorkshopModel.aggregate([
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "workshopId",
                    as: "reviews",
                },
            },
            {
                $addFields: {
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviews" }, 0] },
                            then: { $round: [{ $avg: "$reviews.rating" }, 1] },
                            else: 0,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    workshopId: "$_id",
                    name: "$name",
                    city: "$city",
                    streetAddress: "$streetAddress",
                    averageRating: 1,
                    image: "$image",
                    country: "$country",
                    description: "$bio"
                },
            },
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limit },
        ]);

        const total = await WorkshopModel.countDocuments({ approvalStatus: "approved" })

        return { workshops, total };
    }

    async findByIdsNotIn(ids: string[]): Promise<{ _id: string; name: string; }[]> {
        return await WorkshopModel.find({ _id: { $nin: ids } }).select("_id name");
    }

    async findOne(filter: Partial<IWorkshopEntity>): Promise<IWorkshopEntity | null> {
        const workshop = await WorkshopModel.findOne(filter);
        return workshop;
    }

}