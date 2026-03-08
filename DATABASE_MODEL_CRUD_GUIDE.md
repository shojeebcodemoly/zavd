# Database Model Creation and CRUD Operations Guide

**Project:** Synos Medical Web Application
**Feature:** Step-by-Step Guide for Creating New Database Models
**Date:** December 3, 2025
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Recap](#architecture-recap)
3. [Step-by-Step Model Creation](#step-by-step-model-creation)
4. [Schema Options Reference](#schema-options-reference)
5. [Repository Implementation](#repository-implementation)
6. [Service Layer Implementation](#service-layer-implementation)
7. [API Route Implementation](#api-route-implementation)
8. [Complete Example: Medical Records](#complete-example-medical-records)
9. [Testing Your Implementation](#testing-your-implementation)
10.   [Best Practices Checklist](#best-practices-checklist)

---

## 1. Overview

### 1.1 Purpose

This guide provides a comprehensive, step-by-step process for creating new database models (schemas) and implementing CRUD (Create, Read, Update, Delete) operations in the Synos Medical application.

### 1.2 When to Create a New Model

Create a new database model when you need to:

-  ✓ Store a new type of entity (e.g., Medical Records, Appointments, Prescriptions)
-  ✓ Implement a feature requiring persistent data storage
-  ✓ Separate concerns for better organization
-  ✓ Establish relationships with existing models

### 1.3 Architecture Layers

Every new model requires implementation across all layers:

```
┌─────────────────────────────────────────────────────────┐
│  1. MODEL LAYER                                          │
│     Define schema, fields, validation, relationships    │
│     File: models/[entity].model.ts                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. REPOSITORY LAYER                                     │
│     Data access methods, database queries               │
│     File: lib/repositories/[entity].repository.ts       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. SERVICE LAYER                                        │
│     Business logic, orchestration, validation           │
│     File: lib/services/[entity].service.ts              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. API LAYER                                            │
│     HTTP endpoints, request/response handling           │
│     File: app/api/[entity]/route.ts                     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Recap

### 2.1 Repository Pattern Benefits

```
┌──────────────────────────────────────────────────────────┐
│  WHY USE REPOSITORIES?                                   │
├──────────────────────────────────────────────────────────┤
│  ✓ DRY (Don't Repeat Yourself)                          │
│    Write query once, reuse everywhere                    │
│                                                          │
│  ✓ Testability                                           │
│    Mock repositories easily in unit tests                │
│                                                          │
│  ✓ Maintainability                                       │
│    Database changes affect only repository layer         │
│                                                          │
│  ✓ Flexibility                                           │
│    Switch databases without changing business logic      │
│                                                          │
│  ✓ Abstraction                                           │
│    Hide complex queries behind simple methods            │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Service Pattern Benefits

```
┌──────────────────────────────────────────────────────────┐
│  WHY USE SERVICES?                                       │
├──────────────────────────────────────────────────────────┤
│  ✓ Business Logic Centralization                        │
│    All rules in one place                                │
│                                                          │
│  ✓ Orchestration                                         │
│    Combine multiple repository calls                     │
│                                                          │
│  ✓ Validation                                            │
│    Enforce business rules before database operations     │
│                                                          │
│  ✓ Transaction Management                                │
│    Handle complex multi-step operations                  │
│                                                          │
│  ✓ Reusability                                           │
│    Use same service from multiple API routes             │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Model Creation

### STEP 1: Define the Model Schema

**Location:** `models/[entity].model.ts`

**Template:**

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * TypeScript Interface
 * Defines the shape of your document
 */
export interface I[EntityName] extends Document {
  _id: mongoose.Types.ObjectId;

  console.logAdd your fields here with types
  fieldName: string;
  anotherField: number;
  optionalField?: boolean;

  console.logTimestamps (added automatically if timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema
 * Defines validation, defaults, and database structure
 */
const [EntityName]Schema = new Schema<I[EntityName]>(
  {
    console.logDefine fields with validation
    fieldName: {
      type: String,
      required: true,
      trim: true,
      console.logAdd more validation as needed
    },

    anotherField: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },

    optionalField: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,           console.logAuto-manage createdAt, updatedAt
    collection: "[collection_name]",  console.logMongoDB collection name
  }
);

console.logAdd indexes for performance
[EntityName]Schema.index({ fieldName: 1 });
[EntityName]Schema.index({ createdAt: -1 });

console.logConfigure JSON output
[EntityName]Schema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

/**
 * Get Model Function (Async)
 * Ensures database connection before returning model
 */
export async function get[EntityName]Model(): Promise<Model<I[EntityName]>> {
  await connectMongoose();

  return (
    (mongoose.models.[EntityName] as Model<I[EntityName]>) ||
    mongoose.model<I[EntityName]>("[EntityName]", [EntityName]Schema)
  );
}

/**
 * Get Model Function (Sync)
 * For use in repositories (connection must be established first)
 */
export function get[EntityName]ModelSync(): Model<I[EntityName]> {
  return (
    (mongoose.models.[EntityName] as Model<I[EntityName]>) ||
    mongoose.model<I[EntityName]>("[EntityName]", [EntityName]Schema)
  );
}
```

**Example: Medical Record Model**

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IMedicalRecord extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId; console.logReference to User
	patientId: string;
	recordType: "consultation" | "lab" | "imaging" | "prescription";
	title: string;
	description: string;
	date: Date;
	attachments: string[]; console.logURLs to files
	metadata: Record<string, any>; console.logFlexible field for additional data
	createdAt: Date;
	updatedAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
			index: true,
		},
		patientId: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		recordType: {
			type: String,
			required: true,
			enum: ["consultation", "lab", "imaging", "prescription"],
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxlength: 2000,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		attachments: {
			type: [String],
			default: [],
		},
		metadata: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "medical_records",
	}
);

console.logIndexes
MedicalRecordSchema.index({ userId: 1, date: -1 });
MedicalRecordSchema.index({ patientId: 1 });
MedicalRecordSchema.index({ recordType: 1 });
MedicalRecordSchema.index({ createdAt: -1 });

console.logVirtual for user (enables .populate('user'))
MedicalRecordSchema.virtual("user", {
	ref: "User",
	localField: "userId",
	foreignField: "_id",
	justOne: true,
});

MedicalRecordSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.__v;
		return ret;
	},
});

export async function getMedicalRecordModel(): Promise<Model<IMedicalRecord>> {
	await connectMongoose();
	return (
		(mongoose.models.MedicalRecord as Model<IMedicalRecord>) ||
		mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema)
	);
}

export function getMedicalRecordModelSync(): Model<IMedicalRecord> {
	return (
		(mongoose.models.MedicalRecord as Model<IMedicalRecord>) ||
		mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema)
	);
}
```

---

### STEP 2: Create the Repository

**Location:** `lib/repositories/[entity].repository.ts`

**Template:**

```typescript
import { BaseRepository } from "./base.repository";
import { I[EntityName], get[EntityName]ModelSync } from "@/models/[entity].model";
import { logger } from "@/lib/utils/logger";
import mongoose from "mongoose";

/**
 * [EntityName] Repository
 * Handles [entity]-specific data access operations
 */
export class [EntityName]Repository extends BaseRepository<I[EntityName]> {
  constructor() {
    super(get[EntityName]ModelSync());
  }

  /**
   * Add custom query methods here
   * These extend the base repository CRUD operations
   */

  /**
   * Example: Find by specific field
   */
  async findByFieldName(value: string): Promise<I[EntityName] | null> {
    try {
      return await this.findOne({ fieldName: value });
    } catch (error) {
      logger.error("Error finding [entity] by field", error);
      throw error;
    }
  }

  /**
   * Example: Find all for a user
   */
  async findAllByUserId(
    userId: string | mongoose.Types.ObjectId
  ): Promise<I[EntityName][]> {
    try {
      const objectId = typeof userId === "string"
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      return await this.findAll(
        { userId: objectId },
        { sort: { createdAt: -1 } }
      );
    } catch (error) {
      logger.error("Error finding [entities] by user ID", error);
      throw error;
    }
  }

  /**
   * Example: Find with pagination
   */
  async findPaginatedByUserId(
    userId: string | mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const objectId = typeof userId === "string"
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      return await this.findPaginated(
        { userId: objectId },
        page,
        limit,
        { createdAt: -1 }
      );
    } catch (error) {
      logger.error("Error finding paginated [entities]", error);
      throw error;
    }
  }

  /**
   * Example: Search by text
   */
  async searchByTitle(searchTerm: string): Promise<I[EntityName][]> {
    try {
      return await this.findAll({
        title: { $regex: searchTerm, $options: "i" }
      });
    } catch (error) {
      logger.error("Error searching [entities]", error);
      throw error;
    }
  }

  /**
   * Example: Update with validation
   */
  async updateWithValidation(
    id: string,
    updateData: Partial<I[EntityName]>
  ): Promise<I[EntityName] | null> {
    try {
      console.logCustom validation logic here
      if (updateData.fieldName && updateData.fieldName.length < 3) {
        throw new Error("Field name must be at least 3 characters");
      }

      return await this.updateById(id, { $set: updateData });
    } catch (error) {
      logger.error("Error updating [entity]", error);
      throw error;
    }
  }
}

console.logExport singleton instance
export const [entity]Repository = new [EntityName]Repository();
```

**Example: Medical Record Repository**

```typescript
import { BaseRepository } from "./base.repository";
import {
	IMedicalRecord,
	getMedicalRecordModelSync,
} from "@/models/medical-record.model";
import { logger } from "@/lib/utils/logger";
import mongoose from "mongoose";

export class MedicalRecordRepository extends BaseRepository<IMedicalRecord> {
	constructor() {
		super(getMedicalRecordModelSync());
	}

	/**
	 * Find all records for a specific user
	 */
	async findByUserId(
		userId: string | mongoose.Types.ObjectId
	): Promise<IMedicalRecord[]> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;

			return await this.findAll(
				{ userId: objectId },
				{ sort: { date: -1 } }
			);
		} catch (error) {
			logger.error("Error finding medical records by user ID", error);
			throw error;
		}
	}

	/**
	 * Find records by patient ID
	 */
	async findByPatientId(patientId: string): Promise<IMedicalRecord[]> {
		try {
			return await this.findAll({ patientId }, { sort: { date: -1 } });
		} catch (error) {
			logger.error("Error finding medical records by patient ID", error);
			throw error;
		}
	}

	/**
	 * Find records by type
	 */
	async findByType(
		userId: string | mongoose.Types.ObjectId,
		recordType: string
	): Promise<IMedicalRecord[]> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;

			return await this.findAll(
				{ userId: objectId, recordType },
				{ sort: { date: -1 } }
			);
		} catch (error) {
			logger.error("Error finding medical records by type", error);
			throw error;
		}
	}

	/**
	 * Find records with date range
	 */
	async findByDateRange(
		userId: string | mongoose.Types.ObjectId,
		startDate: Date,
		endDate: Date
	): Promise<IMedicalRecord[]> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;

			return await this.findAll(
				{
					userId: objectId,
					date: {
						$gte: startDate,
						$lte: endDate,
					},
				},
				{ sort: { date: -1 } }
			);
		} catch (error) {
			logger.error("Error finding medical records by date range", error);
			throw error;
		}
	}

	/**
	 * Search records by title or description
	 */
	async searchRecords(
		userId: string | mongoose.Types.ObjectId,
		searchTerm: string
	): Promise<IMedicalRecord[]> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;

			return await this.findAll({
				userId: objectId,
				$or: [
					{ title: { $regex: searchTerm, $options: "i" } },
					{ description: { $regex: searchTerm, $options: "i" } },
				],
			});
		} catch (error) {
			logger.error("Error searching medical records", error);
			throw error;
		}
	}

	/**
	 * Add attachment to record
	 */
	async addAttachment(
		recordId: string,
		attachmentUrl: string
	): Promise<IMedicalRecord | null> {
		try {
			return await this.updateById(recordId, {
				$push: { attachments: attachmentUrl },
			});
		} catch (error) {
			logger.error("Error adding attachment", error);
			throw error;
		}
	}

	/**
	 * Remove attachment from record
	 */
	async removeAttachment(
		recordId: string,
		attachmentUrl: string
	): Promise<IMedicalRecord | null> {
		try {
			return await this.updateById(recordId, {
				$pull: { attachments: attachmentUrl },
			});
		} catch (error) {
			logger.error("Error removing attachment", error);
			throw error;
		}
	}
}

