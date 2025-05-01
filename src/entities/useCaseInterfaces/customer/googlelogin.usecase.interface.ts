import { ICustomerEntity } from "../../models/customer.entity";

export interface IGoogleUseCase {
	execute(
		credential: string,
		client_id: string,
	): Promise<Partial<ICustomerEntity>>;
}
