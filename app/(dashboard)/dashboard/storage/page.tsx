"use client";

import { StorageManager } from "@/components/storage";
import type { StorageFile, StorageFolder } from "@/lib/storage/client";

export default function StoragePage() {
	const handleUpload = (file: StorageFile) => {
		// console.log("File uploaded:", file);
	};

	const handleDelete = (filename: string, folder: StorageFolder) => {
		// console.log("File deleted:", filename, "from", folder);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-medium text-gray-900">File Storage</h1>
				<p className="text-sm text-gray-600 mt-1">
					Upload, manage, and organize your images and documents.
				</p>
			</div>

			{/* Storage Manager */}
			<StorageManager
				defaultTab="images"
				onUpload={handleUpload}
				onDelete={handleDelete}
			/>

			{/* Usage Info */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Supported Formats
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="font-medium text-gray-800 mb-2">Images</h3>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>Formats: JPG, PNG, WebP, GIF</li>
							<li>Maximum size: 5MB</li>
						</ul>
					</div>
					<div>
						<h3 className="font-medium text-gray-800 mb-2">Documents</h3>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>Formats: PDF, DOC, DOCX</li>
							<li>Maximum size: 20MB</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