export const medicalRecordRepository = new MedicalRecordRepository();
```

---

### STEP 3: Create the Service Layer

**Location:** `lib/services/[entity].service.ts`

**Template:**

```typescript
import { [entity]Repository } from "@/lib/repositories/[entity].repository";
import { logger } from "@/lib/utils/logger";
import {
  NotFoundError,
  DatabaseError,
  BadRequestError,
} from "@/lib/utils/api-error";
import { API_MESSAGES } from "@/lib/utils/constants";
import type { I[EntityName] } from "@/models/[entity].model";

/**
 * [EntityName] Service
 * Handles business logic for [entity] operations
 */
class [EntityName]Service {
  /**
   * Create new [entity]
   */
  async create[EntityName](data: Partial<I[EntityName]>): Promise<I[EntityName]> {
    try {
      console.logValidate input
      if (!data.requiredField) {
        throw new BadRequestError("Required field is missing");
      }

      console.logCreate entity
      const entity = await [entity]Repository.create(data);

      logger.info("[EntityName] created", { entityId: entity._id });

      return entity;
    } catch (error) {
      logger.error("Error creating [entity]", error);

      if (error instanceof BadRequestError) {
        throw error;
      }

      throw new DatabaseError("Failed to create [entity]");
    }
  }

  /**
   * Get [entity] by ID
   */
  async get[EntityName]ById(id: string): Promise<I[EntityName]> {
    try {
      const entity = await [entity]Repository.findById(id);

      if (!entity) {
        throw new NotFoundError(API_MESSAGES.[ENTITY]_NOT_FOUND);
      }

      return entity;
    } catch (error) {
      logger.error("Error getting [entity]", error);

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DatabaseError("Failed to get [entity]");
    }
  }

