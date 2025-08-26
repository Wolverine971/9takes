// labelFilePaths.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const EXCLUDED_DIRS = [
	'node_modules',
	'.git',
	'.svelte-kit',
	'dist',
	'build',
	'.vercel',
	'.netlify',
	'coverage',
	'.nyc_output',
	'tmp',
	'temp'
];

const EXCLUDED_FILES = [
	'.gitignore',
	'.env',
	'.env.local',
	'.env.example',
	'package-lock.json',
	'pnpm-lock.yaml',
	'yarn.lock'
];

// Comment patterns for different file types
const COMMENT_PATTERNS = {
	// HTML-style comments
	svelte: (filePath: string) => `<!-- ${filePath} -->`,
	html: (filePath: string) => `<!-- ${filePath} -->`,
	xml: (filePath: string) => `<!-- ${filePath} -->`,

	// Single-line comments
	ts: (filePath: string) => `// ${filePath}`,
	js: (filePath: string) => `// ${filePath}`,
	mjs: (filePath: string) => `// ${filePath}`,
	jsx: (filePath: string) => `// ${filePath}`,
	tsx: (filePath: string) => `// ${filePath}`,
	// json: (filePath: string) => `// ${filePath}`,
	jsonc: (filePath: string) => `// ${filePath}`,

	// CSS-style comments
	css: (filePath: string) => `/* ${filePath} */`,
	scss: (filePath: string) => `/* ${filePath} */`,
	sass: (filePath: string) => `/* ${filePath} */`,
	less: (filePath: string) => `/* ${filePath} */`,

	// Python
	py: (filePath: string) => `# ${filePath}`,

	// Shell scripts
	sh: (filePath: string) => `# ${filePath}`,
	bash: (filePath: string) => `# ${filePath}`,

	// SQL
	sql: (filePath: string) => `-- ${filePath}`,

	// YAML
	yml: (filePath: string) => `# ${filePath}`,
	yaml: (filePath: string) => `# ${filePath}`
};

// Regex patterns to detect existing path comments
const EXISTING_COMMENT_PATTERNS = [
	/^<!--\s*.*?\s*-->/, // HTML-style comments
	/^\/\/\s*.*/, // Single-line comments
	/^\/\*\s*.*?\s*\*\//, // CSS-style comments
	/^#\s*.*/, // Hash comments
	/^--\s*.*/ // SQL comments
];

function getFileExtension(filePath: string): string {
	return path.extname(filePath).slice(1).toLowerCase();
}

function getRelativePath(fullPath: string, rootDir: string): string {
	const relativePath = path.relative(rootDir, fullPath);
	// Convert to forward slashes for consistency
	return relativePath.replace(/\\/g, '/');
}

function shouldProcessFile(filePath: string): boolean {
	const fileName = path.basename(filePath);
	const ext = getFileExtension(filePath);

	// Skip excluded files
	if (EXCLUDED_FILES.includes(fileName)) {
		return false;
	}

	// Skip files without extensions or unsupported extensions
	if (!ext || !COMMENT_PATTERNS[ext as keyof typeof COMMENT_PATTERNS]) {
		return false;
	}

	// Skip binary files and images
	const binaryExtensions = [
		'png',
		'jpg',
		'jpeg',
		'gif',
		'ico',
		'svg',
		'pdf',
		'zip',
		'tar',
		'gz',
		'json'
	];
	if (binaryExtensions.includes(ext)) {
		return false;
	}

	return true;
}

function shouldProcessDirectory(dirPath: string): boolean {
	const dirName = path.basename(dirPath);
	return !EXCLUDED_DIRS.includes(dirName) && !dirName.startsWith('.');
}

function hasExistingPathComment(content: string): boolean {
	const lines = content.split('\n');
	if (lines.length === 0) return false;

	const firstLine = lines[0].trim();
	return EXISTING_COMMENT_PATTERNS.some((pattern) => pattern.test(firstLine));
}

function addOrUpdatePathComment(filePath: string, rootDir: string): boolean {
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		const ext = getFileExtension(filePath);
		const commentFunction = COMMENT_PATTERNS[ext as keyof typeof COMMENT_PATTERNS];

		if (!commentFunction) {
			return false;
		}

		const relativePath = getRelativePath(filePath, rootDir);
		const pathComment = commentFunction(relativePath);
		const lines = content.split('\n');

		let newContent: string;

		if (hasExistingPathComment(content)) {
			// Replace the first line with the new path comment
			lines[0] = pathComment;
			newContent = lines.join('\n');
		} else {
			// Add the path comment at the beginning
			newContent = pathComment + '\n' + content;
		}

		// Only write if content has changed
		if (newContent !== content) {
			fs.writeFileSync(filePath, newContent, 'utf8');
			return true;
		}

		return false;
	} catch (error) {
		console.error(`Error processing file ${filePath}:`, error);
		return false;
	}
}

function processDirectory(
	dirPath: string,
	rootDir: string
): { processed: number; updated: number } {
	let processed = 0;
	let updated = 0;

	try {
		const items = fs.readdirSync(dirPath);

		for (const item of items) {
			const fullPath = path.join(dirPath, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				if (shouldProcessDirectory(fullPath)) {
					const result = processDirectory(fullPath, rootDir);
					processed += result.processed;
					updated += result.updated;
				}
			} else if (stat.isFile()) {
				if (shouldProcessFile(fullPath)) {
					processed++;
					const wasUpdated = addOrUpdatePathComment(fullPath, rootDir);
					if (wasUpdated) {
						updated++;
						console.log(`Updated: ${getRelativePath(fullPath, rootDir)}`);
					}
				}
			}
		}
	} catch (error) {
		console.error(`Error processing directory ${dirPath}:`, error);
	}

	return { processed, updated };
}

function main() {
	const args = process.argv.slice(2);
	const targetDir = args[0] || process.cwd();
	const rootDir = path.resolve(targetDir);

	console.log(`Starting file path labeling in: ${rootDir}`);
	console.log('Supported file types:', Object.keys(COMMENT_PATTERNS).join(', '));
	console.log('');

	const startTime = Date.now();
	const result = processDirectory(rootDir, rootDir);
	const endTime = Date.now();

	console.log('');
	console.log('='.repeat(50));
	console.log(`Processed ${result.processed} files`);
	console.log(`Updated ${result.updated} files`);
	console.log(`Completed in ${endTime - startTime}ms`);

	if (result.updated === 0) {
		console.log('All files are already up to date!');
	}
}

// Run the script
main();
