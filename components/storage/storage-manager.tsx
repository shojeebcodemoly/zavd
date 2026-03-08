"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "./file-uploader";
import { FileList } from "./file-list";
import type { StorageFile, StorageFolder } from "@/lib/storage/client";

interface StorageManagerProps {
	/** Default active tab */
	defaultTab?: StorageFolder;
	/** Callback when a file is uploaded */
	onUpload?: (file: StorageFile) => void;
	/** Callback when a file is deleted */
	onDelete?: (filename: string, folder: StorageFolder) => void;
	/** Additional class name */
	className?: string;
}

export function StorageManager({
	defaultTab = "images",
	onUpload,
	onDelete,
	className,
}: StorageManagerProps) {
	const [activeTab, setActiveTab] = useState<StorageFolder>(defaultTab);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleUpload = useCallback(
		(file: StorageFile) => {
			// Trigger refresh of file list
			setRefreshKey((prev) => prev + 1);
			onUpload?.(file);
		},
		[onUpload]
	);

	const handleDelete = useCallback(
		(filename: string) => {
			onDelete?.(filename, activeTab);
		},
		[activeTab, onDelete]
	);

	return (
		<div className={className}>
			<Tabs
				value={activeTab}
				onValueChange={(value) => setActiveTab(value as StorageFolder)}
			>
				<TabsList className="mb-6">
					<TabsTrigger value="images">Images</TabsTrigger>
					<TabsTrigger value="documents">Documents</TabsTrigger>
				</TabsList>

				<TabsContent value="images" className="space-y-6">
					<FileUploader folder="images" onUpload={handleUpload} multiple />
					<FileList
						key={`images-${refreshKey}`}
						folder="images"
						title="Uploaded Images"
						description="JPG, PNG, WebP, and GIF files"
						onDelete={handleDelete}
					/>
				</TabsContent>

				<TabsContent value="documents" className="space-y-6">
					<FileUploader folder="documents" onUpload={handleUpload} multiple />
					<FileList
						key={`documents-${refreshKey}`}
						folder="documents"
						title="Uploaded Documents"
						description="PDF and Word documents"
						onDelete={handleDelete}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