  /**
   * Update [entity]
   */
  async update[EntityName](
    id: string,
    data: Partial<I[EntityName]>
  ): Promise<I[EntityName]> {
    try {
      console.logValidate update data
      console.logAdd your validation logic here

      const updated = await [entity]Repository.updateById(id, {
        $set: data
      });

      if (!updated) {
        throw new NotFoundError(API_MESSAGES.[ENTITY]_NOT_FOUND);
      }

      logger.info("[EntityName] updated", { entityId: id });

      return updated;
    } catch (error) {
      logger.error("Error updating [entity]", error);

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DatabaseError("Failed to update [entity]");
    }
  }

  /**
   * Delete [entity]
   */
  async delete[EntityName](id: string): Promise<void> {
    try {
      const deleted = await [entity]Repository.deleteById(id);

      if (!deleted) {
        throw new NotFoundError(API_MESSAGES.[ENTITY]_NOT_FOUND);
      }

      logger.info("[EntityName] deleted", { entityId: id });
    } catch (error) {
      logger.error("Error deleting [entity]", error);

      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DatabaseError("Failed to delete [entity]");
    }
  }

  /**
   * Get all [entities] for user
   */
  async get[EntityName]sForUser(userId: string): Promise<I[EntityName][]> {
    try {
      return await [entity]Repository.findAllByUserId(userId);
    } catch (error) {
      logger.error("Error getting [entities] for user", error);
      throw new DatabaseError("Failed to get [entities]");
    }
  }
}

