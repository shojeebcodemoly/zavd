/**
 * Central export file for all models
 *
 * IMPORTANT: This file serves two purposes:
 * 1. Provides convenient re-exports of all models
 * 2. Ensures models are registered with Mongoose for population
 *
 * In serverless environments (Vercel), models need to be explicitly
 * registered before they can be used in .populate() calls.
 */

// Core models
export * from "./user.model";
export * from "./profile.model";

// Product models
export * from "./category.model";
export * from "./product.model";

// Blog models
export * from "./blog-post.model";
export * from "./blog-category.model";
export * from "./blog-comment.model";
