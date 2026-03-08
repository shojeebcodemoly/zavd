"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Loader2,
	Plus,
	Trash2,
	AlertCircle,
	AlertTriangle,
	Save,
	Send,
	GripVertical,
	ImageIcon,
	FileText,
	X,
	Undo2,
	ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TagInput } from "./TagInput";
import { TreeSelect } from "./TreeSelect";
import { MediaPicker, MediaGallery } from "@/components/storage";
import { SeoPreview, SeoAnalysis, CharacterCount } from "./seo";
import type { FileMetadata } from "@/lib/storage/client";
import {
	createProductDraftSchema,
	updateProductSchema,
	type CreateProductDraftInput,
	type UpdateProductInput,
} from "@/lib/validations/product.validation";
import { generateSlug } from "@/lib/utils/product-helpers";
import type { IProduct } from "@/models/product.model";
import type { ICategoryTreeNode } from "@/models/category.model";
import type { PublishValidationError } from "@/lib/services/product.service";
import TextEditor from "../common/TextEditor";
import { ImageComponent } from "../common/image-component";

/**
 * ProductImageGallery Component
 * Manages multiple product images with drag-to-reorder and MediaGallery multi-select
 */
interface ProductImageGalleryProps {
	images: string[];
	onChange: (urls: string[]) => void;
	disabled?: boolean;
}

function ProductImageGallery({
	images = [],
	onChange,
	disabled = false,
}: ProductImageGalleryProps) {
	const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
	const [dragIndex, setDragIndex] = React.useState<number | null>(null);

	// Handle multi-select from gallery - adds new images that aren't already in the list
	const handleMultiSelect = (files: FileMetadata[]) => {
		const newUrls = files
			.map((f) => f.url)
			.filter((url) => !images.includes(url));
		if (newUrls.length > 0) {
			onChange([...images, ...newUrls]);
		}
	};

	const handleRemoveImage = (index: number) => {
		onChange(images.filter((_, i) => i !== index));
	};

	const handleDragStart = (index: number) => {
		setDragIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (dragIndex === null || dragIndex === index) return;

		const newImages = [...images];
		const [draggedItem] = newImages.splice(dragIndex, 1);
		newImages.splice(index, 0, draggedItem);
		onChange(newImages);
		setDragIndex(index);
	};

	const handleDragEnd = () => {
		setDragIndex(null);
	};

	return (
		<div className="space-y-3">
			{/* Image Grid */}
			{images.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{images.map((url, index) => (
						<div
							key={`${url}-${index}`}
							draggable={!disabled}
							onDragStart={() => handleDragStart(index)}
							onDragOver={(e) => handleDragOver(e, index)}
							onDragEnd={handleDragEnd}
							className={cn(
								"group relative aspect-square rounded-lg border-2 border-border overflow-hidden bg-muted cursor-move",
								dragIndex === index && "opacity-50 border-primary"
							)}
						>
							<ImageComponent
								src={url}
								alt={`Product image ${index + 1}`}
								className="h-full w-full object-cover"
								height={1000}
								width={1000}
							/>
							{/* Drag Handle */}
							<div className="absolute top-1 left-1 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
								<GripVertical className="h-4 w-4" />
							</div>
							{/* Remove Button */}
							<button
								type="button"
								onClick={() => handleRemoveImage(index)}
								disabled={disabled}
								className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
							>
								<X className="h-4 w-4" />
							</button>
							{/* Index Badge */}
							<div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/50 text-white text-xs">
								{index + 1}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Add Image Button */}
			<Button
				type="button"
				variant="outline"
				onClick={() => setIsGalleryOpen(true)}
				disabled={disabled}
				className="w-full h-24 border-dashed"
			>
				<div className="flex flex-col items-center gap-2">
					<ImageIcon className="h-8 w-8 text-muted-foreground" />
					<span>Add Images from Gallery</span>
				</div>
			</Button>

			{/* Media Gallery Modal - Multi-select mode */}
			<MediaGallery
				open={isGalleryOpen}
				onOpenChange={setIsGalleryOpen}
				type="image"
				multiSelect={true}
				onMultiSelect={handleMultiSelect}
				selectedUrls={images}
				title="Select Product Images"
			/>
		</div>
	);
}

/**
 * DocumentPicker Component
 * Simplified picker for selecting a document (PDF/DOC) file
 */
interface DocumentPickerProps {
	value: string;
	onChange: (url: string | null) => void;
	disabled?: boolean;
}

function DocumentPicker({
	value,
	onChange,
	disabled = false,
}: DocumentPickerProps) {
	const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);

	const handleSelect = (file: FileMetadata) => {
		onChange(file.url);
		setIsGalleryOpen(false);
	};

	const handleClear = () => {
		onChange(null);
	};

	if (value) {
		// Show selected document
		const filename = value.split("/").pop() || "Document";
		return (
			<div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
				<FileText className="h-8 w-8 text-muted-foreground shrink-0" />
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium truncate">{filename}</p>
					<p className="text-xs text-muted-foreground truncate">{value}</p>
				</div>
				<div className="flex gap-1">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setIsGalleryOpen(true)}
						disabled={disabled}
					>
						Change
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleClear}
						disabled={disabled}
						className="text-destructive hover:text-destructive"
					>
						Remove
					</Button>
				</div>

				<MediaGallery
					open={isGalleryOpen}
					onOpenChange={setIsGalleryOpen}
					type="document"
					onSelect={handleSelect}
					selectedUrl={value}
					title="Select Document"
				/>
			</div>
		);
	}

	return (
		<>
			<Button
				type="button"
				variant="outline"
				onClick={() => setIsGalleryOpen(true)}
				disabled={disabled}
				className="w-full justify-start gap-2 h-auto py-3"
			>
				<FileText className="h-5 w-5 text-muted-foreground" />
				<span className="text-muted-foreground">
					Select document from gallery...
				</span>
			</Button>

			<MediaGallery
				open={isGalleryOpen}
				onOpenChange={setIsGalleryOpen}
				type="document"
				onSelect={handleSelect}
				title="Select Document"
			/>
		</>
	);
}

/**
 * Form data type that works for both create and update
 */
export type ProductFormData = CreateProductDraftInput | UpdateProductInput;

/**
 * Server error structure from API responses
 * Supports both raw Zod format and formatted error format
 */
export interface ServerFieldError {
	path?: (string | number)[]; // Original path array
	field?: string; // Formatted field label (Swedish)
	message: string;
	code?: string;
}

