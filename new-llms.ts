// packages/smart-llm/src/model-config.ts

import type { JSONProfile, ModelProfile, TextProfile } from './types';

export const JSON_MODELS: Record<string, ModelProfile> = {
	// ============================================
	// Ultra-fast tier (1-2s) - Budget options
	// Updated: 2026-01-15 based on OpenRouter pricing
	// ============================================
	'google/gemini-2.5-flash-lite': {
		id: 'google/gemini-2.5-flash-lite',
		name: 'Gemini 2.5 Flash Lite',
		speed: 4.5,
		smartness: 4.2,
		cost: 0.1,
		outputCost: 0.4,
		provider: 'google',
		bestFor: ['ultra-fast', 'json-mode', 'classification', 'autocomplete', 'ultra-low-cost'],
		limitations: ['reasoning-disabled-by-default']
	},
	'qwen/qwen3-32b': {
		id: 'qwen/qwen3-32b',
		name: 'Qwen 3 32B',
		speed: 4,
		smartness: 4.5,
		cost: 0.08,
		outputCost: 0.24,
		provider: 'qwen',
		bestFor: ['best-value', 'structured-output', 'multilingual', 'coding', 'tool-calling'],
		limitations: []
	},
	// ============================================
	// Fast tier (2-3s) - Good value options
	// ============================================
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
	'x-ai/grok-4.1-fast': {
		id: 'x-ai/grok-4.1-fast',
		name: 'Grok 4.1 Fast',
		speed: 4.5,
		smartness: 4.5,
		cost: 0.2,
		outputCost: 0.5,
		provider: 'x-ai',
		bestFor: [
			'tool-calling',
			'json-mode',
			'agentic-workflows',
			'2m-context',
			'tau2-bench-100%'
		],
		limitations: []
	},
	'google/gemini-2.5-flash': {
		id: 'google/gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		speed: 4.5,
		smartness: 4.5,
		cost: 0.3,
		outputCost: 2.5,
		provider: 'google',
		bestFor: ['hybrid-reasoning', 'json-mode', 'structured-output', 'thinking-model'],
		limitations: ['thinking-tokens-expensive', 'deprecated-june-2026']
	},
	'deepseek/deepseek-chat': {
		id: 'deepseek/deepseek-chat',
		name: 'DeepSeek Chat V3',
		speed: 3.5,
		smartness: 4.5,
		cost: 0.27,
		outputCost: 1.1,
		provider: 'deepseek',
		bestFor: ['complex-json', 'instruction-following', 'nested-structures', 'best-value'],
		limitations: []
	},
	'minimax/minimax-m2.1': {
		id: 'minimax/minimax-m2.1',
		name: 'MiniMax M2.1',
		speed: 3.5,
		smartness: 4.6,
		cost: 0.27,
		outputCost: 1.12,
		provider: 'minimax',
		bestFor: [
			'agentic-workflows',
			'tool-calling',
			'coding',
			'swe-bench-multilingual-72.5%',
			'tau-bench-87%'
		],
		limitations: ['verbose-output', 'requires-reasoning-tokens']
	},
	'z-ai/glm-4.7': {
		id: 'z-ai/glm-4.7',
		name: 'GLM 4.7',
		speed: 3.5,
		smartness: 4.6,
		cost: 0.4,
		outputCost: 1.5,
		provider: 'z-ai',
		bestFor: [
			'coding',
			'long-context',
			'reasoning',
			'structured-output',
			'terminal-bench-90%+'
		],
		limitations: []
	},

	// ============================================
	// Balanced tier (3-4s) - Quality + Speed
	// ============================================
	'anthropic/claude-haiku-4.5': {
		id: 'anthropic/claude-haiku-4.5',
		name: 'Claude Haiku 4.5',
		speed: 4.5,
		smartness: 4.3,
		cost: 1.0,
		outputCost: 5.0,
		provider: 'anthropic',
		bestFor: [
			'fast-json',
			'excellent-tool-calling',
			'parallel-tools',
			'agent-chat',
			'extended-thinking'
		],
		limitations: ['no-native-json-mode']
	},

	// ============================================
	// Powerful tier (4-5s) - High quality
	// ============================================
	'anthropic/claude-sonnet-4': {
		id: 'anthropic/claude-sonnet-4',
		name: 'Claude Sonnet 4',
		speed: 2.5,
		smartness: 4.8,
		cost: 3.0,
		outputCost: 15.0,
		provider: 'anthropic',
		bestFor: ['complex-reasoning', 'nuanced-instructions', 'tool-calling-92%', '1m-context'],
		limitations: ['no-native-json-mode']
	},
	'deepseek/deepseek-r1': {
		id: 'deepseek/deepseek-r1',
		name: 'DeepSeek R1',
		speed: 3.5,
		smartness: 4.9,
		cost: 0.55,
		outputCost: 1.68,
		provider: 'deepseek',
		bestFor: ['complex-reasoning', 'math', 'coding', 'tool-calling', 'best-reasoning-value'],
		limitations: ['slower-than-chat', 'verbose-output']
	},
	'moonshotai/kimi-k2.5': {
		id: 'moonshotai/kimi-k2.5',
		name: 'Kimi K2.5',
		speed: 3.5,
		smartness: 4.9,
		cost: 0.6,
		outputCost: 0.3,
		provider: 'moonshotai',
		bestFor: [
			'agentic-workflows',
			'visual-coding',
			'multimodal',
			'agent-swarm-100-agents',
			'1500-parallel-tool-calls',
			'office-productivity',
			'262k-context',
			'cost-effective-reasoning'
		],
		limitations: []
	},
	'moonshotai/kimi-k2-thinking': {
		id: 'moonshotai/kimi-k2-thinking',
		name: 'Kimi K2 Thinking',
		speed: 2.5,
		smartness: 4.9,
		cost: 0.57,
		outputCost: 2.42,
		provider: 'moonshotai',
		bestFor: [
			'agentic-workflows',
			'tau2-bench-93%',
			'intelligence-index-67',
			'multi-tool-200-300-calls',
			'256k-context',
			'agentic-index-rank-2'
		],
		limitations: [
			'mandatory-reasoning-tokens',
			'verbose-2.5x-tokens',
			'slower-for-simple-tasks',
			'deprecated-replaced-by-k2.5'
		]
	},
	'openai/gpt-4o': {
		id: 'openai/gpt-4o',
		name: 'GPT-4o',
		speed: 2.5,
		smartness: 4.5,
		cost: 2.5,
		outputCost: 10.0,
		provider: 'openai',
		bestFor: ['json-mode', 'general-purpose', 'reliable-fallback', '128k-context'],
		limitations: []
	},

	// ============================================
	// Maximum tier (5-7s) - Best quality
	// ============================================
	'anthropic/claude-sonnet-4.5': {
		id: 'anthropic/claude-sonnet-4.5',
		name: 'Claude Sonnet 4.5',
		speed: 2,
		smartness: 4.9,
		cost: 3.0,
		outputCost: 15.0,
		provider: 'anthropic',
		bestFor: ['extended-thinking', 'osworld-61.4%', 'complex-reasoning', 'nuanced-tasks'],
		limitations: ['no-native-json-mode']
	},
	'anthropic/claude-opus-4.5': {
		id: 'anthropic/claude-opus-4.5',
		name: 'Claude Opus 4.5',
		speed: 1.5,
		smartness: 5.0,
		cost: 5.0,
		outputCost: 25.0,
		provider: 'anthropic',
		bestFor: [
			'best-coding-swe-bench-80.9%',
			'agents',
			'computer-use',
			'deep-research',
			'complex-reasoning'
		],
		limitations: ['no-native-json-mode', 'expensive']
	}
};

