// src/utils/server/smart-llm-service.ts

import type { SupabaseClient } from '@supabase/supabase-js';
import { PRIVATE_OPENROUTER_API_KEY } from '$env/static/private';
import type { Database } from '../../../database.types';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type JSONProfile = 'fast' | 'balanced' | 'powerful' | 'maximum' | 'custom';
export type TextProfile = 'speed' | 'balanced' | 'quality' | 'creative' | 'custom';

export interface LLMErrorLogger {
	logDatabaseError?: (...args: any[]) => Promise<void>;
	logAPIError?: (...args: any[]) => Promise<void>;
}

export interface ModelProfile {
	id: string;
	name: string;
	speed: number; // 1-5 (5 = fastest)
	smartness: number; // 1-5 (5 = smartest)
	creativity?: number; // 1-5 (for text generation)
	cost: number; // per 1M input tokens
	outputCost: number; // per 1M output tokens
	provider: string;
	bestFor: string[];
	limitations?: string[];
}

export interface JSONRequestOptions {
	systemPrompt: string;
	userPrompt: string;
	userId?: string; // Made optional to match LLMService interface expectations
	profile?: JSONProfile;
	temperature?: number;
	validation?: {
		retryOnParseError?: boolean;
		validateSchema?: boolean;
		maxRetries?: number;
	};
	requirements?: {
		maxLatency?: number;
		minAccuracy?: number;
		maxCost?: number;
	};
	// Optional context for usage tracking
	operationType?: string;
	projectId?: string;
	brainDumpId?: string;
	taskId?: string;
	briefId?: string;
}

export interface TextGenerationOptions {
	prompt: string;
	userId?: string; // Made optional to match LLMService interface expectations
	profile?: TextProfile;
	systemPrompt?: string;
	temperature?: number;
	maxTokens?: number;
	streaming?: boolean;
	requirements?: {
		maxLatency?: number;
		minQuality?: number;
		maxCost?: number;
	};
	// Optional context for usage tracking
	operationType?: string;
	projectId?: string;
	brainDumpId?: string;
	taskId?: string;
	briefId?: string;
}

export interface TextGenerationUsage {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
}

export interface TextGenerationResult {
	text: string;
	usage?: TextGenerationUsage;
}

interface OpenRouterResponse {
	id: string;
	provider?: string;
	model: string;
	object: string;
	created: number;
	choices: Array<{
		message: {
			content: string;
			role: string;
		};
		finish_reason: string;
		native_finish_reason?: string;
	}>;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
		prompt_tokens_details?: {
			cached_tokens?: number;
			audio_tokens?: number;
		};
		completion_tokens_details?: {
			reasoning_tokens?: number;
		};
	};
	system_fingerprint?: string;
}

// ============================================
// MODEL CONFIGURATIONS
// ============================================

const JSON_MODELS: Record<string, ModelProfile> = {
	// Ultra-fast tier (1-2s) - Free models
	'x-ai/grok-4-fast:free': {
		id: 'x-ai/grok-4-fast:free',
		name: 'Grok 4 Fast (Free)',
		speed: 4.5,
		smartness: 4.3,
		cost: 0.0,
		outputCost: 0.0,
		provider: 'x-ai',
		bestFor: ['json-mode', 'free-tier', 'fast-prototyping', 'reasoning'],
		limitations: ['limited-time-free', 'data-used-for-training', 'privacy-concerns']
	},

	// Fast tier (2-3s)
	'google/gemini-2.5-flash-lite': {
		id: 'google/gemini-2.5-flash-lite',
		name: 'Gemini 2.5 Flash Lite',
		speed: 4.5,
		smartness: 4.2,
		cost: 0.07, // Corrected from 0.1
		outputCost: 0.3, // Corrected from 0.4
		provider: 'google',
		bestFor: ['ultra-low-cost', 'lightweight-reasoning', 'json-mode', 'structured-output'],
		limitations: ['reasoning-disabled-by-default']
	},
	'google/gemini-2.0-flash-001': {
		id: 'google/gemini-2.0-flash-001',
		name: 'Gemini 2.0 Flash',
		speed: 4,
		smartness: 4.3,
		cost: 0.1, // Verified
		outputCost: 0.4, // Verified
		provider: 'google',
		bestFor: ['fast-ttft', 'complex-instructions', 'function-calling', 'multimodal'],
		limitations: ['no-explicit-json-mode', 'lower-tool-calling-success']
	},
	'openai/gpt-4o-mini': {
		id: 'openai/gpt-4o-mini',
		name: 'GPT-4o Mini',
		speed: 4,
		smartness: 4,
		cost: 0.15,
		outputCost: 0.6,
		provider: 'openai',
		bestFor: ['json-mode', 'cost-effective', 'structured-output', 'general-purpose'],
		limitations: []
	},
	'deepseek/deepseek-chat': {
		id: 'deepseek/deepseek-chat',
		name: 'DeepSeek Chat V3',
		speed: 3.5,
		smartness: 4.5,
		cost: 0.27, // Corrected from 0.14
		outputCost: 1.1, // Corrected from 0.28
		provider: 'deepseek',
		bestFor: ['complex-json', 'instruction-following', 'nested-structures', 'best-value'],
		limitations: ['knowledge-cutoff-dec-2024']
	},
	'x-ai/grok-code-fast-1': {
		id: 'x-ai/grok-code-fast-1',
		name: 'Grok Code Fast',
		speed: 3.5,
		smartness: 4.4,
		cost: 0.2,
		outputCost: 1.5,
		provider: 'x-ai',
		bestFor: ['agentic-coding', 'json-mode', 'structured-output', 'reasoning-traces'],
		limitations: []
	},
	'z-ai/glm-4.6': {
		id: 'z-ai/glm-4.6',
		name: 'GLM 4.6',
		speed: 3.5,
		smartness: 4.4,
		cost: 0.5,
		outputCost: 1.75,
		provider: 'z-ai',
		bestFor: ['coding', 'long-context', 'reasoning', 'structured-output', 'tool-use'],
		limitations: ['fp8-quantization']
	},
	'qwen/qwen-2.5-72b-instruct': {
		id: 'qwen/qwen-2.5-72b-instruct',
		name: 'Qwen 2.5 72B',
		speed: 3,
		smartness: 4,
		cost: 0.35,
		outputCost: 0.4,
		provider: 'qwen',
		bestFor: ['structured-output', 'multilingual', 'coding']
	},

	// Balanced tier (3-4s)
	'anthropic/claude-3-haiku-20240307': {
		id: 'anthropic/claude-3-haiku-20240307',
		name: 'Claude 3 Haiku',
		speed: 3,
		smartness: 3.5,
		cost: 0.25,
		outputCost: 1.25,
		provider: 'anthropic',
		bestFor: ['fast-analysis', 'simple-json']
	},
	'anthropic/claude-3-5-haiku': {
		id: 'anthropic/claude-3-5-haiku',
		name: 'Claude 3.5 Haiku',
		speed: 4.2,
		smartness: 4.1,
		cost: 0.8, // Corrected from 0.5
		outputCost: 4.0, // Corrected from 1.0
		provider: 'anthropic',
		bestFor: ['fast-json', 'excellent-tool-calling', 'agent-chat', 'brain-dumps'],
		limitations: ['no-native-json-mode']
	},
	'google/gemini-1.5-flash': {
		id: 'google/gemini-1.5-flash',
		name: 'Gemini 1.5 Flash',
		speed: 3,
		smartness: 4,
		cost: 0.15,
		outputCost: 0.6,
		provider: 'google',
		bestFor: ['large-context', 'mixed-content'],
		limitations: ['json-mode-quirks']
	},

	// Powerful tier (4-5s)
	'anthropic/claude-3-5-sonnet-20241022': {
		id: 'anthropic/claude-3-5-sonnet-20241022',
		name: 'Claude 3.5 Sonnet',
		speed: 2,
		smartness: 4.7,
		cost: 3.0,
		outputCost: 15.0,
		provider: 'anthropic',
		bestFor: ['complex-reasoning', 'nuanced-instructions', 'markdown-generation'],
		limitations: ['no-native-json-mode']
	},
	'deepseek/deepseek-reasoner': {
		id: 'deepseek/deepseek-reasoner',
		name: 'DeepSeek Reasoner',
		speed: 3.8,
		smartness: 4.9,
		cost: 0.07, // Corrected from 1.2
		outputCost: 1.68, // Corrected from 2.4
		provider: 'deepseek',
		bestFor: [
			'complex-reasoning',
			'math',
			'coding',
			'tool-calling',
			'advanced-analysis',
			'best-reasoning'
		],
		limitations: ['slower-than-chat', 'verbose-output']
	},

	// Maximum tier (5-7s)
	'openai/gpt-4o': {
		id: 'openai/gpt-4o',
		name: 'GPT-4o',
		speed: 2,
		smartness: 4.5,
		cost: 2.5,
		outputCost: 10.0,
		provider: 'openai',
		bestFor: ['json-mode', 'general-purpose']
	}
};

