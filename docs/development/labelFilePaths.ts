// docs/development/labelFilePaths.ts
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
	'temp',
	'static'
];

const EXCLUDED_FILES = [
	'.gitignore',
	'.env',
	'.env.local',
	'.env.example',
	'package-lock.json',
	'pnpm-lock.yaml',
	'yarn.lock',
	'database.types.ts'
];

// Comment patterns for different file types
const COMMENT_PATTERNS = {
	// HTML-style comments
	svelte: (filePath: string) => `<!-- ${filePath} -->`,
	html: (filePath: string) => `<!-- ${filePath} -->`,
	xml: (filePath: string) => `<!-- ${filePath} -->`,
	md: (filePath: string) => `<!-- ${filePath} -->`,

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

// Regex patterns to detect existing path comments (must contain path-like pattern: word/word or word.ext)
// These are more specific to avoid matching markdown headers, frontmatter, etc.
// Note: [\w\-./+] includes + for SvelteKit files like +page.svelte, +server.ts
const EXISTING_PATH_COMMENT_PATTERNS = [
	/^<!--\s*[\w\-./+]+\.(md|svelte|html|xml)\s*-->/, // HTML-style path comments
	/^\/\/\s*[\w\-./+]+\.(ts|js|mjs|jsx|tsx|jsonc)/, // Single-line path comments
	/^\/\*\s*[\w\-./+]+\.(css|scss|sass|less)\s*\*\//, // CSS-style path comments
	/^#\s*[\w\-./+]+\.(py|sh|bash|yml|yaml)/, // Hash path comments (not markdown headers!)
	/^--\s*[\w\-./+]+\.sql/ // SQL path comments
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
	return EXISTING_PATH_COMMENT_PATTERNS.some((pattern) => pattern.test(firstLine));
}

/**
 * Check if markdown content has YAML frontmatter (starts with ---)
 */
function hasFrontmatter(content: string): boolean {
	return content.trimStart().startsWith('---');
}

/**
 * Check if frontmatter already contains a path field
 */
function frontmatterHasPath(content: string): boolean {
	const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
	if (!frontmatterMatch) return false;
	return /^path:\s*/m.test(frontmatterMatch[1]);
}

/**
 * Add or update the path field inside frontmatter
 */
function addPathToFrontmatter(content: string, relativePath: string): string {
	const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
	if (!frontmatterMatch) return content;

	const [, opening, frontmatterContent, closing] = frontmatterMatch;
	const restOfFile = content.slice(frontmatterMatch[0].length);

	// Check if path already exists
	if (/^path:\s*/m.test(frontmatterContent)) {
		// Update existing path
		const updatedFrontmatter = frontmatterContent.replace(/^path:\s*.*$/m, `path: ${relativePath}`);
		return opening + updatedFrontmatter + closing + restOfFile;
	} else {
		// Add path at the end of frontmatter (before closing ---)
		return opening + frontmatterContent + `\npath: ${relativePath}` + closing + restOfFile;
	}
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
		let newContent: string;

		// Special handling for markdown files
		if (ext === 'md') {
			if (hasFrontmatter(content)) {
				// Add path inside frontmatter - never touch headers or other content
				newContent = addPathToFrontmatter(content, relativePath);
			} else {
				// No frontmatter - prepend HTML comment, NEVER replace existing content
				const pathComment = commentFunction(relativePath);
				if (hasExistingPathComment(content)) {
					// Already has a path comment, update it
					const lines = content.split('\n');
					lines[0] = pathComment;
					newContent = lines.join('\n');
				} else {
					// Prepend the path comment (push existing content down)
					newContent = pathComment + '\n' + content;
				}
			}
		} else {
			// Non-markdown files: use original logic
			const pathComment = commentFunction(relativePath);
			const lines = content.split('\n');

			if (hasExistingPathComment(content)) {
				// Replace the first line with the new path comment
				lines[0] = pathComment;
				newContent = lines.join('\n');
			} else {
				// Add the path comment at the beginning
				newContent = pathComment + '\n' + content;
			}
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
