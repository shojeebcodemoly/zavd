import type { Model, Document, UpdateQuery, QueryOptions } from "mongoose";
import mongoose from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import { PAGINATION } from "@/lib/utils/constants";
import { DatabaseError, BadRequestError } from "@/lib/utils/api-error";
import { logger } from "@/lib/utils/logger";

/**
 * Extract user-friendly error message from MongoDB/Mongoose errors
 */
function extractMongooseErrorMessage(error: unknown): string {
	if (error instanceof mongoose.Error.ValidationError) {
		// Extract all validation error messages
		const messages = Object.values(error.errors).map((err) => {
			if (err instanceof mongoose.Error.CastError) {
				return `Invalid value for ${err.path}`;
			}
			return err.message;
		});
		return messages.join(", ");
	}

	if (error instanceof mongoose.Error.CastError) {
		return `Invalid value for field "${error.path}"`;
	}

	if (error instanceof Error) {
		// Handle duplicate key errors
		if (error.message.includes("duplicate key")) {
			return "A record with this value already exists";
		}
		return error.message;
	}

	return "An unexpected database error occurred";
}

/**
 * Base Repository Pattern
 * Provides generic CRUD operations for all models
 */
export class BaseRepository<T extends Document> {
	protected model: Model<T>;
	protected modelName: string;

	constructor(model: Model<T>) {
		this.model = model;
		this.modelName = model.modelName;
	}

	/**
	 * Ensure database connection
	 */
	protected async ensureConnection(): Promise<void> {
		await connectMongoose();
	}

	/**
	 * Find all documents
	 */
	async findAll(filter: any = {}, options: QueryOptions = {}): Promise<T[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const documents = await this.model.find(filter, null, options).exec();

			logger.db("findAll", this.modelName, Date.now() - startTime);
			return documents;
		} catch (error) {
			logger.error(`Error finding all ${this.modelName}`, error);
			throw new DatabaseError(`Failed to find ${this.modelName}`);
		}
	}

	/**
	 * Find documents with pagination
	 */
	async findPaginated(
		filter: any = {},
		page: number = PAGINATION.DEFAULT_PAGE,
		limit: number = PAGINATION.DEFAULT_LIMIT,
		sort: any = { createdAt: -1 }
	): Promise<{
		data: T[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			// Ensure pagination limits
			const validLimit = Math.min(limit, PAGINATION.MAX_LIMIT);
			const skip = (page - 1) * validLimit;

			// Execute queries in parallel
			const [data, total] = await Promise.all([
				this.model
					.find(filter)
					.sort(sort)
					.skip(skip)
					.limit(validLimit)
					.exec(),
				this.model.countDocuments(filter).exec(),
			]);

			const totalPages = Math.ceil(total / validLimit);

			logger.db("findPaginated", this.modelName, Date.now() - startTime);

			return {
				data,
				total,
				page,
				limit: validLimit,
				totalPages,
			};
		} catch (error) {
			logger.error(`Error finding paginated ${this.modelName}`, error);
			throw new DatabaseError(`Failed to find ${this.modelName}`);
		}
	}

	/**
	 * Find one document by filter
	 */
	async findOne(filter: any, options: QueryOptions = {}): Promise<T | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const document = await this.model
				.findOne(filter, null, options)
				.exec();

			logger.db("findOne", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error finding ${this.modelName}`, error);
			throw new DatabaseError(`Failed to find ${this.modelName}`);
		}
	}

	/**
	 * Find document by ID
	 */
	async findById(
		id: string | { _id: string },
		options: QueryOptions = {}
	): Promise<T | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const normalizedId = typeof id === "object" && id?._id ? id?._id : id;

			if (typeof normalizedId !== "string") {
				throw new Error("Invalid ID format");
			}

			const document = await this.model
				.findById(normalizedId, null, options)
				.exec();

			logger.db("findById", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error finding ${this.modelName} by ID`, error);
			throw new DatabaseError(`Failed to find ${this.modelName}`);
		}
	}

	/**
	 * Create a new document
	 */
	async create(data: any): Promise<T> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const document = (await this.model.create(data)) as any as T;

			logger.db("create", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error creating ${this.modelName}`, error);
			const message = extractMongooseErrorMessage(error);
			// Use BadRequestError for validation errors, DatabaseError for others
			if (
				error instanceof mongoose.Error.ValidationError ||
				error instanceof mongoose.Error.CastError
			) {
				throw new BadRequestError(message);
			}
			throw new DatabaseError(message);
		}
	}

	/**
	 * Update a document by ID
	 */
	async updateById(
		id: string,
		update: UpdateQuery<T>,
		options: QueryOptions = { new: true, runValidators: true }
	): Promise<T | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const document = await this.model
				.findByIdAndUpdate(id, update, options)
				.exec();

			logger.db("updateById", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error updating ${this.modelName}`, error);
			const message = extractMongooseErrorMessage(error);
			if (
				error instanceof mongoose.Error.ValidationError ||
				error instanceof mongoose.Error.CastError
			) {
				throw new BadRequestError(message);
			}
			throw new DatabaseError(message);
		}
	}

	/**
	 * Update one document by filter
	 */
	async updateOne(
		filter: any,
		update: UpdateQuery<T>,
		options: QueryOptions = { new: true, runValidators: true }
	): Promise<T | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const document = await this.model
				.findOneAndUpdate(filter, update, options)
				.exec();

			logger.db("updateOne", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error updating ${this.modelName}`, error);
			throw new DatabaseError(`Failed to update ${this.modelName}`);
		}
	}

	/**
	 * Delete document by ID
	 */
	async deleteById(id: string): Promise<T | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const document = await this.model.findByIdAndDelete(id).exec();

			logger.db("deleteById", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error deleting ${this.modelName}`, error);
			throw new DatabaseError(`Failed to delete ${this.modelName}`);
		}
	}

	/**
	 * Delete one document by filter
	 */
	async deleteOne(filter: any): Promise<T | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const document = await this.model.findOneAndDelete(filter).exec();

			logger.db("deleteOne", this.modelName, Date.now() - startTime);
			return document;
		} catch (error) {
			logger.error(`Error deleting ${this.modelName}`, error);
			throw new DatabaseError(`Failed to delete ${this.modelName}`);
		}
	}

	/**
	 * Delete multiple documents
	 */
	async deleteMany(filter: any): Promise<number> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const result = await this.model.deleteMany(filter).exec();

			logger.db("deleteMany", this.modelName, Date.now() - startTime);
			return result.deletedCount || 0;
		} catch (error) {
			logger.error(`Error deleting multiple ${this.modelName}`, error);
			throw new DatabaseError(`Failed to delete ${this.modelName}`);
		}
	}

	/**
	 * Count documents
	 */
	async count(filter: any = {}): Promise<number> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const count = await this.model.countDocuments(filter).exec();

			logger.db("count", this.modelName, Date.now() - startTime);
			return count;
		} catch (error) {
			logger.error(`Error counting ${this.modelName}`, error);
			throw new DatabaseError(`Failed to count ${this.modelName}`);
		}
	}

	/**
	 * Check if document exists
	 */
	async exists(filter: any): Promise<boolean> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const exists = await this.model.exists(filter);

			logger.db("exists", this.modelName, Date.now() - startTime);
			return exists !== null;
		} catch (error) {
			logger.error(`Error checking ${this.modelName} existence`, error);
			throw new DatabaseError(`Failed to check ${this.modelName}`);
		}
	}
}