const TEXT_MODELS: Record<string, ModelProfile> = {
	// Ultra-speed tier (<1s) - Free models
	'x-ai/grok-4-fast:free': {
		id: 'x-ai/grok-4-fast:free',
		name: 'Grok 4 Fast (Free)',
		speed: 4.8,
		smartness: 4.3,
		creativity: 4.2,
		cost: 0.0,
		outputCost: 0.0,
		provider: 'x-ai',
		bestFor: ['free-tier', 'fast-generation', 'reasoning', 'multimodal'],
		limitations: ['data-used-for-training', 'limited-requests', 'privacy-concerns']
	},

	// Speed tier (<1s)
	'x-ai/grok-4-fast': {
		id: 'x-ai/grok-4-fast',
		name: 'Grok 4 Fast',
		speed: 5,
		smartness: 3,
		creativity: 3,
		cost: 0.05,
		outputCost: 0.08,
		provider: 'x-ai',
		bestFor: ['chat', 'quick-responses', 'simple-content']
	},
	'google/gemini-flash-1.5-8b': {
		id: 'google/gemini-flash-1.5-8b',
		name: 'Gemini Flash 8B',
		speed: 4.5,
		smartness: 3.5,
		creativity: 3,
		cost: 0.075,
		outputCost: 0.3,
		provider: 'google',
		bestFor: ['fast-generation', 'summaries']
	},
	'google/gemini-2.0-flash-001': {
		id: 'google/gemini-2.0-flash-001',
		name: 'Gemini 2.0 Flash',
		speed: 4.2,
		smartness: 4.3,
		creativity: 4,
		cost: 0.1,
		outputCost: 0.4,
		provider: 'google',
		bestFor: ['fast-ttft', 'complex-instructions', 'multimodal', 'function-calling']
	},
	'google/gemini-2.5-flash-lite': {
		id: 'google/gemini-2.5-flash-lite',
		name: 'Gemini 2.5 Flash Lite',
		speed: 4.5,
		smartness: 4.2,
		creativity: 4,
		cost: 0.1,
		outputCost: 0.4,
		provider: 'google',
		bestFor: ['ultra-low-latency', 'lightweight-reasoning', 'cost-efficient']
	},

	// Balanced tier (1-3s)
	'anthropic/claude-3-5-haiku': {
		id: 'anthropic/claude-3-5-haiku',
		name: 'Claude 3.5 Haiku',
		speed: 4.2,
		smartness: 4.1,
		creativity: 4.0,
		cost: 0.8, // Corrected from 0.5
		outputCost: 4.0, // Corrected from 1.0
		provider: 'anthropic',
		bestFor: ['fast-generation', 'excellent-tool-calling', 'agent-chat', 'briefs']
	},
	'openai/gpt-4o-mini': {
		id: 'openai/gpt-4o-mini',
		name: 'GPT-4o Mini',
		speed: 4,
		smartness: 4,
		creativity: 4,
		cost: 0.15,
		outputCost: 0.6,
		provider: 'openai',
		bestFor: ['cost-effective', 'general-purpose', 'balanced-quality']
	},
	'deepseek/deepseek-chat': {
		id: 'deepseek/deepseek-chat',
		name: 'DeepSeek Chat V3',
		speed: 3,
		smartness: 4.5,
		creativity: 4,
		cost: 0.27, // Corrected from 0.14
		outputCost: 1.1, // Corrected from 0.28
		provider: 'deepseek',
		bestFor: ['briefs', 'reports', 'structured-content', 'best-value']
	},
	'z-ai/glm-4.6': {
		id: 'z-ai/glm-4.6',
		name: 'GLM 4.6',
		speed: 3.5,
		smartness: 4.4,
		creativity: 4.2,
		cost: 0.5,
		outputCost: 1.75,
		provider: 'z-ai',
		bestFor: ['coding', 'long-content', 'reasoning', 'refined-writing', 'technical-docs']
	},
	'anthropic/claude-3-haiku-20240307': {
		id: 'anthropic/claude-3-haiku-20240307',
		name: 'Claude 3 Haiku',
		speed: 3.5,
		smartness: 3.5,
		creativity: 3.5,
		cost: 0.25,
		outputCost: 1.25,
		provider: 'anthropic',
		bestFor: ['general-writing', 'explanations']
	},

	// Quality tier (3-5s)
	'anthropic/claude-3-5-sonnet-20241022': {
		id: 'anthropic/claude-3-5-sonnet-20241022',
		name: 'Claude 3.5 Sonnet',
		speed: 2,
		smartness: 4.7,
		creativity: 4.5,
		cost: 3.0,
		outputCost: 15.0,
		provider: 'anthropic',
		bestFor: ['high-quality-writing', 'complex-content', 'nuanced-text']
	},
	'deepseek/deepseek-reasoner': {
		id: 'deepseek/deepseek-reasoner',
		name: 'DeepSeek Reasoner',
		speed: 3.8,
		smartness: 4.9,
		creativity: 4.4,
		cost: 0.07, // Corrected from 1.2
		outputCost: 1.68, // Corrected from 2.4
		provider: 'deepseek',
		bestFor: ['reasoning', 'analysis', 'technical-writing', 'complex-content', 'coding']
	}
};

// Models that have reliable tool-calling support when routed through OpenRouter.
// The order doubles as our fallback priority list whenever we must guarantee tool support.
// Updated 2025-01-14 based on benchmark data and real-world testing
const TOOL_CALLING_MODEL_ORDER = [
	'anthropic/claude-3-5-sonnet-20241022', // Excellent: ~92% success rate, best for complex tools
	'anthropic/claude-3-5-haiku', // Fast + reliable: ~92% success rate, 0.97s TTFT
	'openai/gpt-4o', // Strong: 87%+ success rate
	'openai/gpt-4o-mini', // Fast + good: 88% success rate
	'deepseek/deepseek-reasoner', // Good reasoning but slower
	'deepseek/deepseek-chat', // Good for sequential tasks
	'x-ai/grok-code-fast-1',
	'z-ai/glm-4.6',
	'google/gemini-2.0-flash-001' // Lower reliability: 75-76% success rate
] as const;
const TOOL_CALLING_MODEL_SET = new Set<string>(TOOL_CALLING_MODEL_ORDER);

// ============================================
// PROFILE MAPPINGS
// ============================================

