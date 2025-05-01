import { inject, injectable } from "tsyringe";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { IAdminReportUseCase } from "../../entities/useCaseInterfaces/admin/admin-report.usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { IRequestModel } from "../../frameworks/database/mongoDB/models/request.model";
import { IBookingModel } from "../../frameworks/database/mongoDB/models/booking.model";

@injectable()
export class AdminReportUseCase implements IAdminReportUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
        @inject("IRequestRepository") private _requestRepo: IRequestRepository
    ) { }

    async reportData(): Promise<{
        totalBookingRevenue: number;
        totalRequestRevenue: number;
        totalRevenue: number;
        totalGST: number;
        totalRequests: number;
        totalBookings: number;
    }> {

        const bookings = await this._bookingRepo.find({ status: "completed" })
        const { requests } = await this._requestRepo.find({ status: "delivered" }, 0, 0)

        const totalBookings = await this._bookingRepo.totalBookings({});
        const totalRequests = await this._requestRepo.totalRequests({});
        const totalBookingRevenue = bookings.reduce((acc, curr) => acc + (curr?.amount || 0), 0)
        const totalRequestRevenue = requests.reduce((acc, curr) => acc + (curr?.amount || 0), 0)
        const totalRevenue = totalBookingRevenue + totalRequestRevenue;
        const totalGST = bookings.reduce((acc, curr) => acc + (curr?.gst || 0), 0) + requests.reduce((acc, curr) => acc + (curr?.gst || 0), 0)

        return {
            totalBookingRevenue,
            totalRequestRevenue,
            totalRevenue,
            totalGST,
            totalRequests,
            totalBookings
        }
    }

    async allRequests(startDate: Date, endDate: Date, skip: number, limit: number): Promise<{ requests: IRequestModel[]; totalRequests: number; }> {
        const filter: any = {}
        filter.createdAt = {
            $gt: startDate,
            $lt: endDate
        }

        const { requests, total } = await this._requestRepo.find(filter, skip, limit)

        return { requests, totalRequests: total }
    }

    async allBookings(startDate: Date, endDate: Date, skip: number, limit: number): Promise<{ bookings: IBookingModel[]; totalBookings: number; }> {
        const filter: any = {}
        filter.createdAt = {
            $gt: startDate,
            $lt: endDate
        }

        const { bookings, totalBookings } = await this._bookingRepo.findAllAdminBookings(filter, skip, limit);

        return { bookings, totalBookings }
    }

    async downloadPdf(startDate: string, endDate: string, serviceType: string): Promise<string> {

        const filter: any = {};
        filter.createdAt = {
            $gt: startDate,
            $lt: endDate
        };

        let data: any[] = [];

        if (serviceType === "requests") {
            const { requests } = await this._requestRepo.find(filter, 0, 0);
            data = requests;
        } else {
            const { bookings } = await this._bookingRepo.findAllAdminBookings(filter, 0, 0);
            data = bookings;
        }

        const filename = `report-${Date.now()}.pdf`;
        const filePath = path.join(__dirname, "../../../reports", filename);

        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Title
        doc.fontSize(20).text("Workshop Report", { align: "center" });
        doc.moveDown(1.5);

        // Summary Calculation
        let totalAmount = 0;
        let totalGST = 0;
        let totalCount = data.length;

        data.forEach(item => {
            totalAmount += item.amount || 0;
            totalGST += item.gst || 0;
        });

        // Summary Section
        doc.fontSize(14).text("Summary", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total Amount: Rs ${totalAmount.toLocaleString()}`);
        doc.text(`Total GST: Rs ${totalGST.toLocaleString()}`);
        doc.text(`Total ${serviceType === "requests" ? "Requests" : "Bookings"}: ${totalCount}`);
        doc.moveDown(1.5);

        // Details Section
        doc.fontSize(14).text("Details", { underline: true });
        doc.moveDown(0.5);

        // Table Column Headers
        const headers = ["ID", "Date", "Customer", "Workshop", "Price", "GST", "Amount"];
        const columnWidths = [60, 60, 100, 100, 60, 60, 60];
        const startX = doc.page.margins.left;
        let y = doc.y;

        doc.fontSize(12).fillColor("#000").font("Helvetica-Bold");
        headers.forEach((header, i) => {
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                width: columnWidths[i],
                align: "left"
            });
        });

        y = doc.y + 10;
        doc.moveTo(startX, y).lineTo(550, y).stroke();
        y += 5;
        doc.moveDown(0.5);

        // Table Data Rows
        doc.font("Helvetica").fontSize(11);
        data.forEach(item => {
            const date = item.createdAt.toLocaleDateString();
            const customerName = item.customerId?.name || "-";
            const workshopName = item.workshopId?.name || "-";
            const price = item.price || (item.amount - item.gst) || 0;
            const gst = item.gst || 0;
            const total = item.amount || 0;

            const values = [
                item._id.toString().slice(-6),
                date,
                customerName,
                workshopName,
                `Rs ${price}`,
                `Rs ${gst}`,
                `Rs ${total}`
            ];

            values.forEach((val, i) => {
                doc.text(String(val), startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                    width: columnWidths[i],
                    align: "left",
                    ellipsis: true
                });
            });

            y = doc.y + 5;

            // Add page break if needed
            if (y > doc.page.height - 100) {
                doc.addPage();
                y = doc.y;
            }
        });

        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on("finish", () => resolve(filePath));
            writeStream.on("error", reject);
        });
    }
}