export const TEXT_MODELS: Record<string, ModelProfile> = {
	// ============================================
	// Ultra-speed tier (<1s) - Budget options
	// Updated: 2026-01-15 based on OpenRouter pricing
	// ============================================
	'google/gemini-2.5-flash-lite': {
		id: 'google/gemini-2.5-flash-lite',
		name: 'Gemini 2.5 Flash Lite',
		speed: 4.5,
		smartness: 4.2,
		creativity: 4,
		cost: 0.1,
		outputCost: 0.4,
		provider: 'google',
		bestFor: ['ultra-low-latency', 'lightweight-reasoning', 'cost-efficient'],
		limitations: []
	},
	'qwen/qwen3-32b': {
		id: 'qwen/qwen3-32b',
		name: 'Qwen 3 32B',
		speed: 4,
		smartness: 4.5,
		creativity: 4.3,
		cost: 0.08,
		outputCost: 0.24,
		provider: 'qwen',
		bestFor: ['best-value', 'multilingual', 'coding', 'tool-calling', 'creative-writing']
	},
	// ============================================
	// Fast tier (1-2s) - Good value options
	// ============================================
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
	'x-ai/grok-4.1-fast': {
		id: 'x-ai/grok-4.1-fast',
		name: 'Grok 4.1 Fast',
		speed: 4.5,
		smartness: 4.5,
		creativity: 4.2,
		cost: 0.2,
		outputCost: 0.5,
		provider: 'x-ai',
		bestFor: ['tool-calling', 'agentic-workflows', '2m-context', 'tau2-bench-100%']
	},
	'deepseek/deepseek-chat': {
		id: 'deepseek/deepseek-chat',
		name: 'DeepSeek Chat V3',
		speed: 3.5,
		smartness: 4.5,
		creativity: 4,
		cost: 0.27,
		outputCost: 1.1,
		provider: 'deepseek',
		bestFor: ['briefs', 'reports', 'structured-content', 'best-value']
	},
	'minimax/minimax-m2.1': {
		id: 'minimax/minimax-m2.1',
		name: 'MiniMax M2.1',
		speed: 3.5,
		smartness: 4.6,
		creativity: 4.3,
		cost: 0.27,
		outputCost: 1.12,
		provider: 'minimax',
		bestFor: ['agentic-workflows', 'tool-calling', 'coding', 'swe-bench-multilingual-72.5%'],
		limitations: ['verbose-output', 'requires-reasoning-tokens']
	},
	'google/gemini-2.5-flash': {
		id: 'google/gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		speed: 4.5,
		smartness: 4.5,
		creativity: 4.3,
		cost: 0.3,
		outputCost: 2.5,
		provider: 'google',
		bestFor: ['hybrid-reasoning', 'thinking-model', 'fast-quality', 'multimodal'],
		limitations: ['deprecated-june-2026']
	},
	'z-ai/glm-4.7': {
		id: 'z-ai/glm-4.7',
		name: 'GLM 4.7',
		speed: 3.5,
		smartness: 4.6,
		creativity: 4.4,
		cost: 0.4,
		outputCost: 1.5,
		provider: 'z-ai',
		bestFor: ['coding', 'long-content', 'reasoning', 'refined-writing', 'terminal-bench-90%+']
	},

	// ============================================
	// Balanced tier (2-3s) - Quality + Speed
	// ============================================
	'anthropic/claude-haiku-4.5': {
		id: 'anthropic/claude-haiku-4.5',
		name: 'Claude Haiku 4.5',
		speed: 4.5,
		smartness: 4.3,
		creativity: 4.2,
		cost: 1.0,
		outputCost: 5.0,
		provider: 'anthropic',
		bestFor: [
			'fast-generation',
			'excellent-tool-calling',
			'agent-chat',
			'briefs',
			'extended-thinking'
		]
	},

	// ============================================
	// Quality tier (3-5s) - High quality
	// ============================================
	'deepseek/deepseek-r1': {
		id: 'deepseek/deepseek-r1',
		name: 'DeepSeek R1',
		speed: 3.5,
		smartness: 4.9,
		creativity: 4.4,
		cost: 0.55,
		outputCost: 1.68,
		provider: 'deepseek',
		bestFor: ['reasoning', 'analysis', 'technical-writing', 'complex-content', 'coding']
	},
	'moonshotai/kimi-k2.5': {
		id: 'moonshotai/kimi-k2.5',
		name: 'Kimi K2.5',
		speed: 3.5,
		smartness: 4.9,
		creativity: 4.6,
		cost: 0.6,
		outputCost: 0.3,
		provider: 'moonshotai',
		bestFor: [
			'agentic-workflows',
			'visual-coding',
			'multimodal',
			'agent-swarm-100-agents',
			'office-productivity',
			'research-workflows',
			'1500-parallel-tool-calls',
			'262k-context',
			'cost-effective-reasoning'
		],
		limitations: []
	},
	'moonshotai/kimi-k2-thinking': {
		id: 'moonshotai/kimi-k2-thinking',
		name: 'Kimi K2 Thinking',
		speed: 2.5,
		smartness: 4.9,
		creativity: 4.5,
		cost: 0.57,
		outputCost: 2.42,
		provider: 'moonshotai',
		bestFor: [
			'agentic-reasoning',
			'tau2-bench-93%',
			'intelligence-index-67',
			'research-workflows',
			'multi-tool-200-300-calls',
			'256k-context'
		],
		limitations: [
			'mandatory-reasoning-tokens',
			'verbose-2.5x-tokens',
			'slower-for-simple-tasks',
			'deprecated-replaced-by-k2.5'
		]
	},
	'openai/gpt-4o': {
		id: 'openai/gpt-4o',
		name: 'GPT-4o',
		speed: 2.5,
		smartness: 4.5,
		creativity: 4.5,
		cost: 2.5,
		outputCost: 10.0,
		provider: 'openai',
		bestFor: ['general-purpose', 'reliable-fallback', 'multimodal', '128k-context']
	},
	'anthropic/claude-sonnet-4': {
		id: 'anthropic/claude-sonnet-4',
		name: 'Claude Sonnet 4',
		speed: 2.5,
		smartness: 4.8,
		creativity: 4.6,
		cost: 3.0,
		outputCost: 15.0,
		provider: 'anthropic',
		bestFor: ['high-quality-writing', 'complex-content', 'nuanced-text', 'tool-calling']
	},

	// ============================================
	// Maximum tier - Best quality
	// ============================================
	'anthropic/claude-sonnet-4.5': {
		id: 'anthropic/claude-sonnet-4.5',
		name: 'Claude Sonnet 4.5',
		speed: 2,
		smartness: 4.9,
		creativity: 4.7,
		cost: 3.0,
		outputCost: 15.0,
		provider: 'anthropic',
		bestFor: ['extended-thinking', 'complex-reasoning', 'creative-writing', 'osworld-61.4%']
	},
	'anthropic/claude-opus-4.5': {
		id: 'anthropic/claude-opus-4.5',
		name: 'Claude Opus 4.5',
		speed: 1.5,
		smartness: 5.0,
		creativity: 4.8,
		cost: 5.0,
		outputCost: 25.0,
		provider: 'anthropic',
		bestFor: ['best-coding-swe-bench-80.9%', 'agents', 'computer-use', 'deep-research'],
		limitations: ['expensive']
	}
};