console.logExport singleton instance
export const [entity]Service = new [EntityName]Service();
```

**Example: Medical Record Service**

```typescript
import { medicalRecordRepository } from "@/lib/repositories/medical-record.repository";
import { logger } from "@/lib/utils/logger";
import {
	NotFoundError,
	DatabaseError,
	BadRequestError,
} from "@/lib/utils/api-error";
import { API_MESSAGES } from "@/lib/utils/constants";
import type { IMedicalRecord } from "@/models/medical-record.model";

class MedicalRecordService {
	/**
	 * Create new medical record
	 */
	async createRecord(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
		try {
			console.logValidate required fields
			if (!data.userId || !data.patientId || !data.title) {
				throw new BadRequestError("Missing required fields");
			}

			console.logValidate record type
			const validTypes = ["consultation", "lab", "imaging", "prescription"];
			if (data.recordType && !validTypes.includes(data.recordType)) {
				throw new BadRequestError("Invalid record type");
			}

			console.logCreate record
			const record = await medicalRecordRepository.create(data);

			logger.info("Medical record created", {
				recordId: record._id,
				userId: record.userId,
			});

			return record;
		} catch (error) {
			logger.error("Error creating medical record", error);

			if (error instanceof BadRequestError) {
				throw error;
			}

			throw new DatabaseError("Failed to create medical record");
		}
	}

