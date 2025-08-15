import { dev } from '$app/environment';

export enum LogLevel {
	ERROR = 0,
	WARN = 1,
	INFO = 2,
	DEBUG = 3
}

interface LogContext {
	userId?: string;
	requestId?: string;
	route?: string;
	method?: string;
	[key: string]: any;
}

class Logger {
	private static instance: Logger;
	private logLevel: LogLevel;

	private constructor() {
		// In production, only log errors and warnings
		this.logLevel = dev ? LogLevel.DEBUG : LogLevel.WARN;
	}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	private formatMessage(level: string, message: string, context?: LogContext): string {
		const timestamp = new Date().toISOString();
		const contextStr = context ? ` ${JSON.stringify(context)}` : '';
		return `[${timestamp}] [${level}] ${message}${contextStr}`;
	}

	private log(
		level: LogLevel,
		levelStr: string,
		message: string,
		context?: LogContext,
		error?: Error
	) {
		if (level > this.logLevel) return;

		const formattedMessage = this.formatMessage(levelStr, message, context);

		switch (level) {
			case LogLevel.ERROR:
				console.error(formattedMessage, error);
				// In production, you might want to send errors to a service like Sentry
				if (!dev && error) {
					// TODO: Send to error tracking service
				}
				break;
			case LogLevel.WARN:
				console.warn(formattedMessage);
				break;
			case LogLevel.INFO:
				console.info(formattedMessage);
				break;
			case LogLevel.DEBUG:
				console.log(formattedMessage);
				break;
		}
	}

	error(message: string, error?: Error, context?: LogContext) {
		this.log(LogLevel.ERROR, 'ERROR', message, context, error);
	}

	warn(message: string, context?: LogContext) {
		this.log(LogLevel.WARN, 'WARN', message, context);
	}

	info(message: string, context?: LogContext) {
		this.log(LogLevel.INFO, 'INFO', message, context);
	}

	debug(message: string, context?: LogContext) {
		this.log(LogLevel.DEBUG, 'DEBUG', message, context);
	}

	// Helper method for API logging
	logApiRequest(method: string, route: string, userId?: string, data?: any) {
		this.info('API Request', {
			method,
			route,
			userId,
			data: dev ? data : undefined // Only log request data in dev
		});
	}

	// Helper method for API response logging
	logApiResponse(method: string, route: string, status: number, duration: number) {
		const level = status >= 400 ? LogLevel.WARN : LogLevel.INFO;
		const levelStr = status >= 400 ? 'WARN' : 'INFO';

		this.log(level, levelStr, 'API Response', {
			method,
			route,
			status,
			duration: `${duration}ms`
		});
	}

	// Helper method for database query logging
	logDatabaseQuery(query: string, duration: number, error?: Error) {
		if (error) {
			this.error('Database query failed', error, {
				query: dev ? query : 'Query hidden in production',
				duration: `${duration}ms`
			});
		} else {
			this.debug('Database query completed', {
				query: dev ? query : 'Query hidden in production',
				duration: `${duration}ms`
			});
		}
	}

	// Helper method for performance logging
	logPerformance(operation: string, duration: number, threshold = 1000) {
		if (duration > threshold) {
			this.warn(`Slow operation detected: ${operation}`, {
				duration: `${duration}ms`,
				threshold: `${threshold}ms`
			});
		} else {
			this.debug(`Operation completed: ${operation}`, {
				duration: `${duration}ms`
			});
		}
	}
}

// Export a singleton instance
export const logger = Logger.getInstance();

// Export helper function for timing operations
export async function withTiming<T>(
	operation: string,
	fn: () => Promise<T>,
	threshold?: number
): Promise<T> {
	const start = Date.now();
	try {
		const result = await fn();
		const duration = Date.now() - start;
		logger.logPerformance(operation, duration, threshold);
		return result;
	} catch (error) {
		const duration = Date.now() - start;
		logger.error(`Operation failed: ${operation}`, error as Error, {
			duration: `${duration}ms`
		});
		throw error;
	}
}

// Export helper function for wrapping API handlers with logging
export function withApiLogging<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
	return (async (...args: any[]) => {
		const [event] = args;
		const start = Date.now();
		const { method, url } = event.request;
		const route = new URL(url).pathname;
		const userId = event.locals?.user?.id;

		logger.logApiRequest(method, route, userId);

		try {
			const response = await handler(...args);
			const duration = Date.now() - start;
			logger.logApiResponse(method, route, response.status, duration);
			return response;
		} catch (error) {
			const duration = Date.now() - start;
			logger.error('API handler error', error as Error, {
				method,
				route,
				userId,
				duration: `${duration}ms`
			});
			throw error;
		}
	}) as T;
}
