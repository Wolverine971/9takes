// generateStreamlinedProjectContext2.ts
/**
 * generateProjectContext.ts - Comprehensive SvelteKit Context Generator
 * Captures all architectural relationships and business logic
 */

import fg from 'fast-glob';
import { promises as fs } from 'fs';
import * as path from 'path';
import { parse as parseSvelte } from 'svelte/compiler';
import * as babelParser from '@babel/parser';
import traverseModule from '@babel/traverse';
import * as t from '@babel/types';

const traverse = traverseModule.default || traverseModule;

/*─────────────────────────────────────────────────────────── TYPES */
interface PageInfo {
	file: string;
	route: string;
	props?: ComponentProp[];
	customComponents: string[];
	pathParams?: string[];
}

interface ComponentInfo {
	file: string;
	props: ComponentProp[];
	customComponents: string[];
	slots?: string[];
}

interface ComponentProp {
	name: string;
	type?: string;
	required: boolean;
}

interface APIEndpoint {
	file: string;
	route: string;
	methods: string[];
	pathParams?: string[];
}

interface LibModule {
	file: string;
	type: 'service' | 'store' | 'util' | 'config' | 'component' | 'types' | 'other';
	exports?: string[];
	imports?: string[];
}

interface RouteModule {
	file: string;
	route: string;
	type: 'layout' | 'layout.server' | 'page' | 'page.server';
	exports?: string[];
	pathParams?: string[];
}

interface ProjectContext {
	pages: PageInfo[];
	components: ComponentInfo[];
	apis: APIEndpoint[];
	libModules: LibModule[];
	routeModules: RouteModule[];
	dependencies: Record<string, string[]>;
	unusedComponents: string[];
}

/*────────────────────────────────────────────────────── UTIL HELPERS */
const SKIP_FILES = [
	'**/*.d.ts',
	'**/node_modules/**',
	'**/.svelte-kit/**',
	'**/.git/**',
	'**/dist/**',
	'**/build/**',
	'**/vite.config.*',
	'**/tailwind.config.*',
	'**/postcss.config.*',
	'**/svelte.config.*',
	'**/playwright.config.*',
	'**/eslint.config.*'
];

const FRAMEWORK_IMPORTS = new Set([
	'svelte',
	'svelte/store',
	'svelte/transition',
	'svelte/easing',
	'@sveltejs/kit',
	'@supabase/ssr',
	'mode-watcher',
	'date-fns',
	'canvas-confetti',
	'zod',
	'marked',
	'sanitize-html'
]);

function relative(root: string, file: string) {
	return path.relative(root, file).replace(/\\/g, '/');
}

function extractPathParams(routePath: string): string[] {
	return routePath
		.split('/')
		.map((seg) => {
			if (seg.startsWith('[') && seg.endsWith(']')) {
				return seg.slice(1, -1).replace(/^\.\.\./, '');
			}
		})
		.filter(Boolean) as string[];
}

function getRouteFromFile(file: string): string {
	return (
		file
			.replace(/^src\/routes/, '')
			.replace(/\/\+[^/]*$/, '')
			.replace(/\/\[([^\]]+)\]/g, '/[$1]') || '/'
	);
}

function parseBabel(code: string) {
	try {
		return babelParser.parse(code, {
			sourceType: 'module',
			plugins: ['typescript', 'jsx', 'decorators-legacy']
		});
	} catch {
		return null;
	}
}

function isCustomComponent(name: string): boolean {
	// Filter out common lucide icons but keep business components
	const lucideIcons =
		/^(Loader2?|Check|X|Plus|Edit[0-9]*|Save|Delete|Search|Filter|Calendar|Clock|User|Mail|Settings|Eye|Download|Upload|Arrow(Left|Right|Up|Down)|Chevron(Left|Right|Up|Down)|Alert(Circle|Triangle)|CheckCircle2?|Target|Brain|Sparkles|FileText|File|FolderOpen|Folder|Shield(Off)?|Activity|Bar(Chart|Chart3)|PieChart|TrendingUp|Award|Zap|Mic(Off)?|Send|Refresh(Cw)?|Trash2?|Copy|Sun|Moon|Menu|LogOut|Star|Heart|Home|Info|Lock|Unlock|Play|Pause|Stop|Volume|VolumeX|Wifi|WifiOff|Battery|BatteryLow|Power|PowerOff)$/;
	return !lucideIcons.test(name);
}

function getModuleType(filePath: string): LibModule['type'] {
	if (filePath.includes('/components/')) return 'component';
	if (filePath.includes('/services/')) return 'service';
	if (filePath.includes('/stores/')) return 'store';
	if (filePath.includes('/utils/')) return 'util';
	if (filePath.includes('/config/')) return 'config';
	if (filePath.includes('/types/') || filePath.endsWith('.types.ts')) return 'types';
	return 'other';
}

