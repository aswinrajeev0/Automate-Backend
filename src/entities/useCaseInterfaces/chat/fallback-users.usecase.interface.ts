export interface IFallBackUsersUseCase {
    execute(userId: string,userType: "customer" | "workshop"): Promise<{name: string; _id: string}[]>;
}