// Models that have reliable tool-calling support when routed through OpenRouter.
// The order doubles as our fallback priority list whenever we must guarantee tool support.
// Updated 2026-01-15 based on latest benchmark data (τ²-Bench, SWE-bench, tool-calling success rates)
// Priority: Highest reliability first, then cost-effectiveness as tiebreaker
export const TOOL_CALLING_MODEL_ORDER = [
	'x-ai/grok-4.1-fast', // Best τ²-Bench: 100% (xAI claim), 2M context, optimized for agents: $0.20/$0.50
	'moonshotai/kimi-k2.5', // Superior agentic: agent swarm, 1500 parallel tools, 262K ctx, multimodal: $0.60/$0.30
	'moonshotai/kimi-k2-thinking', // τ²-Bench: 93% (legacy), 256K ctx, 200-300 tool calls: $0.57/$2.42
	'anthropic/claude-opus-4.5', // Best coding: 80.9% SWE-bench, agents, computer-use: $5/$25
	'anthropic/claude-haiku-4.5', // Fast + reliable: parallel tool calls, extended thinking: $1/$5
	'openai/gpt-4o-mini', // Very good: 88% success rate, fast + cheap: $0.15/$0.60
	'openai/gpt-4o', // Strong: 87%+ success rate: $2.50/$10
	'minimax/minimax-m2.1', // Excellent agentic: 87% τ²-Bench, 72.5% SWE-bench-multilingual: $0.27/$1.12
	'qwen/qwen3-32b', // Best value: excellent multilingual, good tool-calling: $0.08/$0.24
	'deepseek/deepseek-r1', // Good reasoning, slower: $0.55/$1.68
	'deepseek/deepseek-chat', // Good for sequential tasks: $0.27/$1.10
	'z-ai/glm-4.7', // Good tool use, strong coding, terminal-bench 90%+: $0.40/$1.50
	'google/gemini-2.5-flash' // Hybrid reasoning model (deprecated June 2026): $0.30/$2.50
] as const;
export const TOOL_CALLING_MODEL_SET = new Set<string>(TOOL_CALLING_MODEL_ORDER);