function extractImportsAndExports(code: string) {
	const imports: string[] = [];
	const exports: string[] = [];

	const ast = parseBabel(code);
	if (ast) {
		traverse(ast, {
			ImportDeclaration(path) {
				const source = path.node.source.value;
				if (!FRAMEWORK_IMPORTS.has(source) && !source.startsWith('.')) {
					imports.push(source);
				} else if (
					source.startsWith('$lib/') ||
					source.startsWith('./') ||
					source.startsWith('../')
				) {
					imports.push(source);
				}
			},
			ExportNamedDeclaration(path) {
				if (path.node.declaration) {
					if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
						exports.push(path.node.declaration.id.name);
					} else if (t.isVariableDeclaration(path.node.declaration)) {
						path.node.declaration.declarations.forEach((decl) => {
							if (t.isIdentifier(decl.id)) {
								exports.push(decl.id.name);
							}
						});
					} else if (t.isClassDeclaration(path.node.declaration) && path.node.declaration.id) {
						exports.push(path.node.declaration.id.name);
					} else if (t.isTSInterfaceDeclaration(path.node.declaration)) {
						exports.push(path.node.declaration.id.name);
					} else if (t.isTSTypeAliasDeclaration(path.node.declaration)) {
						exports.push(path.node.declaration.id.name);
					}
				}
				if (path.node.specifiers) {
					path.node.specifiers.forEach((spec) => {
						if (t.isExportSpecifier(spec) && t.isIdentifier(spec.exported)) {
							exports.push(spec.exported.name);
						}
					});
				}
			},
			ExportDefaultDeclaration() {
				exports.push('default');
			}
		});
	}

	return { imports, exports };
}

/*───────────────────────────────────────────────────── SCAN FUNCTIONS */
async function scanSvelteFile(
	file: string,
	projectRoot: string
): Promise<ComponentInfo | PageInfo | null> {
	const rel = relative(projectRoot, file);
	const isPage = path.basename(file) === '+page.svelte';
	const isLayout = path.basename(file) === '+layout.svelte';

	try {
		const src = await fs.readFile(file, 'utf-8');
		const ast = parseSvelte(src);

		const props: ComponentProp[] = [];
		const customComponents: string[] = [];
		const slots: string[] = [];

		// Extract props
		if (ast.instance) {
			const scriptCode = src.slice(ast.instance.content.start, ast.instance.content.end);
			const exportLetRegex =
				/export\s+let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?::\s*([^=;,]+?))?\s*(?:=\s*[^;,]+?)?[;,]/g;
			let match;
			while ((match = exportLetRegex.exec(scriptCode)) !== null) {
				const type = match[2]?.trim().replace(/\s*\|\s*undefined$/, '');
				props.push({
					name: match[1],
					type,
					required: !scriptCode.includes(`${match[1]} =`)
				});
			}
		}

		// Extract custom components from template
		if (ast.html) {
			const templateCode = src.slice(ast.html.start, ast.html.end);
			const componentRegex = /<([A-Z][a-zA-Z0-9]*)/g;
			const found = new Set<string>();
			let templateMatch;

			while ((templateMatch = componentRegex.exec(templateCode)) !== null) {
				if (isCustomComponent(templateMatch[1])) {
					found.add(templateMatch[1]);
				}
			}
			customComponents.push(...Array.from(found));

			// Extract slots for components (not pages)
			if (!isPage && !isLayout) {
				const slotRegex = /<slot(?:\s+name="([^"]*)")?/g;
				let slotMatch;
				while ((slotMatch = slotRegex.exec(templateCode)) !== null) {
					slots.push(slotMatch[1] || 'default');
				}
			}
		}

		const baseInfo = {
			file: rel,
			props: props.filter((p) => p.name !== 'data'), // Skip common 'data' prop
			customComponents
		};

		if (isPage || isLayout) {
			const route = getRouteFromFile(rel);
			const pathParams = extractPathParams(route);
			return {
				...baseInfo,
				route,
				...(pathParams.length > 0 && { pathParams })
			} as PageInfo;
		} else {
			return {
				...baseInfo,
				...(slots.length > 0 && { slots })
			} as ComponentInfo;
		}
	} catch (error) {
		console.warn(`⚠️  Failed to scan Svelte file ${rel}: ${error}`);
		return null;
	}
}

async function scanEndpoint(file: string, projectRoot: string): Promise<APIEndpoint | null> {
	const rel = relative(projectRoot, file);
	const route = getRouteFromFile(rel);

	try {
		const src = await fs.readFile(file, 'utf-8');
		const methods: string[] = [];

		// Extract HTTP methods
		const methodRegex =
			/export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)/g;
		let match;
		while ((match = methodRegex.exec(src)) !== null) {
			methods.push(match[1]);
		}

		const pathParams = extractPathParams(route);
		return {
			file: rel,
			route,
			methods,
			...(pathParams.length > 0 && { pathParams })
		};
	} catch (error) {
		console.warn(`⚠️  Failed to scan endpoint ${rel}: ${error}`);
		return null;
	}
}

