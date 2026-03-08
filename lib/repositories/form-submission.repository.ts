import { BaseRepository } from "./base.repository";
import {
	getFormSubmissionModelSync,
	type IFormSubmission,
	type FormSubmissionType,
	type FormSubmissionStatus,
} from "@/models/form-submission.model";
import { logger } from "@/lib/utils/logger";
import { DatabaseError } from "@/lib/utils/api-error";

/**
 * Form Submission Repository
 * Extends BaseRepository with form submission specific queries
 */
class FormSubmissionRepository extends BaseRepository<IFormSubmission> {
	constructor() {
		super(getFormSubmissionModelSync());
	}

	/**
	 * Find submissions with filters and pagination
	 */
	async findWithFilters(options: {
		page?: number;
		limit?: number;
		type?: FormSubmissionType;
		status?: FormSubmissionStatus;
		search?: string;
		dateFrom?: string;
		dateTo?: string;
		productId?: string;
		sort?: string;
	}): Promise<{
		data: IFormSubmission[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const {
				page = 1,
				limit = 20,
				type,
				status,
				search,
				dateFrom,
				dateTo,
				productId,
				sort = "-createdAt",
			} = options;

			// Build filter
			const filter: Record<string, unknown> = {};

			if (type) {
				filter.type = type;
			}

			if (status) {
				filter.status = status;
			}

			if (productId) {
				filter.productId = productId;
			}

			// Date range filter
			if (dateFrom || dateTo) {
				const dateFilter: { $gte?: Date; $lte?: Date } = {};
				if (dateFrom) {
					dateFilter.$gte = new Date(dateFrom);
				}
				if (dateTo) {
					dateFilter.$lte = new Date(dateTo);
				}
				filter.createdAt = dateFilter;
			}

			// Search filter (full name, email, phone, product name)
			if (search && search.trim()) {
				const searchRegex = new RegExp(search.trim(), "i");
				filter.$or = [
					{ fullName: searchRegex },
					{ email: searchRegex },
					{ phone: searchRegex },
					{ productName: searchRegex },
				];
			}

			// Parse sort
			const sortObj: Record<string, 1 | -1> = {};
			if (sort.startsWith("-")) {
				sortObj[sort.substring(1)] = -1;
			} else {
				sortObj[sort] = 1;
			}

			// Execute with pagination
			const result = await this.findPaginated(filter, page, limit, sortObj);

			logger.db("findWithFilters", this.modelName, Date.now() - startTime);
			return result;
		} catch (error) {
			logger.error("Error finding form submissions with filters", error);
			throw new DatabaseError("Failed to find form submissions");
		}
	}

	/**
	 * Count submissions by IP address within a time window (for rate limiting)
	 */
	async countByIpInWindow(ip: string, windowStart: Date): Promise<number> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const count = await this.model
				.countDocuments({
					"metadata.ipAddress": ip,
					createdAt: { $gte: windowStart },
				})
				.exec();

			logger.db("countByIpInWindow", this.modelName, Date.now() - startTime);
			return count;
		} catch (error) {
			logger.error("Error counting submissions by IP", error);
			throw new DatabaseError("Failed to count submissions");
		}
	}

	/**
	 * Update submission status
	 */
	async updateStatus(
		id: string,
		status: FormSubmissionStatus,
		userId?: string
	): Promise<IFormSubmission | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const updateData: Record<string, unknown> = { status };

			if (status === "read") {
				updateData.readAt = new Date();
				if (userId) {
					updateData.readBy = userId;
				}
			}

			const document = await this.updateById(id, updateData);

			logger.db("updateStatus", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error("Error updating submission status", error);
			throw new DatabaseError("Failed to update submission status");
		}
	}

	/**
	 * Bulk update status
	 */
	async bulkUpdateStatus(
		ids: string[],
		status: FormSubmissionStatus,
		userId?: string
	): Promise<number> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const updateData: Record<string, unknown> = { status };

			if (status === "read") {
				updateData.readAt = new Date();
				if (userId) {
					updateData.readBy = userId;
				}
			}

			const result = await this.model
				.updateMany({ _id: { $in: ids } }, updateData)
				.exec();

			logger.db("bulkUpdateStatus", this.modelName, Date.now() - startTime);
			return result.modifiedCount || 0;
		} catch (error) {
			logger.error("Error bulk updating submission status", error);
			throw new DatabaseError("Failed to bulk update submission status");
		}
	}

	/**
	 * Get submissions for export
	 */
	async getForExport(options: {
		ids?: string[];
		type?: FormSubmissionType;
		status?: FormSubmissionStatus;
		dateFrom?: string;
		dateTo?: string;
	}): Promise<IFormSubmission[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const { ids, type, status, dateFrom, dateTo } = options;

			const filter: Record<string, unknown> = {};

			if (ids && ids.length > 0) {
				filter._id = { $in: ids };
			}

			if (type) {
				filter.type = type;
			}

			if (status) {
				filter.status = status;
			}

			if (dateFrom || dateTo) {
				const dateFilter: { $gte?: Date; $lte?: Date } = {};
				if (dateFrom) {
					dateFilter.$gte = new Date(dateFrom);
				}
				if (dateTo) {
					dateFilter.$lte = new Date(dateTo);
				}
				filter.createdAt = dateFilter;
			}

			const documents = await this.model
				.find(filter)
				.sort({ createdAt: -1 })
				.exec();

			logger.db("getForExport", this.modelName, Date.now() - startTime);
			return documents;
		} catch (error) {
			logger.error("Error getting submissions for export", error);
			throw new DatabaseError("Failed to get submissions for export");
		}
	}

	/**
	 * Get statistics for dashboard
	 */
	async getStats(): Promise<{
		total: number;
		new: number;
		read: number;
		archived: number;
		byType: Record<string, number>;
	}> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const [total, newCount, readCount, archivedCount, byTypeAgg] =
				await Promise.all([
					this.model.countDocuments().exec(),
					this.model.countDocuments({ status: "new" }).exec(),
					this.model.countDocuments({ status: "read" }).exec(),
					this.model.countDocuments({ status: "archived" }).exec(),
					this.model.aggregate([
						{ $group: { _id: "$type", count: { $sum: 1 } } },
					]),
				]);

			const byType: Record<string, number> = {};
			byTypeAgg.forEach((item: { _id: string; count: number }) => {
				byType[item._id] = item.count;
			});

			logger.db("getStats", this.modelName, Date.now() - startTime);

			return {
				total,
				new: newCount,
				read: readCount,
				archived: archivedCount,
				byType,
			};
		} catch (error) {
			logger.error("Error getting submission stats", error);
			throw new DatabaseError("Failed to get submission stats");
		}
	}
}

export const formSubmissionRepository = new FormSubmissionRepository();
