// scripts/gen-all.js
//
// Smart `gen:all` runner.
//
// Default (incremental): only format + label the files you've changed on this
// local git branch (committed-on-branch + staged + unstaged + untracked),
// then run the generators that build complete artifacts from all inputs.
//
// Full rescan: `node scripts/gen-all.js --all` formats and labels every file,
// matching the old behavior. (Wired up as `pnpm gen:all:full`.)

import { execFileSync, spawnSync } from 'child_process';

const FULL = process.argv.includes('--all') || process.argv.includes('--full');
const MAIN_BRANCH = process.env.GEN_ALL_BASE_BRANCH || 'main';

// Generators that read source content and emit complete artifacts. These are
// not "scan and format" steps, so they always run regardless of mode.
const GENERATORS = [
	'gen:types',
	'gen:personality-image-map',
	'gen:famous-types',
	'gen:corpus-stats',
	'gen:sitemap',
	'gen:crosslinks',
	'gen:search-index'
];

function run(cmd, args, opts = {}) {
	const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false, ...opts });
	if (result.status !== 0) {
		const label = [cmd, ...args].join(' ');
		throw new Error(`Command failed (${result.status}): ${label}`);
	}
}

function gitLines(args) {
	try {
		const out = execFileSync('git', args, { encoding: 'utf8' });
		return out
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);
	} catch {
		return [];
	}
}

// Everything changed on this branch relative to its branch point, plus local
// working-tree changes (staged/unstaged), plus new untracked files. On `main`
// itself the merge-base is HEAD, so this naturally reduces to just your
// uncommitted local changes.
function getChangedFiles() {
	let base = '';
	try {
		base = execFileSync('git', ['merge-base', 'HEAD', MAIN_BRANCH], {
			encoding: 'utf8'
		}).trim();
	} catch {
		base = '';
	}

	const files = new Set();
	// Tracked changes vs branch point (committed + staged + unstaged), excluding
	// deletions (--diff-filter=d, lowercase = exclude Deleted).
	if (base) {
		for (const f of gitLines(['diff', '--name-only', '--diff-filter=d', base])) {
			files.add(f);
		}
	}
	// Working-tree changes (covers the `main` case and anything not yet committed).
	for (const f of gitLines(['diff', '--name-only', '--diff-filter=d', 'HEAD'])) {
		files.add(f);
	}
	for (const f of gitLines(['diff', '--cached', '--name-only', '--diff-filter=d'])) {
		files.add(f);
	}
	// New untracked files (respecting .gitignore).
	for (const f of gitLines(['ls-files', '--others', '--exclude-standard'])) {
		files.add(f);
	}

	return [...files];
}

function formatAndLabel() {
	if (FULL) {
		console.log('\n▶ Full rescan: formatting and labeling all files\n');
		run('pnpm', ['format']);
		run('pnpm', ['label-paths']);
		return;
	}

	const changed = getChangedFiles();
	if (changed.length === 0) {
		console.log('\n▶ No changed files detected — skipping format + label\n');
		return;
	}

	console.log(`\n▶ Incremental: ${changed.length} changed file(s)\n`);
	for (const f of changed) console.log(`  • ${f}`);
	console.log('');

	// Prettier respects .prettierignore; --ignore-unknown skips files it can't parse.
	run('pnpm', ['exec', 'prettier', '--write', '--ignore-unknown', ...changed]);

	// label-paths filters unsupported/excluded files internally.
	run('pnpm', ['label-paths', '--files', ...changed]);
}

function main() {
	formatAndLabel();

	console.log('\n▶ Running generators\n');
	for (const script of GENERATORS) {
		run('pnpm', [script]);
	}

	console.log('\n✓ gen:all complete\n');
}

try {
	main();
} catch (err) {
	console.error(`\n✗ ${err.message}\n`);
	process.exit(1);
}