async function scanLibModule(file: string, projectRoot: string): Promise<LibModule | null> {
	const rel = relative(projectRoot, file);

	try {
		const code = await fs.readFile(file, 'utf-8');
		const { imports, exports } = extractImportsAndExports(code);
		const type = getModuleType(rel);

		return {
			file: rel,
			type,
			...(exports.length > 0 && { exports }),
			...(imports.length > 0 && { imports })
		};
	} catch (error) {
		console.warn(`⚠️  Failed to scan lib module ${rel}: ${error}`);
		return null;
	}
}

async function scanRouteModule(file: string, projectRoot: string): Promise<RouteModule | null> {
	const rel = relative(projectRoot, file);
	const route = getRouteFromFile(rel);

	try {
		const code = await fs.readFile(file, 'utf-8');
		const { exports } = extractImportsAndExports(code);

		let type: RouteModule['type'];
		if (rel.includes('+page.server.')) type = 'page.server';
		else if (rel.includes('+page.')) type = 'page';
		else if (rel.includes('+layout.server.')) type = 'layout.server';
		else if (rel.includes('+layout.')) type = 'layout';
		else return null;

		const pathParams = extractPathParams(route);
		return {
			file: rel,
			route,
			type,
			...(exports.length > 0 && { exports }),
			...(pathParams.length > 0 && { pathParams })
		};
	} catch (error) {
		console.warn(`⚠️  Failed to scan route module ${rel}: ${error}`);
		return null;
	}
}

/*─────────────────────────────────────────────────── MAIN BUILD */
async function buildContext(projectRoot: string): Promise<ProjectContext> {
	// More comprehensive file discovery
	const allFiles = await fg(['src/**/*.svelte', 'src/**/*.ts', 'src/**/*.js'], {
		cwd: projectRoot,
		ignore: SKIP_FILES,
		absolute: true,
		dot: false
	});

	console.log(`📁 Scanning ${allFiles.length} files...`);

	const pages: PageInfo[] = [];
	const components: ComponentInfo[] = [];
	const apis: APIEndpoint[] = [];
	const libModules: LibModule[] = [];
	const routeModules: RouteModule[] = [];

	for (const file of allFiles) {
		const rel = relative(projectRoot, file);

		try {
			if (file.endsWith('.svelte')) {
				const result = await scanSvelteFile(file, projectRoot);
				if (result) {
					if ('route' in result) {
						pages.push(result as PageInfo);
					} else {
						components.push(result as ComponentInfo);
					}
				}
			} else if (file.includes('+server.')) {
				const result = await scanEndpoint(file, projectRoot);
				if (result) apis.push(result);
			} else if (rel.startsWith('src/lib/')) {
				const result = await scanLibModule(file, projectRoot);
				if (result) libModules.push(result);
			} else if (
				file.includes('/routes/') &&
				(file.includes('+page.') || file.includes('+layout.') || file.includes('+error.'))
			) {
				const result = await scanRouteModule(file, projectRoot);
				if (result) routeModules.push(result);
			}
		} catch (error) {
			console.warn(`⚠️  Failed to process ${rel}: ${error}`);
		}
	}

	// Build dependencies (only custom components)
	const dependencies: Record<string, string[]> = {};
	const usedComponents = new Set<string>();

	[...pages, ...components].forEach((item) => {
		const deps: string[] = [];

		item.customComponents.forEach((compName) => {
			const matchingComp = components.find((c) => {
				const baseName = path.basename(c.file, '.svelte');
				return baseName === compName || baseName.toLowerCase() === compName.toLowerCase();
			});
			if (matchingComp) {
				deps.push(matchingComp.file);
				usedComponents.add(matchingComp.file);
			}
		});

		if (deps.length > 0) {
			dependencies[item.file] = deps;
		}
	});

	// Mark pages and layouts as used
	pages.forEach((page) => usedComponents.add(page.file));

	// Find unused components
	const unusedComponents = components
		.filter((comp) => !usedComponents.has(comp.file))
		.map((comp) => comp.file);

	return {
		pages,
		components,
		apis,
		libModules,
		routeModules,
		dependencies,
		unusedComponents
	};
}

/*─────────────────────────────────────────────────────────── CLI */
async function main() {
	const args = process.argv.slice(2);
	const projectRoot = path.resolve(args[0] ?? '.');
	const outputPath = path.resolve(args.find((_, i) => args[i - 1] === '-o') ?? 'repo-context.json');

	console.log(`🔍 Analyzing: ${projectRoot}`);
	console.log(`📄 Output: ${outputPath}`);

	const context = await buildContext(projectRoot);
	await fs.writeFile(outputPath, JSON.stringify(context, null, 2));

	console.log(`✅ Analysis complete!`);
	console.log(`📊 Found:`);
	console.log(`   • ${context.pages.length} pages`);
	console.log(`   • ${context.components.length} components`);
	console.log(`   • ${context.apis.length} API endpoints`);
	console.log(`   • ${context.libModules.length} lib modules`);
	console.log(`   • ${context.routeModules.length} route modules`);

	if (context.unusedComponents.length) {
		console.log(`🗑️  Unused: ${context.unusedComponents.length} components`);
	}
}

main().catch(console.error);
