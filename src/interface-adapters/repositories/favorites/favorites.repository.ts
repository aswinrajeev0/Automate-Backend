import { injectable } from "tsyringe";
import { IFavoritesRepository } from "../../../entities/repositoryInterfaces/favorites/favorites.repository.interface";
import { FavoriteModel, IFavoriteModel } from "../../../frameworks/database/mongoDB/models/favorite-workshops.model";
import mongoose from "mongoose";
import { IFavoriteWorkshops } from "../../../shared/dtos/workshop.dto";

@injectable()
export class FavoritesRepository implements IFavoritesRepository {
    async wokrkshops(customerId: string, skip: number, limit: number): Promise<{workshops: IFavoriteWorkshops[]; total: number}> {
        const customer = new mongoose.Types.ObjectId(customerId);
        const result = await FavoriteModel.aggregate([
            { $match: { customer } },
            {
                $project: {
                    customer: 1,
                    workshops: { $slice: ["$workshops", skip, limit] }
                }
            },
            {
                $lookup: {
                    from: "workshops",
                    localField: "workshops",
                    foreignField: "_id",
                    as: "workshops"
                }
            }
        ]);

        const workshops = (result[0]?.workshops || []).map((workshop: any) => ({
            workshopId: workshop._id.toString(),
            name: workshop.name,
            description: workshop.description,
            streetAddress: workshop.streetAddress,
            city: workshop.city,
            country: workshop.country,
            image: workshop.image,
        }));

        const favorite = await FavoriteModel.findOne({customer: customerId})
        const total = favorite?.workshops.length || 0;

        return {workshops, total};
    }

    async addToFavorites(customerId: string, workshopId: string): Promise<IFavoriteModel | null> {
        const favorite = await FavoriteModel.findOneAndUpdate({ customer: customerId }, {$push: {workshops: workshopId}}, {upsert: true})
        return favorite
    }

    async removeFromFavorite(customerId: string, workshopId: string): Promise<IFavoriteModel | null> {
        const favorite = await FavoriteModel.findOneAndUpdate({ customer: customerId }, {$pull: {workshops: workshopId}}, {upsert: true})
        return favorite
    }

    async findOne(customerId: string): Promise<IFavoriteModel | null> {
        const favorite = await FavoriteModel.findOne({customer: customerId})
        return favorite
    }
}