/**
 * Result type for save/publish operations
 */
export interface ProductFormResult {
	success: boolean;
	data?: IProduct;
	warnings?: PublishValidationError[];
	errors?: ServerFieldError[];
	message?: string;
}

/**
 * Helper to extract category ID from various formats
 * Handles: string, ObjectId, populated category object, null, undefined
 */
type CategoryInput =
	| string
	| { _id?: unknown; id?: string; value?: string }
	| null
	| undefined
	| unknown;
export function normalizeCategoryId(category: CategoryInput): string {
	// Handle null, undefined, empty values
	if (category === null || category === undefined) return "";
	if (typeof category === "string") {
		// Handle the string "undefined" or empty strings
		if (
			category === "undefined" ||
			category === "null" ||
			category.trim() === ""
		) {
			return "";
		}
		return category;
	}
	if (category && typeof category === "object") {
		const cat = category as { _id?: unknown; id?: string; value?: string };
		if (cat._id) return String(cat._id);
		if (cat.id) return cat.id;
		if (cat.value) return cat.value;
	}
	return "";
}

/**
 * Normalize an array of categories to string IDs
 */
export function normalizeCategories(
	categories: CategoryInput[] | undefined
): string[] {
	if (!categories || !Array.isArray(categories)) return [];
	return categories.map(normalizeCategoryId);
}

/**
 * Tab definitions for the product form
 */
type TabId = "basic" | "content" | "media" | "specs" | "qna" | "appearance" | "seo";

const TAB_CONFIG: Record<TabId, { label: string; fields: string[] }> = {
	basic: {
		label: "Basic",
		fields: [
			"title",
			"slug",
			"shortDescription",
			"categories",
			"primaryCategory",
			"treatments",
			"certifications",
			"publishType",
			"visibility",
		],
	},
	content: {
		label: "Content",
		fields: [
			"description",
			"productDescription",
			"hiddenDescription",
			"benefits",
			"purchaseInfo",
			"rubric",
		],
	},
	media: {
		label: "Media",
		fields: [
			"productImages",
			"overviewImage",
			"youtubeUrl",
		],
	},
	specs: {
		label: "Specs & Docs",
		fields: ["techSpecifications", "documentation"],
	},
	qna: {
		label: "Q&A",
		fields: ["qa"],
	},
	appearance: {
		label: "Appearance",
		fields: ["heroSettings", "productVariants", "accordionSections"],
	},
	seo: {
		label: "SEO",
		fields: ["seo"],
	},
};

/**
 * Human-readable field labels
 */
const FIELD_LABELS: Record<string, string> = {
	title: "Product Title",
	slug: "Slug",
	shortDescription: "Short Description",
	description: "Description",
	productDescription: "Extended Description",
	hiddenDescription: "Hidden Description",
	categories: "Categories",
	primaryCategory: "Primary Category",
	treatments: "Treatments / Tags",
	certifications: "Certifications",
	benefits: "Benefits",
	purchaseInfo: "Purchase Information",
	"purchaseInfo.title": "Purchase Info Title",
	"purchaseInfo.description": "Purchase Info Description",
	rubric: "Rubric Notes",
	productImages: "Product Images",
	overviewImage: "Overview Image",
	youtubeUrl: "YouTube URL",
	techSpecifications: "Tech Specifications",
	documentation: "Documentation",
	qa: "Q&A",
	seo: "SEO",
	"seo.title": "SEO Title",
	"seo.description": "SEO Description",
	"seo.ogImage": "OG Image",
	"seo.canonicalUrl": "Canonical URL",
	"seo.noindex": "No Index",
	publishType: "Publish Type",
	visibility: "Visibility",
	heroSettings: "Hero Settings",
	"heroSettings.themeColor": "Theme Color",
	"heroSettings.badge": "Badge Text",
	"heroSettings.ctaText": "CTA Button Text",
	"heroSettings.ctaUrl": "CTA Button URL",
	productVariants: "Product Variants",
	accordionSections: "Accordion Sections",
};

/**
 * Get the tab that a field belongs to
 */
function getFieldTab(fieldPath: string): TabId | null {
	// Get the root field name (e.g., "seo.title" -> "seo")
	const rootField = fieldPath.split(".")[0];

	for (const [tabId, config] of Object.entries(TAB_CONFIG)) {
		if (config.fields.includes(rootField)) {
			return tabId as TabId;
		}
	}
	return null;
}

/**
 * Get human-readable label for a field path
 */
function getFieldLabel(fieldPath: string): string {
	// Check for exact match first
	if (FIELD_LABELS[fieldPath]) {
		return FIELD_LABELS[fieldPath];
	}

	// Check for array index patterns like "benefits.0" -> "Benefits Item 1"
	const parts = fieldPath.split(".");
	if (parts.length >= 2 && !isNaN(Number(parts[1]))) {
		const baseField = parts[0];
		const index = Number(parts[1]) + 1;
		const baseLabel = FIELD_LABELS[baseField] || baseField;

		if (parts.length === 2) {
			return `${baseLabel} #${index}`;
		}
		// e.g., "techSpecifications.0.title" -> "Tech Specifications #1 Title"
		const subField = parts.slice(2).join(".");
		const subLabel = FIELD_LABELS[`${baseField}.${subField}`] || subField;
		return `${baseLabel} #${index} - ${subLabel}`;
	}

	// Fallback to the root field label
	const rootField = parts[0];
	return FIELD_LABELS[rootField] || fieldPath;
}

/**
 * Extract all errors from react-hook-form errors object
 */
interface FormError {
	path: string;
	message: string;
	tab: TabId | null;
	label: string;
}

// Keys to skip when traversing react-hook-form errors (these can cause circular refs or aren't errors)
const SKIP_KEYS = new Set(["ref", "type", "types", "root"]);

