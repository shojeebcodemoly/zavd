/**
 * Blog Category Tree Utilities
 * Building tree structures and preventing cycles for blog categories
 */

import type {
	IBlogCategory,
	IBlogCategoryTreeNode,
} from "@/models/blog-category.model";

/**
 * Build a tree structure from flat blog category array
 */
export function buildBlogCategoryTree(
	categories: IBlogCategory[],
	parentId: string | null = null,
	depth: number = 0,
	parentPath: string = ""
): IBlogCategoryTreeNode[] {
	const nodes: IBlogCategoryTreeNode[] = [];

	// Find all categories with the given parent
	const children = categories.filter((cat) => {
		const catParentId = cat.parent?.toString() || null;
		return catParentId === parentId;
	});

	// Sort by order, then by name
	children.sort((a, b) => {
		if (a.order !== b.order) return a.order - b.order;
		return a.name.localeCompare(b.name);
	});

	for (const category of children) {
		const categoryId = category._id.toString();
		const currentPath = parentPath
			? `${parentPath}/${category.slug}`
			: category.slug;

		const node: IBlogCategoryTreeNode = {
			_id: categoryId,
			name: category.name,
			slug: category.slug,
			description: category.description,
			image: category.image,
			order: category.order,
			isActive: category.isActive,
			parent: parentId,
			children: [],
			depth,
			path: currentPath,
		};

		// Recursively build children
		node.children = buildBlogCategoryTree(
			categories,
			categoryId,
			depth + 1,
			currentPath
		);

		nodes.push(node);
	}

	return nodes;
}

/**
 * Flatten a tree back to array (useful for select dropdowns)
 */
export function flattenBlogCategoryTree(
	tree: IBlogCategoryTreeNode[],
	result: IBlogCategoryTreeNode[] = []
): IBlogCategoryTreeNode[] {
	for (const node of tree) {
		result.push(node);
		if (node.children.length > 0) {
			flattenBlogCategoryTree(node.children, result);
		}
	}
	return result;
}

/**
 * Get all ancestor IDs for a blog category
 */
export async function getBlogCategoryAncestorIds(
	categoryId: string,
	getCategoryById: (id: string) => Promise<IBlogCategory | null>
): Promise<string[]> {
	const ancestors: string[] = [];
	let currentId: string | null = categoryId;
	const visited = new Set<string>();

	while (currentId) {
		if (visited.has(currentId)) {
			break;
		}
		visited.add(currentId);

		const category = await getCategoryById(currentId);
		if (!category) break;

		const parentId = category.parent?.toString() || null;
		if (parentId) {
			ancestors.push(parentId);
			currentId = parentId;
		} else {
			break;
		}
	}

	return ancestors;
}

/**
 * Check if setting a new parent would create a cycle
 */
export async function wouldCreateBlogCategoryCycle(
	categoryId: string,
	newParentId: string | null,
	getCategoryById: (id: string) => Promise<IBlogCategory | null>
): Promise<boolean> {
	if (!newParentId) {
		return false;
	}

	if (categoryId === newParentId) {
		return true;
	}

	const ancestors = await getBlogCategoryAncestorIds(
		newParentId,
		getCategoryById
	);
	return ancestors.includes(categoryId);
}

/**
 * Validate parent assignment doesn't create cycle
 */
export async function validateNoBlogCategoryParentCycle(
	categoryId: string,
	newParentId: string | null,
	getCategoryById: (id: string) => Promise<IBlogCategory | null>
): Promise<void> {
	if (
		await wouldCreateBlogCategoryCycle(categoryId, newParentId, getCategoryById)
	) {
		throw new Error(
			"Cannot set parent: this would create a circular reference in the blog category tree"
		);
	}
}

/**
 * Format tree node for select dropdown with indentation
 */
export function formatBlogCategoryTreeForSelect(
	tree: IBlogCategoryTreeNode[]
): { value: string; label: string; disabled?: boolean }[] {
	const options: { value: string; label: string; disabled?: boolean }[] = [];

	function traverse(nodes: IBlogCategoryTreeNode[]) {
		for (const node of nodes) {
			const indent = "—".repeat(node.depth);
			const prefix = node.depth > 0 ? `${indent} ` : "";
			options.push({
				value: node._id,
				label: `${prefix}${node.name}`,
				disabled: !node.isActive,
			});
			if (node.children.length > 0) {
				traverse(node.children);
			}
		}
	}

	traverse(tree);
	return options;
}
