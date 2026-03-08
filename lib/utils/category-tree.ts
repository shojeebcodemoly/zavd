/**
 * Category Tree Utilities
 * Building tree structures and preventing cycles
 */

import type { ICategory, ICategoryTreeNode } from "@/models/category.model";

/**
 * Build a tree structure from flat category array
 */
export function buildCategoryTree(
	categories: ICategory[],
	parentId: string | null = null,
	depth: number = 0,
	parentPath: string = ""
): ICategoryTreeNode[] {
	const nodes: ICategoryTreeNode[] = [];

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

		const node: ICategoryTreeNode = {
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
		node.children = buildCategoryTree(
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
export function flattenCategoryTree(
	tree: ICategoryTreeNode[],
	result: ICategoryTreeNode[] = []
): ICategoryTreeNode[] {
	for (const node of tree) {
		result.push(node);
		if (node.children.length > 0) {
			flattenCategoryTree(node.children, result);
		}
	}
	return result;
}

/**
 * Get all ancestor IDs for a category
 */
export async function getAncestorIds(
	categoryId: string,
	getCategoryById: (id: string) => Promise<ICategory | null>
): Promise<string[]> {
	const ancestors: string[] = [];
	let currentId: string | null = categoryId;
	const visited = new Set<string>();

	while (currentId) {
		// Prevent infinite loops
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
 * Get all descendant IDs for a category (for cascade operations)
 */
export async function getDescendantIds(
	categoryId: string,
	getChildrenByParentId: (parentId: string) => Promise<ICategory[]>
): Promise<string[]> {
	const descendants: string[] = [];
	const queue: string[] = [categoryId];
	const visited = new Set<string>();

	while (queue.length > 0) {
		const currentId = queue.shift()!;

		// Prevent infinite loops
		if (visited.has(currentId)) continue;
		visited.add(currentId);

		const children = await getChildrenByParentId(currentId);

		for (const child of children) {
			const childId = child._id.toString();
			descendants.push(childId);
			queue.push(childId);
		}
	}

	return descendants;
}

/**
 * Check if setting a new parent would create a cycle
 * Returns true if cycle would be created
 */
export async function wouldCreateCycle(
	categoryId: string,
	newParentId: string | null,
	getCategoryById: (id: string) => Promise<ICategory | null>
): Promise<boolean> {
	// If no parent, no cycle possible
	if (!newParentId) {
		return false;
	}

	// Can't be your own parent
	if (categoryId === newParentId) {
		return true;
	}

	// Check if newParentId is a descendant of categoryId
	// (i.e., check if categoryId is an ancestor of newParentId)
	const ancestors = await getAncestorIds(newParentId, getCategoryById);

	// If the category we're editing appears in the ancestors of the new parent,
	// that means newParentId is actually a descendant of categoryId
	// which would create a cycle
	return ancestors.includes(categoryId);
}

/**
 * Validate parent assignment doesn't create cycle
 * Throws error if cycle would be created
 */
export async function validateNoParentCycle(
	categoryId: string,
	newParentId: string | null,
	getCategoryById: (id: string) => Promise<ICategory | null>
): Promise<void> {
	if (await wouldCreateCycle(categoryId, newParentId, getCategoryById)) {
		throw new Error(
			"Cannot set parent: this would create a circular reference in the category tree"
		);
	}
}

/**
 * Get the full path of category names from root to given category
 */
export async function getCategoryBreadcrumb(
	categoryId: string,
	getCategoryById: (id: string) => Promise<ICategory | null>
): Promise<{ id: string; name: string; slug: string }[]> {
	const breadcrumb: { id: string; name: string; slug: string }[] = [];
	let currentId: string | null = categoryId;
	const visited = new Set<string>();

	while (currentId) {
		if (visited.has(currentId)) break;
		visited.add(currentId);

		const category = await getCategoryById(currentId);
		if (!category) break;

		breadcrumb.unshift({
			id: category._id.toString(),
			name: category.name,
			slug: category.slug,
		});

		currentId = category.parent?.toString() || null;
	}

	return breadcrumb;
}

/**
 * Get depth of a category in the tree
 */
export async function getCategoryDepth(
	categoryId: string,
	getCategoryById: (id: string) => Promise<ICategory | null>
): Promise<number> {
	const ancestors = await getAncestorIds(categoryId, getCategoryById);
	return ancestors.length;
}

/**
 * Format tree node for select dropdown with indentation
 */
export function formatTreeForSelect(
	tree: ICategoryTreeNode[]
): { value: string; label: string; disabled?: boolean }[] {
	const options: { value: string; label: string; disabled?: boolean }[] = [];

	function traverse(nodes: ICategoryTreeNode[]) {
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