export const EMPTY_CONTENT_RETRY_INSTRUCTION =
	'Return only the final answer. Do not include analysis or reasoning.';
export const EMPTY_CONTENT_RETRY_MIN_TOKENS = 1200;
export const EMPTY_CONTENT_RETRY_BUFFER_TOKENS = 256;
export const EMPTY_CONTENT_RETRY_MAX_TOKENS = 2048;
export const EMERGENCY_TEXT_FALLBACKS = [
	'openai/gpt-4o-mini',
	'anthropic/claude-haiku-4.5',
	'openai/gpt-4o'
] as const;

// ============================================
// PROFILE MAPPINGS
// ============================================

export const JSON_PROFILE_MODELS: Record<JSONProfile, string[]> = {
	fast: [
		'google/gemini-2.5-flash-lite', // Ultra-fast + ultra-low cost: $0.10/$0.40
		'qwen/qwen3-32b', // Best value + good JSON: $0.08/$0.24
		'openai/gpt-4o-mini', // Reliable fallback with JSON mode: $0.15/$0.60
		'deepseek/deepseek-chat' // Native JSON mode + good value: $0.27/$1.10
	],
	balanced: [
		'moonshotai/kimi-k2.5', // Best agentic value: agent swarm, 1500 tools, multimodal: $0.60/$0.30
		'qwen/qwen3-32b', // Best value + native JSON: $0.08/$0.24
		'x-ai/grok-4.1-fast', // Best tool-calling + fast: $0.20/$0.50
		'minimax/minimax-m2.1', // Strong agentic + structured output: 87% τ²-Bench: $0.27/$1.12
		'deepseek/deepseek-chat', // Good value + native JSON: $0.27/$1.10
		'anthropic/claude-haiku-4.5', // Excellent tool calling, extended thinking: $1/$5
		'google/gemini-2.5-flash' // Hybrid reasoning model: $0.30/$2.50
	],
	powerful: [
		'moonshotai/kimi-k2.5', // Best agentic: agent swarm, 262K ctx, multimodal: $0.60/$0.30
		'deepseek/deepseek-r1', // Native JSON + good reasoning: $0.55/$1.68
		'minimax/minimax-m2.1', // Strong agentic: 87% τ²-Bench, 72.5% SWE-bench-multilingual
		'openai/gpt-4o', // Strong general purpose + native JSON: $2.50/$10
		'z-ai/glm-4.7', // Strong coding + native JSON, terminal-bench 90%+: $0.40/$1.50
		'moonshotai/kimi-k2-thinking', // Best agentic (legacy): 93% τ²-Bench, 256K ctx: $0.57/$2.42
		'anthropic/claude-sonnet-4' // Best tool calling ~92%: $3/$15
	],
	maximum: [
		'anthropic/claude-opus-4.5', // Best coding: 80.9% SWE-bench: $5/$25
		'moonshotai/kimi-k2.5', // Best agentic: agent swarm, multimodal, 262K ctx: $0.60/$0.30
		'anthropic/claude-sonnet-4.5', // Best overall: 61.4% OSWorld, extended thinking: $3/$15
		'deepseek/deepseek-r1', // Native JSON + good for pure reasoning: $0.55/$1.68
		'openai/gpt-4o' // Reliable fallback with native JSON: $2.50/$10
	],
	custom: [] // Will be determined by requirements
};

