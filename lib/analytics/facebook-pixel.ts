export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

declare global {
	interface Window {
		fbq: any;
	}
}

export const pageview = () => {
	if (typeof window !== "undefined" && window.fbq) {
		window.fbq("track", "PageView");
	}
};

export const event = (name: string, options: Record<string, any> = {}) => {
	if (typeof window !== "undefined" && window.fbq) {
		window.fbq("track", name, options);
	}
};

// Standard events
export const trackLead = () => {
	event("Lead");
};

export const trackContact = () => {
	event("Contact");
};

export const trackViewContent = (contentName: string) => {
	event("ViewContent", { content_name: contentName });
};
