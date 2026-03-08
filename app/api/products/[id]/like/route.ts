import { NextRequest, NextResponse } from "next/server";
import { getProductModel } from "@/models/product.model";

/**
 * POST /api/products/[id]/like
 * Increment like count for a product
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 }
			);
		}

		const Product = await getProductModel();

		// Increment like count atomically
		const product = await Product.findByIdAndUpdate(
			id,
			{ $inc: { likeCount: 1 } },
			{ new: true, select: "likeCount" }
		);

		if (!product) {
			return NextResponse.json(
				{ error: "Product not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			likeCount: product.likeCount,
		});
	} catch (error) {
		console.error("Error liking product:", error);
		return NextResponse.json(
			{ error: "Failed to like product" },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/products/[id]/like
 * Decrement like count for a product (unlike)
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 }
			);
		}

		const Product = await getProductModel();

		// Decrement like count atomically, but don't go below 0
		const product = await Product.findOneAndUpdate(
			{ _id: id, likeCount: { $gt: 0 } },
			{ $inc: { likeCount: -1 } },
			{ new: true, select: "likeCount" }
		);

		if (!product) {
			// Either product not found or likeCount already 0
			const existingProduct = await Product.findById(id, "likeCount");
			if (!existingProduct) {
				return NextResponse.json(
					{ error: "Product not found" },
					{ status: 404 }
				);
			}
			return NextResponse.json({
				success: true,
				likeCount: existingProduct.likeCount,
			});
		}

		return NextResponse.json({
			success: true,
			likeCount: product.likeCount,
		});
	} catch (error) {
		console.error("Error unliking product:", error);
		return NextResponse.json(
			{ error: "Failed to unlike product" },
			{ status: 500 }
		);
	}
}
