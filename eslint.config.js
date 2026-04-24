// eslint.config.js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

const browserGlobals = {
	window: 'readonly',
	document: 'readonly',
	navigator: 'readonly',
	console: 'readonly',
	fetch: 'readonly',
	FormData: 'readonly',
	File: 'readonly',
	FileReader: 'readonly',
	Blob: 'readonly',
	URL: 'readonly',
	URLSearchParams: 'readonly',
	CustomEvent: 'readonly',
	Event: 'readonly',
	HTMLElement: 'readonly',
	HTMLInputElement: 'readonly',
	HTMLTextAreaElement: 'readonly',
	HTMLSelectElement: 'readonly',
	HTMLButtonElement: 'readonly',
	MutationObserver: 'readonly',
	setTimeout: 'readonly',
	clearTimeout: 'readonly',
	setInterval: 'readonly',
	clearInterval: 'readonly',
	sessionStorage: 'readonly',
	localStorage: 'readonly',
	crypto: 'readonly'
};

const nodeGlobals = {
	process: 'readonly',
	Buffer: 'readonly',
	__dirname: 'readonly',
	__filename: 'readonly'
};

export default [
	{
		ignores: [
			'.svelte-kit/**',
			'.vercel/**',
			'build/**',
			'node_modules/**',
			'package/**',
			'public/**',
			'static/**',
			'**/*.svelte',
			'logs/**',
			'test-results/**',
			'Freshies12/**',
			'Freshies13/**',
			'youtube-transcript-research/**',
			'youtube-transcripts/**',
			'youtube-transcripts-people/**',
			'database.types.ts',
			'src/lib/components/molecules/famousTypes.ts',
			'src/lib/generated/**'
		]
	},
	js.configs.recommended,
	{
		files: ['**/*.{js,ts}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			parser: tsParser,
			globals: {
				...browserGlobals,
				...nodeGlobals
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-empty': 'off',
			'no-control-regex': 'off',
			'no-useless-escape': 'off',
			'no-dupe-class-members': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-var-requires': 'off'
		}
	},
	{
		files: ['**/*.cjs'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
			globals: nodeGlobals
		},
		rules: {
			'no-undef': 'off'
		}
	},
	prettier
];
