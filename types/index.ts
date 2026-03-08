export * from "./product";
export * from "./article";
export * from "./team";

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};