	/**
	 * Get record by ID with authorization check
	 */
	async getRecordById(
		recordId: string,
		userId: string
	): Promise<IMedicalRecord> {
		try {
			const record = await medicalRecordRepository.findById(recordId);

			if (!record) {
				throw new NotFoundError("Medical record not found");
			}

			console.logAuthorization: Check if record belongs to user
			if (record.userId.toString() !== userId) {
				throw new NotFoundError("Medical record not found");
			}

			return record;
		} catch (error) {
			logger.error("Error getting medical record", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to get medical record");
		}
	}

	/**
	 * Get all records for user
	 */
	async getRecordsForUser(userId: string): Promise<IMedicalRecord[]> {
		try {
			return await medicalRecordRepository.findByUserId(userId);
		} catch (error) {
			logger.error("Error getting medical records for user", error);
			throw new DatabaseError("Failed to get medical records");
		}
	}

	/**
	 * Get records by type
	 */
	async getRecordsByType(
		userId: string,
		recordType: string
	): Promise<IMedicalRecord[]> {
		try {
			return await medicalRecordRepository.findByType(userId, recordType);
		} catch (error) {
			logger.error("Error getting medical records by type", error);
			throw new DatabaseError("Failed to get medical records");
		}
	}

	/**
	 * Update record
	 */
	async updateRecord(
		recordId: string,
		userId: string,
		data: Partial<IMedicalRecord>
	): Promise<IMedicalRecord> {
		try {
			console.logCheck ownership
			const record = await this.getRecordById(recordId, userId);

			console.logPrevent changing userId
			delete data.userId;

			const updated = await medicalRecordRepository.updateById(recordId, {
				$set: data,
			});

			if (!updated) {
				throw new DatabaseError("Failed to update record");
			}

			logger.info("Medical record updated", { recordId });

			return updated;
		} catch (error) {
			logger.error("Error updating medical record", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to update medical record");
		}
	}

	/**
	 * Delete record
	 */
	async deleteRecord(recordId: string, userId: string): Promise<void> {
		try {
			console.logCheck ownership
			await this.getRecordById(recordId, userId);

			const deleted = await medicalRecordRepository.deleteById(recordId);

			if (!deleted) {
				throw new DatabaseError("Failed to delete record");
			}

			logger.info("Medical record deleted", { recordId });
		} catch (error) {
			logger.error("Error deleting medical record", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to delete medical record");
		}
	}

	/**
	 * Search records
	 */
	async searchRecords(
		userId: string,
		searchTerm: string
	): Promise<IMedicalRecord[]> {
		try {
			if (!searchTerm || searchTerm.trim() === "") {
				return await this.getRecordsForUser(userId);
			}

			return await medicalRecordRepository.searchRecords(
				userId,
				searchTerm.trim()
			);
		} catch (error) {
			logger.error("Error searching medical records", error);
			throw new DatabaseError("Failed to search medical records");
		}
	}
}

export const medicalRecordService = new MedicalRecordService();
```

---

### STEP 4: Create API Routes

**Location:** `app/api/[entity]/route.ts`

**Template:**

```typescript
import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { [entity]Service } from "@/lib/services/[entity].service";
import { logger } from "@/lib/utils/logger";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";

/**
 * GET /api/[entity]
 * Get all [entities] for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    console.logValidate session
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
    }

    console.logGet user ID from session
    const userId = session.user.id;

    console.logFetch entities
    const entities = await [entity]Service.get[EntityName]sForUser(userId);

    return successResponse(entities, "[Entities] retrieved successfully");
  } catch (error) {
    logger.error("Error in GET /api/[entity]", error);
    return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * POST /api/[entity]
 * Create new [entity]
 */
export async function POST(request: NextRequest) {
  try {
    console.logValidate session
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
    }

    console.logGet user ID from session
    const userId = session.user.id;

    console.logParse request body
    const body = await request.json();

    console.logAdd userId to data
    const data = {
      ...body,
      userId,
    };

    console.logCreate entity
    const entity = await [entity]Service.create[EntityName](data);

    return createdResponse(entity, "[EntityName] created successfully");
  } catch (error) {
    logger.error("Error in POST /api/[entity]", error);

    if (error instanceof BadRequestError) {
      return badRequestResponse(error.message);
    }

    return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
  }
}
```

**Location:** `app/api/[entity]/[id]/route.ts` (for single entity operations)

```typescript
import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { [entity]Service } from "@/lib/services/[entity].service";
import { logger } from "@/lib/utils/logger";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";
import { NotFoundError } from "@/lib/utils/api-error";

/**
 * GET /api/[entity]/[id]
 * Get single [entity] by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.logValidate session
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
    }

    const userId = session.user.id;
    const entityId = params.id;

    console.logGet entity
    const entity = await [entity]Service.get[EntityName]ById(entityId, userId);

    return successResponse(entity, "[EntityName] retrieved successfully");
  } catch (error) {
    logger.error("Error in GET /api/[entity]/[id]", error);

    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }

    return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * PATCH /api/[entity]/[id]
 * Update [entity]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.logValidate session
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
    }

    const userId = session.user.id;
    const entityId = params.id;

    console.logParse request body
    const body = await request.json();

    console.logUpdate entity
    const updated = await [entity]Service.update[EntityName](
      entityId,
      userId,
      body
    );

    return successResponse(updated, "[EntityName] updated successfully");
  } catch (error) {
    logger.error("Error in PATCH /api/[entity]/[id]", error);

    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }

    return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * DELETE /api/[entity]/[id]
 * Delete [entity]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.logValidate session
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user) {
      return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
    }

    const userId = session.user.id;
    const entityId = params.id;

    console.logDelete entity
    await [entity]Service.delete[EntityName](entityId, userId);

    return successResponse(null, "[EntityName] deleted successfully");
  } catch (error) {
    logger.error("Error in DELETE /api/[entity]/[id]", error);

    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }

    return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
  }
}
```

---

## 4. Schema Options Reference

### 4.1 Field Type Options

| Type         | Description            | Example                                    |
| ------------ | ---------------------- | ------------------------------------------ |
| `String`     | Text data              | `name: { type: String }`                   |
| `Number`     | Numeric data           | `age: { type: Number }`                    |
| `Boolean`    | True/false             | `isActive: { type: Boolean }`              |
| `Date`       | Date/time              | `createdAt: { type: Date }`                |
| `ObjectId`   | Reference              | `userId: { type: Schema.Types.ObjectId }`  |
| `Array`      | List of values         | `tags: { type: [String] }`                 |
| `Mixed`      | Any type               | `metadata: { type: Schema.Types.Mixed }`   |
| `Buffer`     | Binary data            | `file: { type: Buffer }`                   |
| `Decimal128` | High precision decimal | `price: { type: Schema.Types.Decimal128 }` |

### 4.2 Common Field Options

| Option      | Type             | Description                   | Example                       |
| ----------- | ---------------- | ----------------------------- | ----------------------------- |
| `type`      | SchemaType       | Data type                     | `String`, `Number`, etc.      |
| `required`  | Boolean/Function | Field is mandatory            | `required: true`              |
| `default`   | Any/Function     | Default value                 | `default: 0`                  |
| `unique`    | Boolean          | Must be unique                | `unique: true`                |
| `index`     | Boolean          | Create index                  | `index: true`                 |
| `sparse`    | Boolean          | Sparse index (allows nulls)   | `sparse: true`                |
| `trim`      | Boolean          | Remove whitespace (String)    | `trim: true`                  |
| `lowercase` | Boolean          | Convert to lowercase (String) | `lowercase: true`             |
| `uppercase` | Boolean          | Convert to uppercase (String) | `uppercase: true`             |
| `minlength` | Number           | Min string length             | `minlength: 3`                |
| `maxlength` | Number           | Max string length             | `maxlength: 100`              |
| `min`       | Number           | Min numeric value             | `min: 0`                      |
| `max`       | Number           | Max numeric value             | `max: 100`                    |
| `enum`      | Array            | Allowed values                | `enum: ['a', 'b', 'c']`       |
| `match`     | RegExp           | Regex validation              | `match: /^[a-z]+$/`           |
| `validate`  | Function         | Custom validator              | `validate: (v) => v > 0`      |
| `get`       | Function         | Transform on retrieval        | `get: (v) => v.toFixed(2)`    |
| `set`       | Function         | Transform on save             | `set: (v) => v.toLowerCase()` |
| `ref`       | String           | Model reference               | `ref: 'User'`                 |
| `select`    | Boolean          | Include in queries            | `select: false`               |
| `immutable` | Boolean          | Cannot be changed             | `immutable: true`             |

### 4.3 Schema Options

| Option       | Type           | Description                | Example                        |
| ------------ | -------------- | -------------------------- | ------------------------------ |
| `timestamps` | Boolean        | Add createdAt/updatedAt    | `timestamps: true`             |
| `collection` | String         | Collection name            | `collection: 'users'`          |
| `strict`     | Boolean/String | Strict mode                | `strict: true`                 |
| `versionKey` | String/Boolean | Version key name           | `versionKey: false`            |
| `minimize`   | Boolean        | Remove empty objects       | `minimize: false`              |
| `toJSON`     | Object         | JSON serialization options | `toJSON: { virtuals: true }`   |
| `toObject`   | Object         | Object conversion options  | `toObject: { virtuals: true }` |
| `id`         | Boolean        | Create virtual id          | `id: false`                    |
| `_id`        | Boolean        | Create \_id field          | `_id: true`                    |

### 4.4 Index Types

```typescript
console.logSingle field index
Schema.index({ fieldName: 1 }); console.logAscending
Schema.index({ fieldName: -1 }); console.logDescending

console.logCompound index
Schema.index({ field1: 1, field2: -1 });

console.logUnique index
Schema.index({ email: 1 }, { unique: true });

console.logSparse index (ignores documents without field)
Schema.index({ optionalField: 1 }, { sparse: true });

console.logText index (for full-text search)
Schema.index({ title: "text", description: "text" });

console.logTTL index (auto-delete after time)
Schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

console.logPartial index (index subset of documents)
Schema.index(
	{ status: 1 },
	{ partialFilterExpression: { status: { $exists: true } } }
);
```

### 4.5 Virtual Fields

```typescript
console.logSimple virtual
Schema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

console.logVirtual with setter
Schema.virtual("fullName")
	.get(function () {
		return `${this.firstName} ${this.lastName}`;
	})
	.set(function (name: string) {
		const parts = name.split(" ");
		this.firstName = parts[0];
		this.lastName = parts[1];
	});

console.logVirtual populate (relationship)
Schema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "authorId",
	justOne: false, console.logReturns array
});
```

### 4.6 Middleware (Hooks)

```typescript
console.logPre-save hook
Schema.pre("save", async function (next) {
	console.logRuns before saving
	if (this.isModified("password")) {
		this.password = await hash(this.password);
	}
	next();
});

console.logPost-save hook
Schema.post("save", function (doc, next) {
	console.logRuns after saving
	console.logconsole.log("Document saved:", doc._id);
	next();
});

console.logPre-remove hook
Schema.pre("remove", async function (next) {
	console.logCascade delete related documents
	await RelatedModel.deleteMany({ userId: this._id });
	next();
});

console.logQuery middleware
Schema.pre(/^find/, function (next) {
	console.logRuns before any find query
	this.populate("author");
	next();
});
```

---

## 5. Complete Example: Medical Records

Let's walk through a complete implementation for a Medical Records feature.

### 5.1 Model (models/medical-record.model.ts)

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IMedicalRecord extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	patientId: string;
	recordType: "consultation" | "lab" | "imaging" | "prescription";
	title: string;
	description: string;
	date: Date;
	attachments: string[];
	metadata: {
		doctor?: string;
		facility?: string;
		diagnosis?: string;
		[key: string]: any;
	};
	createdAt: Date;
	updatedAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
			index: true,
		},
		patientId: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		recordType: {
			type: String,
			required: true,
			enum: ["consultation", "lab", "imaging", "prescription"],
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxlength: 2000,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
			index: true,
		},
		attachments: {
			type: [String],
			default: [],
			validate: {
				validator: function (arr: string[]) {
					return arr.length <= 10;
				},
				message: "Cannot have more than 10 attachments",
			},
		},
		metadata: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "medical_records",
	}
);

console.logCompound indexes for common queries
MedicalRecordSchema.index({ userId: 1, date: -1 });
MedicalRecordSchema.index({ userId: 1, recordType: 1 });
MedicalRecordSchema.index({ patientId: 1, date: -1 });

console.logText index for search
MedicalRecordSchema.index({ title: "text", description: "text" });

console.logVirtual for user
MedicalRecordSchema.virtual("user", {
	ref: "User",
	localField: "userId",
	foreignField: "_id",
	justOne: true,
});

console.logPre-save middleware
MedicalRecordSchema.pre("save", function (next) {
	console.logEnsure date is not in future
	if (this.date > new Date()) {
		const error = new Error("Record date cannot be in the future");
		return next(error);
	}
	next();
});

MedicalRecordSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.__v;
		return ret;
	},
});

export async function getMedicalRecordModel(): Promise<Model<IMedicalRecord>> {
	await connectMongoose();
	return (
		(mongoose.models.MedicalRecord as Model<IMedicalRecord>) ||
		mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema)
	);
}

export function getMedicalRecordModelSync(): Model<IMedicalRecord> {
	return (
		(mongoose.models.MedicalRecord as Model<IMedicalRecord>) ||
		mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema)
	);
}
```

### 5.2 Repository (lib/repositories/medical-record.repository.ts)

See earlier example in Step 2.

### 5.3 Service (lib/services/medical-record.service.ts)

See earlier example in Step 3.

### 5.4 API Routes

**File: app/api/medical-records/route.ts**

```typescript
import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { medicalRecordService } from "@/lib/services/medical-record.service";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	createdResponse,
	unauthorizedResponse,
	badRequestResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";
import { BadRequestError } from "@/lib/utils/api-error";

/**
 * GET /api/medical-records
 * Get all medical records for authenticated user
 */
export async function GET(request: NextRequest) {
	try {
		console.logValidate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session || !session.user) {
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		console.logGet Mongoose user
		const { user } = await userService.getUserWithProfile(session.user.id);

		console.logGet query parameters
		const { searchParams } = new URL(request.url);
		const recordType = searchParams.get("type");
		const searchTerm = searchParams.get("search");

		console.logFetch records based on filters
		let records;
		if (searchTerm) {
			records = await medicalRecordService.searchRecords(
				user._id.toString(),
				searchTerm
			);
		} else if (recordType) {
			records = await medicalRecordService.getRecordsByType(
				user._id.toString(),
				recordType
			);
		} else {
			records = await medicalRecordService.getRecordsForUser(
				user._id.toString()
			);
		}

		return successResponse(records, "Medical records retrieved successfully");
	} catch (error) {
		logger.error("Error in GET /api/medical-records", error);
		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}

/**
 * POST /api/medical-records
 * Create new medical record
 */
export async function POST(request: NextRequest) {
	try {
		console.logValidate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session || !session.user) {
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		console.logGet Mongoose user
		const { user } = await userService.getUserWithProfile(session.user.id);

		console.logParse request body
		const body = await request.json();

		console.logValidate required fields
		if (!body.patientId || !body.title || !body.recordType) {
			return badRequestResponse("Missing required fields");
		}

		console.logCreate record
		const record = await medicalRecordService.createRecord({
			...body,
			userId: user._id,
		});

		return createdResponse(record, "Medical record created successfully");
	} catch (error) {
		logger.error("Error in POST /api/medical-records", error);

		if (error instanceof BadRequestError) {
			return badRequestResponse(error.message);
		}

		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}
```

**File: app/api/medical-records/[id]/route.ts**

```typescript
import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { medicalRecordService } from "@/lib/services/medical-record.service";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";
import { NotFoundError } from "@/lib/utils/api-error";

/**
 * GET /api/medical-records/[id]
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session || !session.user) {
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		const { user } = await userService.getUserWithProfile(session.user.id);

		const record = await medicalRecordService.getRecordById(
			params.id,
			user._id.toString()
		);

		return successResponse(record, "Medical record retrieved successfully");
	} catch (error) {
		logger.error("Error in GET /api/medical-records/[id]", error);

		if (error instanceof NotFoundError) {
			return notFoundResponse(error.message);
		}

		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}

/**
 * PATCH /api/medical-records/[id]
 */
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session || !session.user) {
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		const { user } = await userService.getUserWithProfile(session.user.id);
		const body = await request.json();

		const updated = await medicalRecordService.updateRecord(
			params.id,
			user._id.toString(),
			body
		);

		return successResponse(updated, "Medical record updated successfully");
	} catch (error) {
		logger.error("Error in PATCH /api/medical-records/[id]", error);

		if (error instanceof NotFoundError) {
			return notFoundResponse(error.message);
		}

		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}

/**
 * DELETE /api/medical-records/[id]
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session || !session.user) {
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		const { user } = await userService.getUserWithProfile(session.user.id);

		await medicalRecordService.deleteRecord(params.id, user._id.toString());

		return successResponse(null, "Medical record deleted successfully");
	} catch (error) {
		logger.error("Error in DELETE /api/medical-records/[id]", error);

		if (error instanceof NotFoundError) {
			return notFoundResponse(error.message);
		}

		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}
```

---

## 6. Testing Your Implementation

### 6.1 Manual Testing with curl

```bash
# Get session token
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' \
  -c cookies.txt

# Create medical record
curl -X POST http://localhost:3000/api/medical-records \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "patientId": "P12345",
    "recordType": "consultation",
    "title": "Annual Checkup",
    "description": "Regular health checkup",
    "date": "2025-12-01T10:00:00Z"
  }'

# Get all records
curl -X GET http://localhost:3000/api/medical-records \
  -b cookies.txt

# Get single record
curl -X GET http://localhost:3000/api/medical-records/[record-id] \
  -b cookies.txt

# Update record
curl -X PATCH http://localhost:3000/api/medical-records/[record-id] \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title": "Updated Title"}'

# Delete record
curl -X DELETE http://localhost:3000/api/medical-records/[record-id] \
  -b cookies.txt
```

### 6.2 Database Verification

```javascript
console.logConnect to MongoDB
mongosh mongodb://127.0.0.1:27017/synos-db

console.logCheck collection
db.medical_records.find().pretty()

console.logCheck indexes
db.medical_records.getIndexes()

console.logVerify relationships
db.medical_records.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $project: {
      title: 1,
      "user.name": 1,
      "user.email": 1
    }
  }
])
```

---

## 7. Best Practices Checklist

### ✓ Model Layer

-  [ ] Interface defined with proper TypeScript types
-  [ ] All required fields marked with `required: true`
-  [ ] Appropriate indexes created for query performance
-  [ ] Virtual fields defined for relationships
-  [ ] Validation rules implemented (min, max, enum, custom)
-  [ ] Timestamps enabled (`timestamps: true`)
-  [ ] Explicit collection name set
-  [ ] Both async and sync model getters exported

### ✓ Repository Layer

-  [ ] Extends BaseRepository for standard CRUD
-  [ ] Custom query methods for specific use cases
-  [ ] Error logging in all methods
-  [ ] ObjectId conversion handled properly
-  [ ] Singleton instance exported
-  [ ] Connection ensured before queries

### ✓ Service Layer

-  [ ] Business logic centralized
-  [ ] Input validation before database operations
-  [ ] Custom error types thrown (NotFoundError, BadRequestError, etc.)
-  [ ] Comprehensive logging
-  [ ] Authorization checks where needed
-  [ ] Singleton instance exported

### ✓ API Layer

-  [ ] Session validation in all protected routes
-  [ ] Proper HTTP status codes used
-  [ ] Error handling with try-catch
-  [ ] Request body validation
-  [ ] Consistent response format
-  [ ] Logging for all operations

### ✓ Security

-  [ ] User ID from session, not request body
-  [ ] Authorization checks (data belongs to user)
-  [ ] Input sanitization
-  [ ] No sensitive data in responses
-  [ ] HTTP-only cookies used

### ✓ Performance

-  [ ] Indexes on frequently queried fields
-  [ ] Compound indexes for common query combinations
-  [ ] Pagination for large datasets
-  [ ] Selective field projection when possible
-  [ ] Connection pooling configured

---

**Document Version:** 1.0
**Last Updated:** December 3, 2025
**Author:** Claude (Anthropic AI Assistant)
**Project:** Synos Medical - Database Model & CRUD Guide

---