function extractFormErrors(
	errors: Record<string, unknown>,
	prefix = "",
	visited = new WeakSet<object>()
): FormError[] {
	const result: FormError[] = [];

	// Prevent circular reference infinite loops
	if (visited.has(errors)) {
		return result;
	}
	visited.add(errors);

	for (const [key, value] of Object.entries(errors)) {
		// Skip internal react-hook-form properties
		if (SKIP_KEYS.has(key)) {
			continue;
		}

		const path = prefix ? `${prefix}.${key}` : key;

		if (value && typeof value === "object") {
			// Skip DOM elements and other non-plain objects
			if (value instanceof Element || value instanceof Node) {
				continue;
			}

			// Check if this is a react-hook-form error object (has message property)
			if ("message" in value && typeof value.message === "string") {
				result.push({
					path,
					message: value.message,
					tab: getFieldTab(path),
					label: getFieldLabel(path),
				});
				// Don't recurse into error objects - we've extracted what we need
				continue;
			}

			// Check for array root errors
			if (
				"root" in value &&
				typeof value.root === "object" &&
				value.root !== null
			) {
				const rootError = value.root as { message?: string };
				if (rootError.message) {
					result.push({
						path,
						message: rootError.message,
						tab: getFieldTab(path),
						label: getFieldLabel(path),
					});
				}
			}

			// Only recurse into plain objects/arrays (not error objects)
			if (
				Array.isArray(value) ||
				Object.getPrototypeOf(value) === Object.prototype
			) {
				const nested = extractFormErrors(
					value as Record<string, unknown>,
					path,
					visited
				);
				result.push(...nested);
			}
		}
	}

	return result;
}

/**
 * Count errors per tab
 */
function countErrorsPerTab(errors: FormError[]): Record<TabId, number> {
	const counts: Record<TabId, number> = {
		basic: 0,
		content: 0,
		media: 0,
		specs: 0,
		qna: 0,
		appearance: 0,
		seo: 0,
	};

	for (const error of errors) {
		if (error.tab) {
			counts[error.tab]++;
		}
	}

	return counts;
}

