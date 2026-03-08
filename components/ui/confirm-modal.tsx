"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "primary" | "destructive";
	onConfirm: () => void | Promise<void>;
	isLoading?: boolean;
}

export function ConfirmModal({
	open,
	onOpenChange,
	title = "Are you sure?",
	description = "This action cannot be undone.",
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "primary",
	onConfirm,
	isLoading = false,
}: ConfirmModalProps) {
	const [isPending, setIsPending] = React.useState(false);

	const handleConfirm = async () => {
		setIsPending(true);
		try {
			await onConfirm();
			onOpenChange(false);
		} finally {
			setIsPending(false);
		}
	};

	const loading = isLoading || isPending;

	// Map variant to button style - destructive uses custom red styling
	const isDestructive = variant === "destructive";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						{cancelText}
					</Button>
					<Button
						variant="primary"
						onClick={handleConfirm}
						disabled={loading}
						className={isDestructive ? "bg-red-600 hover:bg-red-700" : ""}
					>
						{loading ? "Loading..." : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Hook for easy usage
interface UseConfirmModalOptions {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "primary" | "destructive";
}

export function useConfirmModal(defaultOptions?: UseConfirmModalOptions) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [options, setOptions] = React.useState<UseConfirmModalOptions>(
		defaultOptions || {}
	);
	const resolveRef = React.useRef<((value: boolean) => void) | null>(null);

	const confirm = React.useCallback(
		(overrideOptions?: UseConfirmModalOptions): Promise<boolean> => {
			setOptions({ ...defaultOptions, ...overrideOptions });
			setIsOpen(true);
			return new Promise((resolve) => {
				resolveRef.current = resolve;
			});
		},
		[defaultOptions]
	);

	const handleConfirm = React.useCallback(() => {
		resolveRef.current?.(true);
		resolveRef.current = null;
	}, []);

	const handleOpenChange = React.useCallback((open: boolean) => {
		setIsOpen(open);
		if (!open) {
			resolveRef.current?.(false);
			resolveRef.current = null;
		}
	}, []);

	const ConfirmModalComponent = React.useCallback(
		() => (
			<ConfirmModal
				open={isOpen}
				onOpenChange={handleOpenChange}
				onConfirm={handleConfirm}
				{...options}
			/>
		),
		[isOpen, handleOpenChange, handleConfirm, options]
	);

	return {
		confirm,
		ConfirmModal: ConfirmModalComponent,
		isOpen,
	};
}