const JSON_PROFILE_MODELS: Record<JSONProfile, string[]> = {
	fast: [
		'google/gemini-2.5-flash-lite', // Ultra-low cost: $0.07/$0.30
		'anthropic/claude-3-5-haiku', // Fast + reliable tools
		'deepseek/deepseek-chat', // Good reasoning + value
		'openai/gpt-4o-mini'
	],
	balanced: [
		'deepseek/deepseek-chat', // Best value: $0.27/$1.10
		'anthropic/claude-3-5-haiku', // Excellent tool calling
		'openai/gpt-4o-mini',
		'google/gemini-2.5-flash-lite' // Cost fallback
	],
	powerful: [
		'deepseek/deepseek-reasoner', // Best reasoning for cost: $0.07/$1.68
		'anthropic/claude-3-5-sonnet-20241022',
		'openai/gpt-4o'
	],
	maximum: [
		'anthropic/claude-3-5-sonnet-20241022', // Best for nuanced tasks
		'deepseek/deepseek-reasoner', // Excellent reasoning
		'openai/gpt-4o'
	],
	custom: [] // Will be determined by requirements
};

const TEXT_PROFILE_MODELS: Record<TextProfile, string[]> = {
	speed: [
		'google/gemini-2.5-flash-lite', // Fastest + cheapest
		'anthropic/claude-3-5-haiku', // Fast with good quality
		'openai/gpt-4o-mini' // Reliable fallback
	],
	balanced: [
		'deepseek/deepseek-chat', // Best value
		'anthropic/claude-3-5-haiku', // Good for agents
		'openai/gpt-4o-mini',
		'google/gemini-2.5-flash-lite' // Cost fallback
	],
	quality: [
		'anthropic/claude-3-5-sonnet-20241022',
		'deepseek/deepseek-reasoner', // Excellent for technical content
		'openai/gpt-4o'
	],
	creative: [
		'anthropic/claude-3-5-sonnet-20241022',
		'openai/gpt-4o',
		'deepseek/deepseek-reasoner' // Good for creative reasoning
	],
	custom: []
};

// ============================================
// MAIN SERVICE CLASS
// ============================================

export class SmartLLMService {
	private apiKey: string = PRIVATE_OPENROUTER_API_KEY;
	private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
	private costTracking = new Map<string, number>();
	private performanceMetrics = new Map<string, number[]>();
	private errorLogger?: LLMErrorLogger;

	// Optional: For logging and metrics
	private supabase?: SupabaseClient<Database>;

	// Configuration
	private httpReferer: string;
	private appName: string;

	constructor(config?: {
		httpReferer?: string;
		appName?: string;
		supabase?: SupabaseClient<Database>;
		errorLogger?: LLMErrorLogger;
	}) {
		this.httpReferer = config?.httpReferer || 'https://yourdomain.com';
		this.appName = config?.appName || 'SmartLLMService';
		this.supabase = config?.supabase;
		this.errorLogger = config?.errorLogger;
	}

	// ============================================
	// DATABASE LOGGING
	// ============================================

	// Track whether we've already warned about the missing table to avoid log spam
	private static hasWarnedAboutMissingTable = false;

	private async logUsageToDatabase(params: {
		userId?: string; // Made optional to match TextGenerationOptions
		operationType: string;
		modelRequested: string;
		modelUsed: string;
		provider?: string;
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
		inputCost: number;
		outputCost: number;
		totalCost: number;
		responseTimeMs: number;
		requestStartedAt: Date;
		requestCompletedAt: Date;
		status: 'success' | 'failure' | 'timeout' | 'rate_limited' | 'invalid_response';
		errorMessage?: string;
		temperature?: number;
		maxTokens?: number;
		profile?: string;
		streaming?: boolean;
		projectId?: string;
		brainDumpId?: string;
		taskId?: string;
		briefId?: string;
		openrouterRequestId?: string;
		openrouterCacheStatus?: string;
		rateLimitRemaining?: number;
		metadata?: any;
	}): Promise<void> {
		if (!this.supabase) {
			// Don't warn - this is expected when supabase client is not provided
			return;
		}

		try {
			const sanitizedUserId = this.normalizeUserIdForLogging(params.userId);

			// Defensive check: Skip logging if user_id is invalid
			// This prevents foreign key constraint violations
			if (!sanitizedUserId) {
				// Skip silently - this is expected for anonymous operations
				return;
			}

		} catch (error) {
			// Silently fail for logging errors - don't disrupt the main operation
			if (this.errorLogger?.logDatabaseError) {
				await this.errorLogger.logDatabaseError(error, 'INSERT', 'llm_usage_logs', params.userId, {
					operation: 'logUsageToDatabase',
					errorType: 'llm_usage_logging_failure',
					operationType: params.operationType,
					modelUsed: params.modelUsed,
					status: params.status
				});
			}
		}
	}

	private normalizeUserIdForLogging(userId?: string | null): string | null {
		if (!userId) return null;
		const trimmed = userId.trim();
		const uuidRegex =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
		return uuidRegex.test(trimmed) ? trimmed : null;
	}

	// ============================================
	// JSON RESPONSE METHOD
	// ============================================