interface ProductFormProps {
	product?: IProduct | null;
	categoryTree: ICategoryTreeNode[];
	treatmentSuggestions?: string[];
	certificationSuggestions?: string[];
	onSaveDraft: (data: ProductFormData) => Promise<ProductFormResult>;
	onPublish?: (data: ProductFormData) => Promise<ProductFormResult>;
	onUnpublish?: () => Promise<ProductFormResult>;
	onSubmitForReview?: () => Promise<ProductFormResult>;
	onValidate?: (id: string) => Promise<{
		canPublish: boolean;
		errors: PublishValidationError[];
		warnings: PublishValidationError[];
	}>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * ProductForm Component
 * Comprehensive form for creating and editing products
 */
export function ProductForm({
	product,
	categoryTree,
	treatmentSuggestions = [],
	certificationSuggestions = [],
	onSaveDraft,
	onPublish,
	onUnpublish,
	onSubmitForReview,
	onValidate,
	onCancel,
	isLoading = false,
	className,
}: ProductFormProps) {
	const isEditing = !!product;
	const isPublished = product?.publishType === "publish";
	const isPending = product?.publishType === "pending";
	const isDraft = !product || product?.publishType === "draft";
	const [validationResults, setValidationResults] = React.useState<{
		errors: PublishValidationError[];
		warnings: PublishValidationError[];
	} | null>(null);
	const [serverErrors, setServerErrors] = React.useState<
		Record<string, string>
	>({});
	const [generalError, setGeneralError] = React.useState<string | null>(null);
	const [isSaving, setIsSaving] = React.useState(false);
	const [isPublishing, setIsPublishing] = React.useState(false);
	const [isUnpublishing, setIsUnpublishing] = React.useState(false);
	const [isSubmittingForReview, setIsSubmittingForReview] =
		React.useState(false);

	// Helper to convert server errors to field-level errors
	const processServerErrors = (
		errors?: ServerFieldError[]
	): PublishValidationError[] => {
		if (!errors || errors.length === 0) return [];

		const fieldErrors: Record<string, string> = {};
		const publishErrors: PublishValidationError[] = [];

		errors.forEach((err) => {
			// Get the path for form field mapping (dot notation)
			const fieldPath = err.path?.map(String).join(".") || "general";
			// Get the display label (use formatted field if available, otherwise path)
			const displayField = err.field || fieldPath;

			fieldErrors[fieldPath] = err.message;
			publishErrors.push({
				field: displayField,
				message: err.message,
				type: "error",
			});
		});
		setServerErrors(fieldErrors);
		return publishErrors;
	};

	// Clear server error when field is modified
	const clearServerError = (fieldName: string) => {
		if (serverErrors[fieldName]) {
			setServerErrors((prev) => {
				const updated = { ...prev };
				delete updated[fieldName];
				return updated;
			});
		}
	};

	// Get combined error for a field (form validation + server)
	const getFieldError = (fieldName: string): string | undefined => {
		// Check form validation errors first
		const formError = fieldName
			.split(".")
			.reduce((obj: Record<string, unknown> | undefined, key) => {
				return obj?.[key] as Record<string, unknown> | undefined;
			}, errors as Record<string, unknown>);

		if (
			formError &&
			typeof formError === "object" &&
			"message" in formError
		) {
			return formError.message as string;
		}

		// Then check server errors
		return serverErrors[fieldName];
	};

	const {
		register,
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<CreateProductDraftInput | UpdateProductInput>({
		resolver: zodResolver(
			isEditing ? updateProductSchema : createProductDraftSchema
		),
		defaultValues: {
			title: product?.title || "",
			slug: product?.slug || "",
			description: product?.description || "",
			shortDescription: product?.shortDescription || "",
			productDescription: product?.productDescription || "",
			hiddenDescription: product?.hiddenDescription || "",
			benefits: product?.benefits || [],
			certifications: product?.certifications || [],
			treatments: product?.treatments || [],
			productImages: product?.productImages || [],
			overviewImage: product?.overviewImage || "",
			techSpecifications:
				product?.techSpecifications?.map((t) => ({
					title: t.title,
					description: t.description,
				})) || [],
			documentation:
				product?.documentation?.map((d) => ({
					title: d.title,
					url: d.url,
				})) || [],
			purchaseInfo: {
				title: product?.purchaseInfo?.title || "",
				description: product?.purchaseInfo?.description || "",
			},
			seo: {
				title: product?.seo?.title || "",
				description: product?.seo?.description || "",
				ogImage: product?.seo?.ogImage || "",
				canonicalUrl: product?.seo?.canonicalUrl || "",
				noindex: product?.seo?.noindex || false,
			},
			categories: normalizeCategories(
				product?.categories as CategoryInput[]
			),
			primaryCategory:
				normalizeCategoryId(product?.primaryCategory as CategoryInput) ||
				"",
			qa:
				product?.qa?.map((q) => ({
					question: q.question,
					answer: q.answer,
					visible: q.visible,
				})) || [],
			youtubeUrl: product?.youtubeUrl || "",
			rubric: product?.rubric || "",
			heroSettings: {
				themeColor: product?.heroSettings?.themeColor || "#6B7280",
				badge: product?.heroSettings?.badge || "",
				ctaText: product?.heroSettings?.ctaText || "",
				ctaUrl: product?.heroSettings?.ctaUrl || "",
			},
			productVariants:
				product?.productVariants?.map((v) => ({
					name: v.name,
					url: v.url,
					icon: v.icon,
				})) || [],
			accordionSections:
				product?.accordionSections?.map((s) => ({
					title: s.title,
					content: s.content,
					isOpen: s.isOpen || false,
				})) || [],
			publishType: product?.publishType || "draft",
			visibility: product?.visibility || "public",
		},
	});

	// Field arrays for dynamic lists
	const {
		fields: techSpecFields,
		append: appendTechSpec,
		remove: removeTechSpec,
	} = useFieldArray({
		control,
		name: "techSpecifications",
	});

	const {
		fields: docFields,
		append: appendDoc,
		remove: removeDoc,
	} = useFieldArray({
		control,
		name: "documentation",
	});

	const {
		fields: qaFields,
		append: appendQa,
		remove: removeQa,
	} = useFieldArray({
		control,
		name: "qa",
	});

	const {
		fields: benefitFields,
		append: appendBenefit,
		remove: removeBenefit,
	} = useFieldArray({
		control,
		name: "benefits" as never,
	});

	const {
		fields: variantFields,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		control,
		name: "productVariants",
	});

	const {
		fields: accordionFields,
		append: appendAccordion,
		remove: removeAccordion,
	} = useFieldArray({
		control,
		name: "accordionSections",
	});

	const title = watch("title");
	const slug = watch("slug");

	// Auto-generate slug from title
	const handleTitleBlur = () => {
		if (!slug && title) {
			setValue("slug", generateSlug(title), { shouldDirty: true });
		}
	};

	// Handle save draft
	const handleSaveDraft = async (data: ProductFormData) => {
		setIsSaving(true);
		setServerErrors({});
		setGeneralError(null);
		setValidationResults(null);
		try {
			const result = await onSaveDraft(data);
			if (!result.success) {
				const publishErrors = processServerErrors(result.errors);
				if (publishErrors.length > 0) {
					setValidationResults({ errors: publishErrors, warnings: [] });
				}
				if (result.message) {
					setGeneralError(result.message);
				}
			}
		} finally {
			setIsSaving(false);
		}
	};

	// Handle validate
	const handleValidate = async () => {
		if (!product?._id || !onValidate) return;
		const results = await onValidate(product._id.toString());
		setValidationResults({
			errors: results.errors,
			warnings: results.warnings,
		});
	};

	// Handle publish (can be used for both new and existing products)
	const handlePublish = async (data: ProductFormData) => {
		if (!onPublish) return;
		setIsPublishing(true);
		setServerErrors({});
		setGeneralError(null);
		setValidationResults(null);
		try {
			const result = await onPublish(data);
			if (result.success) {
				setValidationResults({
					errors: [],
					warnings: result.warnings || [],
				});
			} else {
				const publishErrors = processServerErrors(result.errors);
				if (publishErrors.length > 0) {
					setValidationResults({ errors: publishErrors, warnings: [] });
				}
				if (result.message) {
					setGeneralError(result.message);
				}
			}
		} finally {
			setIsPublishing(false);
		}
	};

	// Handle unpublish (convert published product back to draft)
	const handleUnpublish = async () => {
		if (!onUnpublish) return;
		setIsUnpublishing(true);
		setServerErrors({});
		setGeneralError(null);
		setValidationResults(null);
		try {
			const result = await onUnpublish();
			if (!result.success && result.message) {
				setGeneralError(result.message);
			}
		} finally {
			setIsUnpublishing(false);
		}
	};

	// Handle submit for review (set to pending status)
	const handleSubmitForReview = async () => {
		if (!onSubmitForReview) return;
		setIsSubmittingForReview(true);
		setServerErrors({});
		setGeneralError(null);
		setValidationResults(null);
		try {
			const result = await onSubmitForReview();
			if (!result.success && result.message) {
				setGeneralError(result.message);
			}
		} finally {
			setIsSubmittingForReview(false);
		}
	};

	// Extract and organize form errors
	const formErrors = React.useMemo(
		() => extractFormErrors(errors as Record<string, unknown>),
		[errors]
	);
	const tabErrorCounts = React.useMemo(
		() => countErrorsPerTab(formErrors),
		[formErrors]
	);
	const hasFormErrors = formErrors.length > 0;

	// Group errors by tab for display
	const errorsByTab = React.useMemo(() => {
		const grouped: Record<TabId, FormError[]> = {
			basic: [],
			content: [],
			media: [],
			specs: [],
			qna: [],
			appearance: [],
			seo: [],
		};
		for (const error of formErrors) {
			if (error.tab) {
				grouped[error.tab].push(error);
			}
		}
		return grouped;
	}, [formErrors]);

	return (
		<div className={cn("space-y-6", className)}>
			{/* General Error Banner */}
			{generalError && (
				<Card className="border-red-300 bg-red-50">
					<CardContent className="pt-4">
						<div className="flex items-center gap-2 text-red-600">
							<AlertCircle className="h-5 w-5" />
							<span className="font-medium">{generalError}</span>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Form Validation Errors Banner */}
			{hasFormErrors && (
				<Card className="border-red-300 bg-red-50">
					<CardContent className="pt-4">
						<div className="flex items-center gap-2 text-red-600 mb-3">
							<AlertCircle className="h-5 w-5 shrink-0" />
							<span className="font-medium">
								Please fix {formErrors.length} validation{" "}
								{formErrors.length === 1 ? "error" : "errors"} before
								saving
							</span>
						</div>
						<div className="space-y-3">
							{(Object.entries(errorsByTab) as [TabId, FormError[]][])
								.filter(([, tabErrors]) => tabErrors.length > 0)
								.map(([tabId, tabErrors]) => (
									<div key={tabId} className="text-sm">
										<div className="font-medium text-red-700 mb-1">
											{TAB_CONFIG[tabId].label} Tab:
										</div>
										<ul className="list-disc list-inside space-y-0.5 text-red-600 pl-2">
											{tabErrors.map((error, i) => (
												<li key={i}>
													<span className="font-medium">
														{error.label}:
													</span>{" "}
													{error.message}
												</li>
											))}
										</ul>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Server Validation Results Banner */}
			{validationResults &&
				(validationResults.errors.length > 0 ||
					validationResults.warnings.length > 0) && (
					<Card
						className={
							validationResults.errors.length > 0
								? "border-red-300 bg-red-50"
								: "border-yellow-300 bg-yellow-50"
						}
					>
						<CardContent className="pt-4">
							{validationResults.errors.length > 0 && (
								<div className="mb-4">
									<div className="flex items-center gap-2 text-red-600 mb-2">
										<AlertCircle className="h-5 w-5" />
										<span className="font-medium">
											Server Errors (
											{validationResults.errors.length})
										</span>
									</div>
									<ul className="list-disc list-inside space-y-1 text-sm text-red-600">
										{validationResults.errors.map((error, i) => (
											<li key={i}>
												<strong>{error.field}:</strong>{" "}
												{error.message}
											</li>
										))}
									</ul>
								</div>
							)}
							{validationResults.warnings.length > 0 && (
								<div>
									<div className="flex items-center gap-2 text-yellow-600 mb-2">
										<AlertTriangle className="h-5 w-5" />
										<span className="font-medium">
											Warnings ({validationResults.warnings.length})
										</span>
									</div>
									<ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
										{validationResults.warnings.map((warning, i) => (
											<li key={i}>
												<strong>{warning.field}:</strong>{" "}
												{warning.message}
											</li>
										))}
									</ul>
								</div>
							)}
						</CardContent>
					</Card>
				)}

			<form onSubmit={handleSubmit(handleSaveDraft)}>
				<Tabs defaultValue="basic" className="space-y-6">
					<TabsList className="grid grid-cols-6 w-full">
						<TabsTrigger value="basic" className="relative">
							Basic
							{tabErrorCounts.basic > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.basic}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="content" className="relative">
							Content
							{tabErrorCounts.content > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.content}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="media" className="relative">
							Media
							{tabErrorCounts.media > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.media}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="specs" className="relative">
							Specs & Docs
							{tabErrorCounts.specs > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.specs}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="qna" className="relative">
							Q&A
							{tabErrorCounts.qna > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.qna}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="appearance" className="relative">
							Appearance
							{tabErrorCounts.appearance > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.appearance}
								</span>
							)}
						</TabsTrigger>
						<TabsTrigger value="seo" className="relative">
							SEO
							{tabErrorCounts.seo > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
									{tabErrorCounts.seo}
								</span>
							)}
						</TabsTrigger>
					</TabsList>

					{/* Basic Info Tab */}
					<TabsContent value="basic">
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
								<CardDescription>
									Essential product details
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Title */}
								<div className="space-y-2">
									<Label htmlFor="title">
										Product Title{" "}
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="title"
										{...register("title")}
										onBlur={handleTitleBlur}
										placeholder="Enter product title"
										disabled={isLoading}
										className={errors.title ? "border-red-500" : ""}
									/>
									{errors.title && (
										<p className="text-sm text-red-500">
											{errors.title.message}
										</p>
									)}
								</div>

								<Separator />

								{/* Slug */}
								<div className="space-y-2">
									<Label htmlFor="slug">
										Slug
										<span className="text-red-500">*</span>
									</Label>
									<Input
										id="slug"
										{...register("slug")}
										placeholder="product-slug"
										disabled={isLoading}
										className={errors.slug ? "border-red-500" : ""}
									/>
									<p className="text-xs text-slate-500">
										URL-friendly identifier. Auto-generated from
										title.
									</p>
									{errors.slug && (
										<p className="text-sm text-red-500">
											{errors.slug.message}
										</p>
									)}
								</div>

								<Separator />

								{/* Short Description */}
								<div className="space-y-2">
									<Label htmlFor="shortDescription">
										Short Description
										<span className="text-red-500">*</span>
									</Label>
									<Textarea
										id="shortDescription"
										{...register("shortDescription")}
										placeholder="Brief product summary (max 1500 characters)"
										disabled={isLoading}
										rows={2}
									/>
								</div>

								<Separator />

								{/* Categories */}
								<div className="space-y-2">
									<Label>Categories</Label>
									<TreeSelect
										value={watch("categories") || []}
										onChange={(cats) => {
											setValue("categories", cats, {
												shouldDirty: true,
											});
											const currentPrimary =
												watch("primaryCategory");
											// Clear primary category if it's no longer in selected categories
											if (
												currentPrimary &&
												!cats.includes(currentPrimary)
											) {
												// Auto-set to first category if available
												setValue("primaryCategory", cats[0] || "", {
													shouldDirty: true,
												});
											}
											// Auto-set primary category to first category if not set
											if (!currentPrimary && cats.length > 0) {
												setValue("primaryCategory", cats[0], {
													shouldDirty: true,
												});
											}
										}}
										tree={categoryTree}
										placeholder="Select categories"
										disabled={isLoading}
									/>
								</div>

								{/* Primary Category */}
								{(watch("categories")?.length || 0) > 0 && (
									<>
										<Separator />
										<div className="space-y-2">
											<Label>
												Primary Category{" "}
												<span className="text-muted-foreground font-normal">
													(for URL generation)
												</span>
											</Label>
											<Select
												value={watch("primaryCategory") || ""}
												onValueChange={(value) =>
													setValue("primaryCategory", value, {
														shouldDirty: true,
													})
												}
												disabled={isLoading}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select primary category" />
												</SelectTrigger>
												<SelectContent>
													{(watch("categories") || []).map(
														(catId) => {
															const findCategory = (
																nodes: ICategoryTreeNode[]
															): ICategoryTreeNode | null => {
																for (const node of nodes) {
																	if (node._id === catId)
																		return node;
																	const found = findCategory(
																		node.children
																	);
																	if (found) return found;
																}
																return null;
															};
															const cat =
																findCategory(categoryTree);
															return cat ? (
																<SelectItem
																	key={cat._id}
																	value={cat._id}
																>
																	{cat.name}
																</SelectItem>
															) : null;
														}
													)}
												</SelectContent>
											</Select>
										</div>
									</>
								)}

								<Separator />

								{/* Treatments / Tags */}
								<div className="space-y-2">
									<Label>Treatments / Tags</Label>
									<TagInput
										value={watch("treatments") || []}
										onChange={(tags) =>
											setValue("treatments", tags, {
												shouldDirty: true,
											})
										}
										suggestions={treatmentSuggestions}
										placeholder="Add treatment tags..."
										disabled={isLoading}
									/>
								</div>

								<Separator />

								{/* Certifications */}
								<div className="space-y-2">
									<Label>Certifications</Label>
									<TagInput
										value={watch("certifications") || []}
										onChange={(tags) =>
											setValue("certifications", tags, {
												shouldDirty: true,
											})
										}
										suggestions={certificationSuggestions}
										placeholder="Add certifications..."
										disabled={isLoading}
									/>
								</div>

								<Separator />

								{/* Visibility */}
								<div className="space-y-2">
									<Label htmlFor="visibility">Visibility</Label>
									<Select
										value={watch("visibility") || "public"}
										onValueChange={(value) => setValue("visibility", value as "public" | "hidden", { shouldDirty: true })}
										disabled={isLoading}
									>
										<SelectTrigger className="w-full h-11">
											<SelectValue placeholder="Select visibility" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="public">Public</SelectItem>
											<SelectItem value="hidden">Hidden</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-slate-500">
										Hidden products won&apos;t appear in public
										listings
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Content Tab */}
					<TabsContent value="content">
						<Card>
							<CardHeader>
								<CardTitle>Product Content</CardTitle>
								<CardDescription>
									Descriptions and benefits
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Product Description */}
								<div className="space-y-2">
									<Label>
										Extended Description
										<span className="text-red-500">*</span>
									</Label>
									<TextEditor
										height="500px"
										defaultValue={watch("productDescription") || ""}
										onChange={(val) =>
											setValue("productDescription", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter extended product description..."
										variant={"advanceFull"}
									/>
								</div>

								<Separator />

								{/* Hidden Description */}
								<div className="space-y-2">
									<Label>
										Hidden Description{" "}
										<span className="text-muted-foreground font-normal">
											(optional)
										</span>
									</Label>
									<p className="text-sm text-muted-foreground">
										This description is for internal use only and will
										not be displayed on the product page.
									</p>
									<TextEditor
										height="300px"
										defaultValue={watch("hiddenDescription") || ""}
										onChange={(val) =>
											setValue("hiddenDescription", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter hidden description (internal use only)..."
										variant={"advanceFull"}
									/>
								</div>

								<Separator />

								{/* Benefits */}
								<div className="space-y-2">
									<Label>Benefits</Label>
									<div className="space-y-2">
										{benefitFields.map((field, index) => (
											<div key={field.id} className="flex gap-2">
												<Input
													{...register(
														`benefits.${index}` as const
													)}
													placeholder="Enter benefit"
													disabled={isLoading}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeBenefit(index)}
													disabled={isLoading}
													className="text-red-500"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendBenefit("")}
											disabled={isLoading}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Benefit
										</Button>
									</div>
								</div>

								<Separator />

								{/* Purchase Info */}
								<div className="space-y-4">
									<Label>Purchase Information</Label>
									<Input
										{...register("purchaseInfo.title")}
										placeholder="Purchase info title"
										disabled={isLoading}
									/>
									<TextEditor
										height="200px"
										defaultValue={
											watch("purchaseInfo.description") || ""
										}
										onChange={(val) =>
											setValue("purchaseInfo.description", val, {
												shouldDirty: true,
											})
										}
										placeholder="Enter extended product description..."
									/>
								</div>

								<Separator />

								{/* Rubric */}
								<div className="space-y-2">
									<Label htmlFor="rubric">Rubric / Notes</Label>
									<Textarea
										id="rubric"
										{...register("rubric")}
										placeholder="Internal notes or rubric"
										disabled={isLoading}
										rows={3}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Media Tab */}
					<TabsContent value="media">
						<Card>
							<CardHeader>
								<CardTitle>Media</CardTitle>
								<CardDescription>
									Product images and videos
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Product Images - Gallery Mode */}
								<div className="space-y-3">
									<Label>
										Product Images{" "}
										<span className="text-red-500">*</span>
									</Label>
									<p className="text-xs text-muted-foreground">
										Select multiple images from the media library or
										upload new ones.
									</p>
									<ProductImageGallery
										images={watch("productImages") || []}
										onChange={(urls) =>
											setValue("productImages", urls, {
												shouldDirty: true,
											})
										}
										disabled={isLoading}
									/>
								</div>

								<Separator />

								{/* Overview Image */}
								<div className="space-y-2">
									<Label>Overview Image</Label>
									<p className="text-xs text-muted-foreground">
										Main image shown in product listings and overview
										sections.
									</p>
									<MediaPicker
										type="image"
										value={watch("overviewImage") || null}
										onChange={(url) =>
											setValue("overviewImage", url || "", {
												shouldDirty: true,
											})
										}
										placeholder="Select overview image"
										disabled={isLoading}
										galleryTitle="Select Overview Image"
									/>
								</div>

								<Separator />

								{/* YouTube URL */}
								<div className="space-y-2">
									<Label htmlFor="youtubeUrl">YouTube Video URL</Label>
									<Input
										id="youtubeUrl"
										type="url"
										{...register("youtubeUrl")}
										placeholder="https://www.youtube.com/watch?v=..."
										disabled={isLoading}
									/>
								</div>

							</CardContent>
						</Card>
					</TabsContent>

					{/* Specs & Docs Tab */}
					<TabsContent value="specs">
						<div className="space-y-6">
							{/* Tech Specifications */}
							<Card>
								<CardHeader>
									<CardTitle>Technical Specifications</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{techSpecFields.map((field, index) => (
										<div
											key={field.id}
											className="p-4 border rounded-md space-y-3"
										>
											<div className="flex justify-between items-start">
												<span className="text-sm font-medium">
													Spec #{index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeTechSpec(index)}
													disabled={isLoading}
													className="text-red-500 h-8 w-8"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											<Input
												{...register(
													`techSpecifications.${index}.title`
												)}
												placeholder="Specification title"
												disabled={isLoading}
											/>
											<Textarea
												{...register(
													`techSpecifications.${index}.description`
												)}
												placeholder="Specification description"
												disabled={isLoading}
												rows={2}
											/>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendTechSpec({ title: "", description: "" })
										}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Specification
									</Button>
								</CardContent>
							</Card>

							{/* Documentation */}
							<Card>
								<CardHeader>
									<CardTitle>Documentation</CardTitle>
									<CardDescription>
										Upload and manage product documentation (PDF, DOC,
										DOCX)
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{docFields.map((field, index) => (
										<div
											key={field.id}
											className="p-4 border rounded-lg space-y-3"
										>
											<div className="flex justify-between items-start">
												<span className="text-sm font-medium">
													Document #{index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeDoc(index)}
													disabled={isLoading}
													className="text-red-500 h-8 w-8"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											<Input
												{...register(
													`documentation.${index}.title`
												)}
												placeholder="Document title (e.g., User Manual, Specifications)"
												disabled={isLoading}
											/>
											<DocumentPicker
												value={
													watch(`documentation.${index}.url`) || ""
												}
												onChange={(url) => {
													console.log("url from doc => ", url);
													setValue(
														`documentation.${index}.url`,
														url || "",
														{
															shouldDirty: true,
														}
													);
												}}
												disabled={isLoading}
											/>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() => appendDoc({ title: "", url: "" })}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Document
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Q&A Tab */}
					<TabsContent value="qna">
						<Card>
							<CardHeader>
								<CardTitle>Questions & Answers</CardTitle>
								<CardDescription>Product FAQ items</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{qaFields.map((field, index) => (
									<div
										key={field.id}
										className="p-4 border rounded-md space-y-3"
									>
										<div className="flex justify-between items-start">
											<span className="text-sm font-medium">
												Q&A #{index + 1}
											</span>
											<div className="flex items-center gap-2">
												<label className="flex items-center gap-2 text-sm">
													<input
														type="checkbox"
														{...register(`qa.${index}.visible`)}
														disabled={isLoading}
														className="h-4 w-4"
													/>
													Visible
												</label>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeQa(index)}
													disabled={isLoading}
													className="text-red-500 h-8 w-8"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
										<Input
											{...register(`qa.${index}.question`)}
											placeholder="Question"
											disabled={isLoading}
										/>
										<TextEditor
											name={`qa.${index}.answer`}
											defaultValue={watch(`qa.${index}.answer`) || ""}
											onChange={(val) =>
												setValue(`qa.${index}.answer`, val, {
													shouldDirty: true,
												})
											}
											placeholder="Answer (supports rich text)"
											variant="detailedSimple"
											height="150px"
											disable={isLoading}
										/>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										appendQa({
											question: "",
											answer: "",
											visible: true,
										})
									}
									disabled={isLoading}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Q&A
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Appearance Tab */}
					<TabsContent value="appearance">
						<div className="space-y-6">
							{/* Hero Settings Card */}
							<Card>
								<CardHeader>
									<CardTitle>Hero Section Settings</CardTitle>
									<CardDescription>
										Configure the product hero section appearance
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Theme Color */}
									<div className="space-y-2">
										<Label htmlFor="heroSettings.themeColor">
											Theme Color
										</Label>
										<div className="flex items-center gap-3">
											<input
												type="color"
												id="heroSettings.themeColor"
												value={watch("heroSettings.themeColor") || "#6B7280"}
												onChange={(e) =>
													setValue("heroSettings.themeColor", e.target.value, {
														shouldDirty: true,
													})
												}
												disabled={isLoading}
												className="h-10 w-20 cursor-pointer rounded border"
											/>
											<Input
												{...register("heroSettings.themeColor")}
												placeholder="#6B7280"
												disabled={isLoading}
												className="flex-1 max-w-xs"
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											Background color for the hero section
										</p>
									</div>

									{/* Badge */}
									<div className="space-y-2">
										<Label htmlFor="heroSettings.badge">Badge Text</Label>
										<Input
											id="heroSettings.badge"
											{...register("heroSettings.badge")}
											placeholder="e.g., 2025 WORLD CHEESE AWARDS"
											disabled={isLoading}
										/>
										<p className="text-xs text-muted-foreground">
											Award or promotional badge shown above the title
										</p>
									</div>

									{/* CTA Button */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="heroSettings.ctaText">
												CTA Button Text
											</Label>
											<Input
												id="heroSettings.ctaText"
												{...register("heroSettings.ctaText")}
												placeholder="e.g., WHERE TO BUY"
												disabled={isLoading}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="heroSettings.ctaUrl">
												CTA Button URL
											</Label>
											<Input
												id="heroSettings.ctaUrl"
												{...register("heroSettings.ctaUrl")}
												placeholder="e.g., /contact-us"
												disabled={isLoading}
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Product Variants Card */}
							<Card>
								<CardHeader>
									<CardTitle>Product Variants</CardTitle>
									<CardDescription>
										Link to related product variants (e.g., Baby Loaf, Block, Sliced)
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{variantFields.map((field, index) => (
										<div
											key={field.id}
											className="p-4 border rounded-md space-y-3"
										>
											<div className="flex justify-between items-start">
												<span className="text-sm font-medium">
													Variant #{index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeVariant(index)}
													disabled={isLoading}
													className="text-red-500 h-8 w-8"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label>Name</Label>
													<Input
														{...register(`productVariants.${index}.name`)}
														placeholder="e.g., Baby Loaf"
														disabled={isLoading}
													/>
												</div>
												<div className="space-y-2">
													<Label>URL</Label>
													<Input
														{...register(`productVariants.${index}.url`)}
														placeholder="e.g., /products/category/cheese/baby-loaf"
														disabled={isLoading}
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label>Icon Image</Label>
												<MediaPicker
													value={watch(`productVariants.${index}.icon`) || ""}
													onChange={(url) =>
														setValue(`productVariants.${index}.icon`, url || "", {
															shouldDirty: true,
														})
													}
													type="image"
													disabled={isLoading}
												/>
											</div>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendVariant({
												name: "",
												url: "",
												icon: "",
											})
										}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Variant
									</Button>
								</CardContent>
							</Card>

							{/* Accordion Sections Card */}
							<Card>
								<CardHeader>
									<CardTitle>Accordion Sections</CardTitle>
									<CardDescription>
										Collapsible content sections (replaces FAQ on product page)
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{accordionFields.map((field, index) => (
										<div
											key={field.id}
											className="p-4 border rounded-md space-y-3"
										>
											<div className="flex justify-between items-start">
												<span className="text-sm font-medium">
													Section #{index + 1}
												</span>
												<div className="flex items-center gap-2">
													<label className="flex items-center gap-2 text-sm">
														<input
															type="checkbox"
															{...register(`accordionSections.${index}.isOpen`)}
															disabled={isLoading}
															className="h-4 w-4"
														/>
														Open by default
													</label>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => removeAccordion(index)}
														disabled={isLoading}
														className="text-red-500 h-8 w-8"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
											<div className="space-y-2">
												<Label>Title</Label>
												<Input
													{...register(`accordionSections.${index}.title`)}
													placeholder="e.g., NUTRITION & ALLERGENS"
													disabled={isLoading}
												/>
											</div>
											<div className="space-y-2">
												<Label>Content</Label>
												<TextEditor
													name={`accordionSections.${index}.content`}
													defaultValue={watch(`accordionSections.${index}.content`) || ""}
													onChange={(val) =>
														setValue(`accordionSections.${index}.content`, val, {
															shouldDirty: true,
														})
													}
													placeholder="Section content (supports rich text)"
													variant="detailedSimple"
													height="150px"
													disable={isLoading}
												/>
											</div>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											appendAccordion({
												title: "",
												content: "",
												isOpen: false,
											})
										}
										disabled={isLoading}
									>
										<Plus className="h-4 w-4 mr-1" />
										Add Section
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* SEO Tab */}
					<TabsContent value="seo">
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							{/* Left Column - SEO Settings */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
										<CardDescription>
											Search engine optimization
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										{/* SEO Title */}
										<div className="space-y-2">
											<Label htmlFor="seo.title">SEO Title</Label>
											<Input
												id="seo.title"
												{...register("seo.title")}
												placeholder="SEO title (recommended 50-60 characters)"
												disabled={isLoading}
												maxLength={70}
												onChange={(e) => {
													register("seo.title").onChange(e);
													clearServerError("seo.title");
												}}
											/>
											<CharacterCount
												value={watch("seo.title") || ""}
												min={30}
												max={70}
												optimal={{ min: 50, max: 60 }}
												label="Title length"
											/>
											{getFieldError("seo.title") && (
												<p className="text-sm text-red-500">
													{getFieldError("seo.title")}
												</p>
											)}
										</div>

										<Separator />

										{/* SEO Description */}
										<div className="space-y-2">
											<Label htmlFor="seo.description">
												Meta Description
											</Label>
											<Textarea
												id="seo.description"
												{...register("seo.description")}
												placeholder="SEO description (recommended 120-160 characters)"
												disabled={isLoading}
												rows={3}
												maxLength={200}
												onChange={(e) => {
													register("seo.description").onChange(e);
													clearServerError("seo.description");
												}}
											/>
											<CharacterCount
												value={watch("seo.description") || ""}
												min={80}
												max={200}
												optimal={{ min: 120, max: 160 }}
												label="Description length"
											/>
											{getFieldError("seo.description") && (
												<p className="text-sm text-red-500">
													{getFieldError("seo.description")}
												</p>
											)}
										</div>

										<Separator />

										{/* OG Image */}
										<div className="space-y-2">
											<Label>Open Graph Image</Label>
											<p className="text-sm text-muted-foreground">
												Image shown when sharing on social media
												(recommended 1200x630px)
											</p>
											<MediaPicker
												type="image"
												value={watch("seo.ogImage") || null}
												onChange={(url) =>
													setValue("seo.ogImage", url || "", {
														shouldDirty: true,
													})
												}
												placeholder="Select OG image"
												disabled={isLoading}
												galleryTitle="Select Open Graph Image"
											/>
										</div>

										<Separator />

										{/* Canonical URL */}
										<div className="space-y-2">
											<Label htmlFor="seo.canonicalUrl">
												Canonical URL
											</Label>
											<Input
												id="seo.canonicalUrl"
												type="url"
												{...register("seo.canonicalUrl")}
												placeholder="https://example.com/product"
												disabled={isLoading}
											/>
											<p className="text-xs text-slate-500">
												Leave empty to use the default product URL
											</p>
										</div>

										<Separator />

										{/* Noindex */}
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												id="seo.noindex"
												{...register("seo.noindex")}
												disabled={isLoading}
												className="h-4 w-4"
											/>
											<Label
												htmlFor="seo.noindex"
												className="cursor-pointer"
											>
												No Index
											</Label>
											<p className="text-xs text-slate-500">
												Prevent search engines from indexing this
												product
											</p>
										</div>
									</CardContent>
								</Card>

								{/* SEO Analysis */}
								<SeoAnalysis
									data={{
										title: watch("seo.title") || "",
										description: watch("seo.description") || "",
										slug: watch("slug") || "",
										productTitle: watch("title") || "",
										hasOgImage: !!watch("seo.ogImage"),
									}}
								/>
							</div>

							{/* Right Column - Previews */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how your product will appear in search
											results and social media
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: watch("seo.title") || "",
												description: watch("seo.description") || "",
												slug: watch("slug") || "",
												ogImage:
													watch("seo.ogImage") ||
													watch("overviewImage") ||
													watch("productImages")?.[0] ||
													null,
												siteUrl: "synos.se",
												siteName: "Synos",
												productTitle: watch("title") || "",
											}}
										/>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				{/* Form Actions */}
				<div className="flex justify-between items-center pt-6 border-t mt-6">
					<div>
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isLoading}
							>
								Cancel
							</Button>
						)}
					</div>

					<div className="flex gap-3">
						{/* Unpublish button - only show for published products */}
						{isPublished && onUnpublish && (
							<Button
								type="button"
								variant="outline"
								onClick={handleUnpublish}
								disabled={isLoading || isUnpublishing}
							>
								{isUnpublishing && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								<Undo2 className="h-4 w-4 mr-2" />
								Unpublish
							</Button>
						)}

						{/* Save button - label changes based on status */}
						<Button
							type="submit"
							variant="outline"
							disabled={isLoading || isSaving}
						>
							{isSaving && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							<Save className="h-4 w-4 mr-2" />
							{isDraft ? "Save Draft" : "Save"}
						</Button>

						{/* Submit for Review button - only show for draft products */}
						{isDraft && onSubmitForReview && (
							<Button
								type="button"
								variant="secondary"
								className="text-primary border border-primary"
								onClick={handleSubmitForReview}
								disabled={isLoading || isSubmittingForReview}
							>
								{isSubmittingForReview && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								<ClipboardCheck className="h-4 w-4 mr-2" />
								Submit for Review
							</Button>
						)}

						{/* Publish button - show for draft and pending products */}
						{!isPublished && onPublish && (
							<Button
								type="button"
								onClick={handleSubmit(handlePublish)}
								disabled={isLoading || isPublishing}
							>
								{isPublishing && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								<Send className="h-4 w-4 mr-2" />
								Publish
							</Button>
						)}
					</div>
				</div>
			</form>
		</div>
	);
}
