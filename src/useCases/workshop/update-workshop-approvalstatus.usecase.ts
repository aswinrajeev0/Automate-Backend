import { injectable, inject } from "tsyringe";
import { IUpdateWorkshopApprovalStatusUseCase } from "../../entities/useCaseInterfaces/workshop/update-workshop-approvalstatus.usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { APPROVED_MAIL_CONTENT, ERROR_MESSAGES, HTTP_STATUS, REJECTED_MAIL_CONTENT } from "../../shared/constants";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { IWorkshopEntity } from "../../entities/models/workshop.entity";
import { IEmailService } from "../../entities/serviceInterfaces.ts/email-service.interface";

@injectable()
export class UpdateWorkshopApprovalStatusUseCase implements IUpdateWorkshopApprovalStatusUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("IEmailService") private _emailService: IEmailService,
    ) { }

    async execute(workshopId: string, status: "approved" | "rejected" | "pending", reason?: string): Promise<IWorkshopEntity> {
        if (!workshopId || !status) {
            throw new CustomError(
                ERROR_MESSAGES.MISSING_PARAMETERS,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const updates = {
            approvalStatus: status,
            rejectionReason: reason
        }

        const workshop = await this._workshopRepo.findByIdAndUpdate(workshopId, updates)
        if (!workshop) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if (status === "approved") {
            const to = workshop.email;
            const subject = "Your request of registration has been approved."
            const content = APPROVED_MAIL_CONTENT()
            await this._emailService.sendMail(to, subject, content)
        }

        if (status === "rejected") {
            const to = workshop.email;
            const subject = "Your request of registration has been rejected.";
            const content = REJECTED_MAIL_CONTENT();
            await this._emailService.sendMail(to, subject, content)
        }
        
        return workshop;
    }
}