	async getJSONResponse<T = any>(options: JSONRequestOptions): Promise<T> {
		const requestStartedAt = new Date();
		const startTime = performance.now();
		const profile = options.profile || 'balanced';

		// Analyze prompt complexity
		const complexity = this.analyzeComplexity(options.systemPrompt + options.userPrompt);

		// Select models based on profile and requirements
		const preferredModels = this.selectJSONModels(profile, complexity, options.requirements);

		// Add JSON-specific instructions to system prompt
		const enhancedSystemPrompt = this.enhanceSystemPromptForJSON(options.systemPrompt);

		let lastError: Error | null = null;
		let retryCount = 0;
		const maxRetries = options.validation?.maxRetries || 2;

		// Make the OpenRouter API call with model routing
		// Primary model is first in preferredModels, others are fallbacks
		try {
			const response = await this.callOpenRouter({
				model: preferredModels[0] || 'openai/gpt-4o-mini', // Primary model with fallback
				models: preferredModels, // All models for fallback routing (via extra_body)
				messages: [
					{ role: 'system', content: enhancedSystemPrompt },
					{ role: 'user', content: options.userPrompt }
				],
				temperature: options.temperature || 0.2,
				response_format: this.supportsJsonMode(preferredModels[0] || 'openai/gpt-4o-mini')
					? { type: 'json_object' }
					: undefined,
				max_tokens: 8192
			});

			// Guard against malformed response
			if (!response.choices || response.choices.length === 0) {
				throw new Error('OpenRouter returned empty choices array');
			}

			const content = response.choices[0]?.message?.content;
			if (!content) {
				throw new Error('OpenRouter returned empty content');
			}

			// Parse the response
			let result: T;
			let cleaned = ''; // Declare outside try block for error logging

			try {
				// Clean and parse JSON
				cleaned = this.cleanJSONResponse(content);
				result = JSON.parse(cleaned) as T;
			} catch (parseError) {
				// Log which model actually responded
				const actualModel = response.model || preferredModels[0] || 'unknown';
				console.error(`JSON parse error with ${actualModel}:`, parseError);

				// Enhanced error logging with context
				if (parseError instanceof SyntaxError && parseError.message.includes('position')) {
					// Extract position from error message (e.g., "at position 1618")
					const posMatch = parseError.message.match(/position (\d+)/);
					if (posMatch && posMatch[1]) {
						const errorPos = parseInt(posMatch[1], 10);
						const contextStart = Math.max(0, errorPos - 100);
						const contextEnd = Math.min(cleaned.length, errorPos + 100);
						console.error(
							`Context around error position ${errorPos}:`,
							'\n' + cleaned.substring(contextStart, contextEnd)
						);
						console.error(
							`Full response length: ${cleaned.length} characters, Error at: ${errorPos}`
						);
					}
				}

				// If validation is enabled and parse failed, we can retry with a more powerful model
				if (options.validation?.retryOnParseError && retryCount < maxRetries) {
					retryCount++;
					console.log(`Retrying with powerful model (attempt ${retryCount}/${maxRetries})`);

					let cleanedRetry = ''; // Declare outside try block for error logging
					try {
						// Try again with powerful profile
						const retryResponse = await this.callOpenRouter({
							model: 'anthropic/claude-3-5-sonnet-20241022',
							models: ['anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o'],
							messages: [
								{ role: 'system', content: enhancedSystemPrompt },
								{ role: 'user', content: options.userPrompt }
							],
							temperature: 0.1, // Lower temperature for retry
							response_format: { type: 'json_object' },
							max_tokens: 8192
						});

						// Guard against malformed retry response
						if (!retryResponse.choices || retryResponse.choices.length === 0) {
							throw new Error('Retry: OpenRouter returned empty choices array');
						}

						const retryContent = retryResponse.choices[0]?.message?.content;
						if (!retryContent) {
							throw new Error('Retry: OpenRouter returned empty content');
						}

						cleanedRetry = this.cleanJSONResponse(retryContent);
						result = JSON.parse(cleanedRetry) as T;
					} catch (retryError) {
						// If retry also fails, throw original error with context
						console.error(`Retry also failed after ${retryCount} attempts:`, retryError);
						// Log critical parse failure
						if (this.errorLogger?.logAPIError) {
							await this.errorLogger.logAPIError(retryError, this.apiUrl, 'POST', options.userId, {
								operation: 'getJSONResponse_retry_parse_failure',
								errorType: 'llm_json_parse_failure_after_retry',
								modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
								retryModel: 'anthropic/claude-3-5-sonnet-20241022',
								retryAttempt: retryCount,
								maxRetries,
								responseLength: cleanedRetry.length || 0
							});
						}
						throw new Error(
							`Failed to parse JSON after ${retryCount} retries. Original error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
						);
					}
				} else {
					// Log parse failure without retry
					if (this.errorLogger?.logAPIError) {
						await this.errorLogger.logAPIError(parseError, this.apiUrl, 'POST', options.userId, {
							operation: 'getJSONResponse_parse_failure',
							errorType: 'llm_json_parse_failure',
							modelUsed: actualModel,
							responseLength: cleaned.length,
							retryDisabled: !options.validation?.retryOnParseError
						});
					}
					throw parseError;
				}
			}

			// Track metrics
			const duration = performance.now() - startTime;
			const requestCompletedAt = new Date();
			const actualModel = response.model || preferredModels[0] || 'openai/gpt-4o-mini';
			this.trackPerformance(actualModel, duration);
			this.trackCost(actualModel, response.usage);

			// Calculate costs
			const modelConfig = JSON_MODELS[actualModel];
			const inputCost = modelConfig
				? ((response.usage?.prompt_tokens || 0) / 1_000_000) * modelConfig.cost
				: 0;
			const outputCost = modelConfig
				? ((response.usage?.completion_tokens || 0) / 1_000_000) * modelConfig.outputCost
				: 0;

			console.log(`JSON Response Success:
				Model: ${actualModel}
				Duration: ${duration.toFixed(0)}ms
				Tokens: ${response.usage?.total_tokens || 'unknown'}
				Cost: ${this.calculateCost(actualModel, response.usage)}
			`);

			// Log to database (async, non-blocking)
			const cachedTokens = response.usage?.prompt_tokens_details?.cached_tokens || 0;
			this.logUsageToDatabase({
				userId: options.userId,
				operationType: options.operationType || 'other',
				modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
				modelUsed: actualModel,
				provider: response.provider || modelConfig?.provider,
				promptTokens: response.usage?.prompt_tokens || 0,
				completionTokens: response.usage?.completion_tokens || 0,
				totalTokens: response.usage?.total_tokens || 0,
				inputCost,
				outputCost,
				totalCost: inputCost + outputCost,
				responseTimeMs: Math.round(duration),
				requestStartedAt,
				requestCompletedAt,
				status: 'success',
				temperature: options.temperature,
				maxTokens: 8192,
				profile,
				streaming: false,
				projectId: options.projectId,
				brainDumpId: options.brainDumpId,
				taskId: options.taskId,
				briefId: options.briefId,
				openrouterRequestId: response.id,
				openrouterCacheStatus: cachedTokens > 0 ? 'hit' : 'miss',
				metadata: {
					complexity,
					retryCount,
					preferredModels,
					cachedTokens,
					reasoningTokens: response.usage?.completion_tokens_details?.reasoning_tokens || 0,
					systemFingerprint: response.system_fingerprint
				}
			}).catch((err) => console.error('Failed to log usage:', err));

			return result;
		} catch (error) {
			lastError = error as Error;
			const duration = performance.now() - startTime;
			const requestCompletedAt = new Date();

			console.error(`OpenRouter request failed:`, error);

			// Log to error tracking system
			if (this.errorLogger?.logAPIError) {
				await this.errorLogger.logAPIError(error, this.apiUrl, 'POST', options.userId, {
					operation: 'getJSONResponse',
					errorType: 'llm_api_request_failure',
					modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
					profile,
					complexity,
					isTimeout: lastError.message.includes('timeout'),
					projectId: options.projectId,
					brainDumpId: options.brainDumpId,
					taskId: options.taskId
				});
			}

			// Log failure to database
			this.logUsageToDatabase({
				userId: options.userId,
				operationType: options.operationType || 'other',
				modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
				modelUsed: preferredModels[0] || 'openai/gpt-4o-mini',
				promptTokens: 0,
				completionTokens: 0,
				totalTokens: 0,
				inputCost: 0,
				outputCost: 0,
				totalCost: 0,
				responseTimeMs: Math.round(duration),
				requestStartedAt,
				requestCompletedAt,
				status: lastError.message.includes('timeout') ? 'timeout' : 'failure',
				errorMessage: lastError.message,
				temperature: options.temperature,
				maxTokens: 8192,
				profile,
				streaming: false,
				projectId: options.projectId,
				brainDumpId: options.brainDumpId,
				taskId: options.taskId,
				briefId: options.briefId,
				metadata: {
					complexity,
					preferredModels
				}
			}).catch((err) => console.error('Failed to log error:', err));

			throw new Error(`Failed to generate valid JSON: ${lastError?.message}`);
		}
	}

	// ============================================
	// TEXT GENERATION METHOD
	// ============================================

	private async performTextGeneration(
		options: TextGenerationOptions
	): Promise<TextGenerationResult> {
		const requestStartedAt = new Date();
		const startTime = performance.now();
		const profile = options.profile || 'balanced';

		// Estimate response length
		const estimatedLength = this.estimateResponseLength(options.prompt);

		// Select models based on profile and requirements
		const preferredModels = this.selectTextModels(profile, estimatedLength, options.requirements);

		// Make the OpenRouter API call with model routing
		try {
			const response = await this.callOpenRouter({
				model: preferredModels[0] || 'openai/gpt-4o-mini', // Primary model with fallback
				models: preferredModels, // All models for fallback routing (via extra_body)
				messages: [
					{
						role: 'system',
						content:
							options.systemPrompt ||
							'You are an expert writer who creates clear, engaging, and well-structured content.'
					},
					{ role: 'user', content: options.prompt }
				],
				temperature: options.temperature || 0.7,
				max_tokens: options.maxTokens || 4096,
				stream: options.streaming || false
			});

			// Guard against malformed response
			if (!response.choices || response.choices.length === 0) {
				throw new Error('OpenRouter returned empty choices array');
			}

			const content = response.choices[0]?.message?.content;
			if (!content) {
				throw new Error('OpenRouter returned empty content');
			}

			const actualModel = response.model || preferredModels[0] || 'openai/gpt-4o-mini';

			// Track metrics
			const duration = performance.now() - startTime;
			const requestCompletedAt = new Date();
			this.trackPerformance(actualModel, duration);
			this.trackCost(actualModel, response.usage);

			// Calculate costs
			const modelConfig = TEXT_MODELS[actualModel];
			const inputCost = modelConfig
				? ((response.usage?.prompt_tokens || 0) / 1_000_000) * modelConfig.cost
				: 0;
			const outputCost = modelConfig
				? ((response.usage?.completion_tokens || 0) / 1_000_000) * modelConfig.outputCost
				: 0;

			console.log(`Text Generation Success:
				Model: ${actualModel}
				Duration: ${duration.toFixed(0)}ms
				Length: ${content.length} chars
				Cost: ${this.calculateCost(actualModel, response.usage)}
			`);

			// Log to database (async, non-blocking)
			const cachedTokens = response.usage?.prompt_tokens_details?.cached_tokens || 0;
			this.logUsageToDatabase({
				userId: options.userId,
				operationType: options.operationType || 'other',
				modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
				modelUsed: actualModel,
				provider: response.provider || modelConfig?.provider,
				promptTokens: response.usage?.prompt_tokens || 0,
				completionTokens: response.usage?.completion_tokens || 0,
				totalTokens: response.usage?.total_tokens || 0,
				inputCost,
				outputCost,
				totalCost: inputCost + outputCost,
				responseTimeMs: Math.round(duration),
				requestStartedAt,
				requestCompletedAt,
				status: 'success',
				temperature: options.temperature,
				maxTokens: options.maxTokens,
				profile,
				streaming: options.streaming,
				projectId: options.projectId,
				brainDumpId: options.brainDumpId,
				taskId: options.taskId,
				briefId: options.briefId,
				openrouterRequestId: response.id,
				openrouterCacheStatus: cachedTokens > 0 ? 'hit' : 'miss',
				metadata: {
					estimatedLength,
					preferredModels,
					contentLength: content.length,
					cachedTokens,
					reasoningTokens: response.usage?.completion_tokens_details?.reasoning_tokens || 0,
					systemFingerprint: response.system_fingerprint
				}
			}).catch((err) => console.error('Failed to log usage:', err));

			const usage: TextGenerationUsage | undefined = response.usage
				? {
						promptTokens: response.usage.prompt_tokens || 0,
						completionTokens: response.usage.completion_tokens || 0,
						totalTokens: response.usage.total_tokens || 0
					}
				: undefined;

			return {
				text: content,
				usage
			};
		} catch (error) {
			const duration = performance.now() - startTime;
			const requestCompletedAt = new Date();

			console.error(`OpenRouter text generation failed:`, error);

			// Log to error tracking system
			if (this.errorLogger?.logAPIError) {
				await this.errorLogger.logAPIError(error, this.apiUrl, 'POST', options.userId, {
					operation: 'generateText',
					errorType: 'llm_text_generation_failure',
					modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
					profile,
					estimatedLength,
					isTimeout: (error as Error).message.includes('timeout'),
					projectId: options.projectId,
					brainDumpId: options.brainDumpId,
					taskId: options.taskId
				});
			}

			// Log failure to database
			this.logUsageToDatabase({
				userId: options.userId,
				operationType: options.operationType || 'other',
				modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
				modelUsed: preferredModels[0] || 'openai/gpt-4o-mini',
				promptTokens: 0,
				completionTokens: 0,
				totalTokens: 0,
				inputCost: 0,
				outputCost: 0,
				totalCost: 0,
				responseTimeMs: Math.round(duration),
				requestStartedAt,
				requestCompletedAt,
				status: (error as Error).message.includes('timeout') ? 'timeout' : 'failure',
				errorMessage: (error as Error).message,
				temperature: options.temperature,
				maxTokens: options.maxTokens,
				profile,
				streaming: options.streaming,
				projectId: options.projectId,
				brainDumpId: options.brainDumpId,
				taskId: options.taskId,
				briefId: options.briefId,
				metadata: {
					estimatedLength,
					preferredModels
				}
			}).catch((err) => console.error('Failed to log error:', err));

			throw new Error('Failed to generate text');
		}
	}

	// ============================================
	// OPENROUTER API CALL WITH ROUTING
	// ============================================

	private async callOpenRouter(params: {
		model: string;
		models?: string[]; // Additional models for fallback (OpenRouter extension)
		messages: Array<{ role: string; content: string }>;
		temperature?: number;
		max_tokens?: number;
		response_format?: { type: string };
		stream?: boolean;
		route?: 'fallback'; // NOTE: Not used - kept for backwards compatibility
		provider?: any; // NOTE: Not used - kept for backwards compatibility
	}): Promise<OpenRouterResponse> {
		const headers = {
			Authorization: `Bearer ${this.apiKey}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': this.httpReferer,
			'X-Title': this.appName
		};

		// Build request body following OpenRouter API v1 spec
		// See: https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request
		const body: any = {
			messages: params.messages,
			temperature: params.temperature,
			max_tokens: params.max_tokens,
			stream: params.stream || false
		};

		// Add response format if supported (e.g., json_object for compatible models)
		if (params.response_format) {
			body.response_format = params.response_format;
		}

		// Use 'models' array for automatic fallback routing when multiple models available
		// OpenRouter will try models in order until one succeeds
		// When using 'models' array, don't include 'model' field
		// Note: OpenRouter limits 'models' array to 3 items max
		if (params.models && params.models.length > 1) {
			body.models = params.models.slice(0, 3); // Limit to 3 models (OpenRouter max)
			body.route = 'fallback'; // Enable fallback routing
		} else {
			// Single model - use 'model' field
			body.model = params.model;
		}

		try {
			const response = await fetch(this.apiUrl, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(120000) // 2 minute timeout
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
			}

			const data = (await response.json()) as OpenRouterResponse;

			// Log OpenRouter routing result with all available metadata
			const cachedTokens = data.usage?.prompt_tokens_details?.cached_tokens || 0;
			const cacheHitRate = data.usage?.prompt_tokens
				? ((cachedTokens / data.usage.prompt_tokens) * 100).toFixed(1)
				: '0.0';

			console.debug('OpenRouter routing result:', {
				model: data.model || params.model,
				provider: data.provider || 'Unknown',
				cacheStatus:
					cachedTokens > 0 ? `${cacheHitRate}% cached (${cachedTokens} tokens)` : 'no cache',
				requestId: data.id,
				systemFingerprint: data.system_fingerprint,
				reasoningTokens: data.usage?.completion_tokens_details?.reasoning_tokens || 0
			});

			return data;
		} catch (error) {
			if (error instanceof Error && error.name === 'AbortError') {
				if (this.errorLogger?.logAPIError) {
					await this.errorLogger.logAPIError(error, this.apiUrl, 'POST', undefined, {
						operation: 'callOpenRouter_timeout',
						errorType: 'llm_api_timeout',
						modelRequested: params.model,
						alternativeModels: params.models?.join(', ') || 'none',
						timeoutMs: 120000,
						temperature: params.temperature,
						maxTokens: params.max_tokens
					});
				}
				throw new Error(`Request timeout for model ${params.model}`);
			}
			throw error;
		}
	}

	// Overload signatures for compatibility with LLMService interface
	async generateText(params: {
		systemPrompt: string;
		prompt: string;
		temperature?: number;
		maxTokens?: number;
		userId?: string;
		operationType?: string;
		profile?: TextProfile; // Added profile parameter
	}): Promise<string>;
	async generateText(options: TextGenerationOptions): Promise<string>;
	async generateText(
		optionsOrParams:
			| TextGenerationOptions
			| {
					systemPrompt: string;
					prompt: string;
					temperature?: number;
					maxTokens?: number;
					userId?: string;
					operationType?: string;
					profile?: TextProfile; // Added profile parameter
			  }
	): Promise<string> {
		// Normalize parameters to TextGenerationOptions format
		const options: TextGenerationOptions =
			'systemPrompt' in optionsOrParams
				? {
						prompt: optionsOrParams.prompt,
						userId: optionsOrParams.userId,
						systemPrompt: optionsOrParams.systemPrompt,
						temperature: optionsOrParams.temperature,
						maxTokens: optionsOrParams.maxTokens,
						operationType: optionsOrParams.operationType,
						profile: optionsOrParams.profile // Pass through profile
					}
				: optionsOrParams;

		const result = await this.performTextGeneration(options);
		return result.text;
	}

	async generateTextDetailed(options: TextGenerationOptions): Promise<TextGenerationResult> {
		return this.performTextGeneration(options);
	}

	// ============================================
	// PROVIDER ROUTING PREFERENCES
	// ============================================
	// NOTE: These methods are deprecated as OpenRouter does not support
	// the provider parameter with order/allow_fallbacks/require_parameters/data_collection fields.
	// Kept for backwards compatibility but not used in API calls.
	// See: https://openrouter.ai/docs/api-reference/chat/send-chat-completion-request

	/**
	 * @deprecated OpenRouter API does not support provider routing preferences.
	 * This method is kept for backwards compatibility but is not used.
	 */
	private getProviderPreferences(
		profile: JSONProfile | TextProfile,
		options?: { requireToolSupport?: boolean }
	): any {
		const requireToolSupport = options?.requireToolSupport ?? false;

		// Provider routing configuration based on profile
		let baseConfig: any;

		switch (profile) {
			case 'fast':
			case 'speed':
				baseConfig = {
					order: ['x-ai', 'google', 'openai', 'groq', 'deepseek'],
					allow_fallbacks: true,
					data_collection: 'allow' // Allow for faster routing
					// Note: quantization field removed - not supported by OpenRouter API
				};
				break;

			case 'balanced':
				baseConfig = {
					order: ['openai', 'google', 'deepseek', 'x-ai', 'anthropic'],
					allow_fallbacks: true,
					require_parameters: true, // Require providers to support our parameters
					data_collection: 'deny' // Privacy focused
				};
				break;

			case 'powerful':
			case 'quality':
				baseConfig = {
					order: ['anthropic', 'openai', 'x-ai', 'google', 'deepseek'],
					allow_fallbacks: true,
					require_parameters: true,
					data_collection: 'deny'
					// Exclude certain providers for quality
					// exclude: ['groq', 'together']
				};
				break;

			case 'maximum':
			case 'creative':
				baseConfig = {
					order: ['anthropic', 'openai'],
					allow_fallbacks: false, // Only use premium providers
					require_parameters: true,
					data_collection: 'deny'
				};
				break;

			default:
				baseConfig = {
					allow_fallbacks: true,
					data_collection: 'deny'
				};
		}

		return requireToolSupport ? this.enforceToolSafeProviderPrefs(baseConfig) : baseConfig;
	}

	/**
	 * @deprecated OpenRouter API does not support provider routing preferences.
	 * This method is kept for backwards compatibility but is not used.
	 */
	private enforceToolSafeProviderPrefs(config: any): any {
		const enriched = { ...config };

		enriched.require_parameters = true;
		enriched.allow_fallbacks = enriched.allow_fallbacks ?? true;

		const priorityOrder = ['openai', 'deepseek', 'google', 'anthropic', 'x-ai'];
		const existingOrder: string[] = Array.isArray(enriched.order) ? enriched.order : [];

		const reordered = [
			...priorityOrder.filter((provider) => existingOrder.includes(provider)),
			...existingOrder.filter((provider) => !priorityOrder.includes(provider))
		];

		enriched.order = reordered.length > 0 ? reordered : priorityOrder;

		enriched.data_collection = enriched.data_collection ?? 'deny';

		return enriched;
	}

	private ensureToolCompatibleModels(models: string[]): string[] {
		const toolReadyModels = models.filter((model) => TOOL_CALLING_MODEL_SET.has(model));

		if (toolReadyModels.length > 0) {
			return toolReadyModels;
		}

		console.warn(
			'No tool-capable models found in preferred list. Falling back to default tool-calling models.',
			{ requestedModels: models }
		);

		// Use fallback order while keeping values unique
		return Array.from(
			new Set<string>([
				...models.filter((model) => TOOL_CALLING_MODEL_SET.has(model)),
				...TOOL_CALLING_MODEL_ORDER
			])
		);
	}

	// ============================================
	// HELPER METHODS
	// ============================================

	private analyzeComplexity(text: string): 'simple' | 'moderate' | 'complex' {
		const length = text.length;
		const hasNestedStructure = /\[\{|\{\[|":\s*\{|":\s*\[/.test(text);
		const hasComplexLogic = /if|when|decision|analyze|evaluate|extract/i.test(text);
		const hasMultipleSteps = /step \d|first.*then|phase|stage/i.test(text);

		if (length > 8000 || (hasNestedStructure && hasComplexLogic)) return 'complex';
		if (length > 3000 || hasComplexLogic || hasMultipleSteps) return 'moderate';
		return 'simple';
	}

	private selectJSONModels(profile: JSONProfile, complexity: string, requirements?: any): string[] {
		// If custom requirements, calculate best models
		if (profile === 'custom' && requirements) {
			return this.selectModelsByRequirements(JSON_MODELS, requirements, 'json');
		}

		// Validate profile and provide fallback
		const profileModels = JSON_PROFILE_MODELS[profile];
		if (!profileModels || !Array.isArray(profileModels)) {
			console.warn(`Invalid JSON profile: ${profile}, falling back to balanced`);
			return [...JSON_PROFILE_MODELS.balanced];
		}

		// Get base models for profile
		let models = [...profileModels];

		// Adjust based on complexity
		if (complexity === 'complex' && profile === 'fast') {
			// Upgrade to balanced for complex tasks
			models = [...JSON_PROFILE_MODELS.balanced];
		} else if (complexity === 'simple' && profile === 'powerful') {
			// Can use faster models for simple tasks
			models = ['deepseek/deepseek-chat', ...models];
		}

		return models;
	}

	private selectTextModels(
		profile: TextProfile,
		estimatedLength: number,
		requirements?: any
	): string[] {
		// If custom requirements, calculate best models
		if (profile === 'custom' && requirements) {
			return this.selectModelsByRequirements(TEXT_MODELS, requirements, 'text');
		}

		// Validate profile and provide fallback
		const profileModels = TEXT_PROFILE_MODELS[profile];
		if (!profileModels || !Array.isArray(profileModels)) {
			console.warn(`Invalid text profile: ${profile}, falling back to balanced`);
			return [...TEXT_PROFILE_MODELS.balanced];
		}

		// Get base models for profile
		let models = [...profileModels];

		// Adjust based on length
		if (estimatedLength > 3000 && profile === 'speed') {
			// Need more capable models for long content
			models = [...TEXT_PROFILE_MODELS.balanced];
		} else if (estimatedLength < 500 && profile === 'quality') {
			// Can use faster models for short content
			models = ['deepseek/deepseek-chat', ...models];
		}

		return models;
	}

	private selectModelsByRequirements(
		modelPool: Record<string, ModelProfile>,
		requirements: any,
		type: 'json' | 'text'
	): string[] {
		const models = Object.values(modelPool);

		// Filter by requirements
		let eligible = models.filter((model) => {
			if (requirements.maxCost && model.cost > requirements.maxCost) return false;
			if (requirements.minAccuracy && model.smartness < requirements.minAccuracy) return false;
			if (requirements.minQuality && model.smartness < requirements.minQuality) return false;
			return true;
		});

		// Calculate value score for each model
		const scored = eligible.map((model) => {
			let score: number;

			if (type === 'json') {
				// For JSON: prioritize accuracy and speed
				score = (model.smartness * 2 + model.speed) / model.cost;
			} else {
				// For text: balance all factors
				const creativity = model.creativity || model.smartness;
				score = (model.smartness + model.speed + creativity) / model.cost;
			}

			return { model, score };
		});

		// Sort by score and return top 3
		scored.sort((a, b) => b.score - a.score);
		return scored.slice(0, 3).map((s) => s.model.id);
	}

	private supportsJsonMode(modelId: string): boolean {
		// Models that support native JSON mode (response_format: { type: 'json_object' })
		const jsonModeModels = [
			'openai/gpt-4o',
			'openai/gpt-4o-mini',
			'deepseek/deepseek-chat',
			'deepseek/deepseek-reasoner',
			'qwen/qwen-2.5-72b-instruct',
			'google/gemini-1.5-flash', // Updated from gemini-flash-1.5
			'google/gemini-flash-1.5-8b',
			'google/gemini-2.0-flash-001',
			'google/gemini-2.5-flash-lite',
			'x-ai/grok-4-fast',
			'x-ai/grok-4-fast:free',
			'x-ai/grok-code-fast-1',
			'z-ai/glm-4.6'
		];

		return jsonModeModels.includes(modelId);
	}

	private enhanceSystemPromptForJSON(originalPrompt: string): string {
		const jsonInstructions = `
You must respond with valid JSON only. Follow these rules:
1. Output ONLY valid JSON - no text before or after
2. Ensure all strings are properly escaped
3. Use null for missing values, not undefined
4. Numbers should not be quoted unless they're meant to be strings
5. Boolean values should be true/false (lowercase, not quoted)
6. CRITICAL: NO trailing commas after the last item in objects or arrays

`;
		return jsonInstructions + originalPrompt;
	}

	private cleanJSONResponse(raw: string): string {
		// Remove markdown code blocks if present
		let cleaned = raw.trim();
		if (cleaned.startsWith('```json')) {
			cleaned = cleaned.slice(7);
		}
		if (cleaned.startsWith('```')) {
			cleaned = cleaned.slice(3);
		}
		if (cleaned.endsWith('```')) {
			cleaned = cleaned.slice(0, -3);
		}

		// Remove any non-JSON prefix
		const jsonStart = cleaned.indexOf('{');
		if (jsonStart > 0) {
			cleaned = cleaned.slice(jsonStart);
		}

		// Remove any non-JSON suffix
		const jsonEnd = cleaned.lastIndexOf('}');
		if (jsonEnd > -1 && jsonEnd < cleaned.length - 1) {
			cleaned = cleaned.slice(0, jsonEnd + 1);
		}

		// Fix common LLM JSON errors
		// Remove trailing commas before closing braces/brackets (e.g., {key: "value",} -> {key: "value"})
		cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

		return cleaned.trim();
	}

	private estimateResponseLength(prompt: string): number {
		// Simple heuristic based on prompt length
		const promptLength = prompt.length;

		if (promptLength < 200) return 500;
		if (promptLength < 1000) return 1500;
		if (promptLength < 5000) return 3000;
		return 5000;
	}

	private trackPerformance(model: string, duration: number): void {
		const history = this.performanceMetrics.get(model) || [];
		history.push(duration);

		// Keep last 20 measurements
		if (history.length > 20) {
			history.shift();
		}

		this.performanceMetrics.set(model, history);
	}

	private trackCost(model: string, usage?: any): void {
		if (!usage) return;

		const modelConfig = JSON_MODELS[model] || TEXT_MODELS[model];
		if (!modelConfig) return;

		const inputCost = ((usage.prompt_tokens || 0) / 1_000_000) * modelConfig.cost;
		const outputCost = ((usage.completion_tokens || 0) / 1_000_000) * modelConfig.outputCost;
		const totalCost = inputCost + outputCost;

		const current = this.costTracking.get(model) || 0;
		this.costTracking.set(model, current + totalCost);
	}

	private calculateCost(model: string, usage?: any): string {
		if (!usage) return 'N/A';

		const modelConfig = JSON_MODELS[model] || TEXT_MODELS[model];
		if (!modelConfig) return 'Unknown';

		const inputCost = ((usage.prompt_tokens || 0) / 1_000_000) * modelConfig.cost;
		const outputCost = ((usage.completion_tokens || 0) / 1_000_000) * modelConfig.outputCost;
		const totalCost = inputCost + outputCost;

		return `$${totalCost.toFixed(6)}`;
	}

	// ============================================
	// REPORTING METHODS
	// ============================================

	getPerformanceReport(): Map<
		string,
		{
			avg: number;
			min: number;
			max: number;
			count: number;
		}
	> {
		const report = new Map();

		this.performanceMetrics.forEach((history, model) => {
			if (history.length === 0) return;

			report.set(model, {
				avg: history.reduce((a, b) => a + b, 0) / history.length,
				min: Math.min(...history),
				max: Math.max(...history),
				count: history.length
			});
		});

		return report;
	}

	getCostReport(): { byModel: Map<string, number>; total: number } {
		let total = 0;
		this.costTracking.forEach((cost) => (total += cost));

		return {
			byModel: new Map(this.costTracking),
			total
		};
	}

	// ============================================
	// EMBEDDING METHODS
	// ============================================

	/**
	 * Generate embeddings using OpenAI API
	 * Note: This requires a separate OpenAI API key as OpenRouter doesn't support embeddings
	 */
	async generateEmbedding(text: string, openAIApiKey: string): Promise<number[]> {
		const response = await fetch('https://api.openai.com/v1/embeddings', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${openAIApiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'text-embedding-3-small',
				input: text
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenAI Embedding API error: ${response.status} - ${error}`);
		}

		const result = await response.json();
		return result.data[0].embedding;
	}

	/**
	 * Generate multiple embeddings using OpenAI API
	 */
	async generateEmbeddings(texts: string[], openAIApiKey: string): Promise<number[][]> {
		const response = await fetch('https://api.openai.com/v1/embeddings', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${openAIApiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'text-embedding-3-small',
				input: texts
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`OpenAI Embedding API error: ${response.status} - ${error}`);
		}

		const result = await response.json();
		return result.data.map((d: any) => d.embedding);
	}

	// ============================================
	// STATIC HELPER FOR QUICK PROFILE SELECTION
	// ============================================

	static selectProfile(context: {
		taskCount?: number;
		complexity?: 'simple' | 'moderate' | 'complex';
		priority?: 'speed' | 'quality' | 'cost';
		isProduction?: boolean;
	}): { json: JSONProfile; text: TextProfile } {
		const {
			taskCount = 5,
			complexity = 'moderate',
			priority = 'cost',
			isProduction = true
		} = context;

		// JSON profile selection
		let jsonProfile: JSONProfile = 'balanced';
		if (priority === 'speed' && complexity === 'simple') {
			jsonProfile = 'fast';
		} else if (priority === 'quality' || complexity === 'complex') {
			jsonProfile = isProduction ? 'powerful' : 'balanced';
		} else if (taskCount > 20) {
			jsonProfile = 'balanced'; // DeepSeek handles scale well
		}

		// Text profile selection
		let textProfile: TextProfile = 'balanced';
		if (priority === 'speed') {
			textProfile = 'speed';
		} else if (priority === 'quality') {
			textProfile = isProduction ? 'quality' : 'balanced';
		}

		return { json: jsonProfile, text: textProfile };
	}

	// ============================================
	// STREAMING TEXT METHOD FOR CHAT
	// ============================================

	/**
	 * Stream text responses for chat system with tool support
	 * Returns an async generator for real-time streaming
	 */
	async *streamText(options: {
		messages: Array<{
			role: string;
			content: string;
			tool_calls?: any[];
			tool_call_id?: string;
		}>;
		tools?: any[];
		tool_choice?: 'auto' | 'none' | 'required';
		userId: string;
		profile?: TextProfile;
		temperature?: number;
		maxTokens?: number;
		sessionId?: string;
		messageId?: string;
	}): AsyncGenerator<{
		type: 'text' | 'tool_call' | 'done' | 'error';
		content?: string;
		tool_call?: any;
		usage?: any;
		error?: string;
		finished_reason?: string;
	}> {
		const requestStartedAt = new Date();
		const startTime = performance.now();
		const profile = options.profile || 'speed'; // Default to speed for chat

		const needsToolSupport = Array.isArray(options.tools) && options.tools.length > 0;

		// Estimate total input length from all messages
		const totalInputLength = options.messages.reduce(
			(sum, msg) => sum + (msg.content?.length || 0),
			0
		);
		const estimatedLength = this.estimateResponseLength(
			totalInputLength > 0 ? 'x'.repeat(totalInputLength) : 'default chat message'
		);

		// Select models optimized for chat streaming
		let preferredModels = this.selectTextModels(
			profile,
			estimatedLength,
			{ maxLatency: 2000 } // Fast response for chat
		);

		if (needsToolSupport) {
			preferredModels = this.ensureToolCompatibleModels(preferredModels);
		}

		try {
			// Build request with streaming enabled following OpenRouter API v1 spec
			const headers = {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': this.httpReferer,
				'X-Title': this.appName
			};

			const body: any = {
				model: preferredModels[0],
				messages: options.messages,
				temperature: options.temperature ?? 0.7,
				max_tokens: options.maxTokens ?? 2000,
				stream: true
			};

			// Add fallback models using extra_body if we have multiple models
			if (preferredModels.length > 1) {
				body.extra_body = {
					models: preferredModels.slice(1)
				};
			}

			// Add tools if provided
			if (needsToolSupport) {
				body.tools = options.tools;
				body.tool_choice = options.tool_choice || 'auto';
			}

			// Make streaming request
			const response = await fetch(this.apiUrl, {
				method: 'POST',
				headers,
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				const error = await response.text();
				yield {
					type: 'error',
					error: `OpenRouter API error: ${response.status} - ${error}`
				};
				return;
			}

			// Process SSE stream
			const reader = response.body?.getReader();
			if (!reader) {
				yield {
					type: 'error',
					error: 'No response stream available'
				};
				return;
			}

			const decoder = new TextDecoder();
			let buffer = '';
			let accumulatedContent = '';
			let currentToolCall: any = null;
			let usage: any = null;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (!line.trim() || !line.startsWith('data: ')) continue;

					const data = line.slice(6); // Remove 'data: ' prefix
					if (data === '[DONE]') {
						// Stream completed
						const duration = performance.now() - startTime;
						const requestCompletedAt = new Date();

						// Yield any pending tool call that wasn't completed
						// This can happen if the stream ends without a finish_reason
						if (currentToolCall && currentToolCall.function.name) {
							// Try to parse incomplete arguments as valid JSON, or use empty object
							if (!this.isCompleteJSON(currentToolCall.function.arguments)) {
								// Try to fix common incomplete JSON patterns
								let fixedArgs = currentToolCall.function.arguments;
								if (fixedArgs && !fixedArgs.endsWith('}')) {
									// Attempt to close incomplete JSON
									fixedArgs = fixedArgs.replace(/,\s*$/, '') + '}';
								}
								if (this.isCompleteJSON(fixedArgs)) {
									currentToolCall.function.arguments = fixedArgs;
								} else {
									// Fall back to empty object if we can't fix it
									console.warn(
										'Tool call arguments incomplete at stream end:',
										currentToolCall.function.arguments
									);
									currentToolCall.function.arguments = '{}';
								}
							}
							yield {
								type: 'tool_call',
								tool_call: currentToolCall
							};
							currentToolCall = null;
						}

						// Log usage if available
						if (usage) {
							const actualModel = preferredModels[0] || 'openai/gpt-4o-mini';
							const modelConfig = TEXT_MODELS[actualModel];
							const inputCost = modelConfig
								? ((usage.prompt_tokens || 0) / 1_000_000) * modelConfig.cost
								: 0;
							const outputCost = modelConfig
								? ((usage.completion_tokens || 0) / 1_000_000) * modelConfig.outputCost
								: 0;

							// Log to database (async, non-blocking)
							this.logUsageToDatabase({
								userId: options.userId,
								operationType: 'chat_stream',
								modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
								modelUsed: actualModel,
								provider: modelConfig?.provider,
								promptTokens: usage.prompt_tokens || 0,
								completionTokens: usage.completion_tokens || 0,
								totalTokens: usage.total_tokens || 0,
								inputCost,
								outputCost,
								totalCost: inputCost + outputCost,
								responseTimeMs: Math.round(duration),
								requestStartedAt,
								requestCompletedAt,
								status: 'success',
								temperature: options.temperature,
								maxTokens: options.maxTokens,
								profile,
								streaming: true,
								metadata: {
									sessionId: options.sessionId,
									messageId: options.messageId,
									hasTools: !!options.tools
								}
							}).catch((err) => console.error('Failed to log usage:', err));
						}

						yield {
							type: 'done',
							usage,
							finished_reason: 'stop'
						};
						break;
					}

					try {
						const chunk = JSON.parse(data);

						// Handle different chunk types
						if (chunk.choices && chunk.choices[0]) {
							const choice = chunk.choices[0];
							const delta = choice.delta;

							if (delta.content) {
								// Filter out invisible padding characters that some models (like DeepSeek) emit
								// U+3164 (ㅤ) = Hangul Filler - often used as invisible thinking/padding
								// U+200B = Zero Width Space
								// U+FEFF = Zero Width No-Break Space (BOM)
								// U+00A0 repeated = Non-breaking spaces used as padding
								const filteredContent = delta.content
									.replace(/[\u3164\u200B\uFEFF]+/g, '')
									.replace(/\u00A0{3,}/g, ' '); // Collapse multiple NBSPs to single space

								if (filteredContent) {
									// Text content
									accumulatedContent += filteredContent;
									yield {
										type: 'text',
										content: filteredContent
									};
								}
							}

							if (delta.tool_calls && delta.tool_calls[0]) {
								// Tool call
								const toolCallDelta = delta.tool_calls[0];

								if (!currentToolCall) {
									currentToolCall = {
										id: toolCallDelta.id,
										type: 'function',
										function: {
											name: toolCallDelta.function?.name || '',
											arguments: ''
										}
									};
								}

								if (toolCallDelta.function?.arguments) {
									currentToolCall.function.arguments += toolCallDelta.function.arguments;
								}

								// Check if tool call is complete
								if (
									choice.finish_reason === 'tool_calls' ||
									(currentToolCall.function.name &&
										currentToolCall.function.arguments &&
										this.isCompleteJSON(currentToolCall.function.arguments))
								) {
									yield {
										type: 'tool_call',
										tool_call: currentToolCall
									};
									currentToolCall = null;
								}
							}

							// Track usage
							if (chunk.usage) {
								usage = chunk.usage;
							}
						}
					} catch (parseError) {
						console.error('Failed to parse SSE chunk:', parseError);
						// Continue processing other chunks
					}
				}
			}
		} catch (error) {
			const duration = performance.now() - startTime;
			const requestCompletedAt = new Date();

			console.error('Streaming failed:', error);

			// Log error
			if (this.errorLogger?.logAPIError) {
				await this.errorLogger.logAPIError(error, this.apiUrl, 'POST', options.userId, {
					operation: 'streamText',
					errorType: 'llm_streaming_failure',
					sessionId: options.sessionId,
					messageId: options.messageId
				});
			}

			// Log failure
			this.logUsageToDatabase({
				userId: options.userId,
				operationType: 'chat_stream',
				modelRequested: preferredModels[0] || 'openai/gpt-4o-mini',
				modelUsed: preferredModels[0] || 'openai/gpt-4o-mini',
				promptTokens: 0,
				completionTokens: 0,
				totalTokens: 0,
				inputCost: 0,
				outputCost: 0,
				totalCost: 0,
				responseTimeMs: Math.round(duration),
				requestStartedAt,
				requestCompletedAt,
				status: 'failure',
				errorMessage: (error as Error).message,
				temperature: options.temperature,
				maxTokens: options.maxTokens,
				profile,
				streaming: true,
				metadata: {
					sessionId: options.sessionId,
					messageId: options.messageId
				}
			}).catch((err) => console.error('Failed to log error:', err));

			yield {
				type: 'error',
				error: `Stream failed: ${(error as Error).message}`
			};
		}
	}

	/**
	 * Check if a string is complete valid JSON
	 */
	private isCompleteJSON(str: string): boolean {
		try {
			JSON.parse(str);
			return true;
		} catch {
			return false;
		}
	}
}