export const TEXT_PROFILE_MODELS: Record<TextProfile, string[]> = {
	speed: [
		'google/gemini-2.5-flash-lite', // Ultra-fast + ultra-low cost: $0.10/$0.40
		'qwen/qwen3-32b', // Best value + fast: $0.08/$0.24
		'openai/gpt-4o-mini', // Reliable fallback: $0.15/$0.60
		'anthropic/claude-haiku-4.5' // Fast with extended thinking: $1/$5
	],
	balanced: [
		'moonshotai/kimi-k2.5', // Best agentic value: agent swarm, multimodal, 262K ctx: $0.60/$0.30
		'x-ai/grok-4.1-fast', // Best tool-calling: 100% τ²-Bench, 2M context: $0.20/$0.50
		'qwen/qwen3-32b', // Best value: $0.08/$0.24, smartness 4.5
		'deepseek/deepseek-chat', // Good value: $0.27/$1.10, smartness 4.5
		'minimax/minimax-m2.1', // Strong agentic, smartness 4.6: $0.27/$1.12
		'anthropic/claude-haiku-4.5', // Good for agents, extended thinking: $1/$5
		'openai/gpt-4o-mini' // Reliable fallback: $0.15/$0.60
	],
	quality: [
		'moonshotai/kimi-k2.5', // Superior agentic: agent swarm, multimodal, 262K ctx: $0.60/$0.30
		'x-ai/grok-4.1-fast', // Best tool-calling: 100% τ²-Bench, 2M context: $0.20/$0.50
		'deepseek/deepseek-r1', // Good reasoning, excellent for technical content: $0.55/$1.68
		'anthropic/claude-haiku-4.5', // Excellent tool-calling, parallel tools: $1/$5
		'minimax/minimax-m2.1', // 87% τ²-Bench, excellent coding: $0.27/$1.12
		'openai/gpt-4o' // Reliable fallback: $2.50/$10
	],
	creative: [
		'anthropic/claude-opus-4.5', // Best creative: highest creativity (4.8): $5/$25
		'anthropic/claude-sonnet-4.5', // Strong creative: creativity 4.7: $3/$15
		'anthropic/claude-sonnet-4', // Strong creative: creativity 4.6: $3/$15
		'openai/gpt-4o', // Good creative: creativity 4.5: $2.50/$10
		'deepseek/deepseek-r1' // Good for creative reasoning: $0.55/$1.68
	],
	custom: []
};
