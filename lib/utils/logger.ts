/**
 * Simple logging utility
 * Can be extended to use external logging services (Winston, Pino, etc.)
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogData {
	level: LogLevel;
	message: string;
	timestamp: string;
	data?: any;
	stack?: string;
}

class Logger {
	private isDevelopment: boolean;

	constructor() {
		this.isDevelopment = process.env.NODE_ENV === "development";
	}

	/**
	 * Format log message
	 */
	private formatLog(level: LogLevel, message: string, data?: any): LogData {
		return {
			level,
			message,
			timestamp: new Date().toISOString(),
			...(data && { data }),
		};
	}

	/**
	 * Log info message
	 */
	info(message: string, data?: any): void {
		const log = this.formatLog("info", message, data);

		if (this.isDevelopment) {
			// console.log(`[INFO] ${log.timestamp} - ${message}`, data || "");
		} else {
			// console.log(JSON.stringify(log));
		}
	}

	/**
	 * Log warning message
	 */
	warn(message: string, data?: any): void {
		const log = this.formatLog("warn", message, data);

		if (this.isDevelopment) {
			console.warn(`[WARN] ${log.timestamp} - ${message}`, data || "");
		} else {
			console.warn(JSON.stringify(log));
		}
	}

	/**
	 * Log error message
	 */
	error(message: string, error?: Error | any): void {
		const log = this.formatLog("error", message, {
			...(error instanceof Error && {
				name: error.name,
				message: error.message,
				stack: error.stack,
			}),
			...(!(error instanceof Error) && error),
		});

		if (this.isDevelopment) {
			console.error(`[ERROR] ${log.timestamp} - ${message}`);
			if (error instanceof Error) {
				console.error(error);
			} else if (error) {
				console.error(error);
			}
		} else {
			console.error(JSON.stringify(log));
		}
	}

	/**
	 * Log debug message (only in development)
	 */
	debug(message: string, data?: any): void {
		if (!this.isDevelopment) return;

		const log = this.formatLog("debug", message, data);
		console.debug(`[DEBUG] ${log.timestamp} - ${message}`, data || "");
	}

	/**
	 * Log HTTP request
	 */
	http(
		method: string,
		url: string,
		statusCode: number,
		duration?: number
	): void {
		const message = `${method} ${url} - ${statusCode}${
			duration ? ` (${duration}ms)` : ""
		}`;

		if (statusCode >= 500) {
			this.error(message);
		} else if (statusCode >= 400) {
			this.warn(message);
		} else {
			this.info(message);
		}
	}

	/**
	 * Log database operation
	 */
	db(operation: string, collection: string, duration?: number): void {
		const message = `DB ${operation} on ${collection}${
			duration ? ` (${duration}ms)` : ""
		}`;
		this.debug(message);
	}

	/**
	 * Log authentication event
	 */
	auth(event: string, userId?: string, details?: any): void {
		const message = `Auth: ${event}${userId ? ` - User: ${userId}` : ""}`;
		this.info(message, details);
	}
}

// Export singleton instance
export const logger = new Logger();

// Export logger class for testing
export { Logger };
