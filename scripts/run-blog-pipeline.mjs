#!/usr/bin/env node
// scripts/run-blog-pipeline.mjs
// Evidence-first people profiles. A full run is research, draft, the jury reviews
// (two for an ordinary profile; evidence plus six when a risk is flagged, which is
// nearly always), edit, verify, and at most one repair with a second verification.
// See docs/writing-system/people-profile-standard.md.
//
//   Person                 new profile
//   Person --resume        continue a run that crashed
//   Person --refresh       rerun from research with the current draft as baseline
//   Person --reverify      one repair + verification of the draft as it stands now
//                          (after a hold, or after the owner edited it by hand)
//   Person --reassess      no model calls: re-apply today's release rules to the
//                          last run's artifacts (add --dry-run to only report)
//
// Exit codes: 0 eligible, 2 editorial/research hold, 1 operational failure,
// 3 preflight failure (network or CLI down; nothing was attempted).
import { promises as fs, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';
import matter from 'gray-matter';
import {
	sha256,
	editorialHash,
	matchesEditorialHash,
	reviewSchema,
	resolutionSchema,
	verificationSchema,
	validateEvidence,
	requiredRoles,
	profileFormat,
	assessEditorial,
	getEditorialPublishStatus,
	readJson,
	writeJson,
	atomicWrite,
	errorMessage,
	cleanReaderCopy,
	EXPANDED_ROLES,
	ADVISORY_OVERALL
} from './lib/blogEditorial.js';
import { buildChecks } from './lib/blogPipelineChecks.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** @param {string} value */
const normalize = (value) => value.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
/** @param {string} file */
const exists = async (file) =>
	fs.access(file).then(
		() => true,
		() => false
	);
const now = () => new Date().toISOString();
const cli = () => process.env.BLOG_PIPELINE_CLAUDE || 'claude';
// Stages read arbitrary web pages with permissions skipped. They need the web, the
// shell and files; they do not need mail, calendar, browser or database connectors.
const NO_CONNECTORS = ['--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}'];
const MODES = ['resume', 'refresh', 'reverify', 'reassess'];
/** @type {Set<import('node:child_process').ChildProcess>} */
const children = new Set();
/** @param {import('node:child_process').ChildProcess} child @param {NodeJS.Signals} signal */
function killGroup(child, signal = 'SIGTERM') {
	if (!child.pid) return;
	try {
		process.kill(-child.pid, signal);
	} catch {
		/* Child already exited. */
	}
}
function stopChildren() {
	for (const child of children) killGroup(child, 'SIGKILL');
}

/** Draft handoff state once the editorial release is cut.
 * @param {Record<string, any> | undefined} previous */
const readyPretext = (previous) => ({
	...previous,
	status: 'ready',
	handoff_from: 'blog_pipeline_v3',
	reviewed: true,
	ready_for_production: true,
	sync_mode: 'full',
	requires: ['db_sync', 'db_verify', 'regenerate_famous_types', 'image_check'],
	blockers: []
});

/** @param {string[]} args */
export function parseArgs(args) {
	const options = {
		mode: 'create',
		expanded: false,
		timeoutSeconds: 2700,
		subject: '',
		dryRun: false,
		preflight: true
	};
	for (const arg of args) {
		if (MODES.includes(arg.slice(2)) && arg.startsWith('--')) {
			if (options.mode !== 'create')
				throw new Error('Choose one of --resume, --refresh, --reverify or --reassess');
			options.mode = arg.slice(2);
		} else if (arg === '--expanded-review') options.expanded = true;
		else if (arg === '--dry-run') options.dryRun = true;
		else if (arg === '--skip-preflight') options.preflight = false;
		else if (arg.startsWith('--stage-timeout-seconds='))
			options.timeoutSeconds = Number(arg.split('=')[1]);
		else if (!options.subject && /^[\p{L}\p{N}][\p{L}\p{N}.'’ -]*$/u.test(arg))
			options.subject = arg.trim().replace(/\s+/g, '-');
		else throw new Error(`Unknown or invalid argument: ${arg}`);
	}
	if (!options.subject || !Number.isFinite(options.timeoutSeconds) || options.timeoutSeconds <= 0)
		throw new Error(
			'Usage: scripts/run-blog-pipeline.sh Person [--resume | --refresh | --reverify | --reassess [--dry-run]] [--expanded-review] [--stage-timeout-seconds=2700] [--skip-preflight]'
		);
	if (options.dryRun && options.mode !== 'reassess')
		throw new Error('--dry-run only applies to --reassess');
	return options;
}

/** Turns granted to write outputs after a stage exhausts its turns or its clock. */
const WRAP_UP_TURNS = 20;
/** Seconds granted for that wrap-up, capped at a quarter of the stage timeout. */
const WRAP_UP_SECONDS = 600;
/** The runner's own evidence check, as a command a stage can run on its files. */
const EVIDENCE_CHECK_HINT =
	'To test an article and its evidence file the way the runner does: node scripts/check-stage-evidence.mjs <article.md> <evidence.json>';

/** @param {unknown} input */
function summarizeToolInput(input) {
	if (!input || typeof input !== 'object') return '';
	const record = /** @type {Record<string, unknown>} */ (input);
	const value =
		record.command ??
		record.url ??
		record.query ??
		record.file_path ??
		record.pattern ??
		record.description ??
		'';
	return String(value).replace(/\s+/g, ' ').slice(0, 160);
}

/**
 * One CLI call. The CLI streams JSON events; the readable log keeps the model's
 * text and one line per tool call, so a hung or failed stage leaves a trace.
 * @param {string[]} args
 * @param {{log: import('node:fs').WriteStream, transcript?: import('node:fs').WriteStream | null, root: string, deadline: number}} io
 * @returns {Promise<{status: 'ok' | 'max_turns' | 'timeout', meta: {model: string | null, turns: number | null, cost_usd: number | null}}>}
 */
function runClaude(args, { log, transcript, root, deadline }) {
	return new Promise((resolve, reject) => {
		const child = spawn(cli(), [...args, '--output-format', 'stream-json', '--verbose'], {
			cwd: root,
			detached: true,
			stdio: ['ignore', 'pipe', 'pipe']
		});
		children.add(child);
		/** @type {{model: string | null, turns: number | null, cost_usd: number | null}} */
		const meta = { model: null, turns: null, cost_usd: null };
		let resultSubtype = '';
		let resultError = '';
		let timedOut = false;
		let tail = '';
		let buffer = '';
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let killTimer;
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let forceTimer;
		let finished = false;
		const finish = (
			/** @type {unknown} */ error,
			/** @type {'ok' | 'max_turns' | 'timeout'} */ status = 'ok'
		) => {
			if (finished) return;
			finished = true;
			clearTimeout(timer);
			clearTimeout(killTimer);
			clearTimeout(forceTimer);
			killGroup(child, 'SIGKILL');
			children.delete(child);
			if (error) reject(error);
			else resolve({ status, meta });
		};
		const timer = setTimeout(
			() => {
				timedOut = true;
				killGroup(child);
				killTimer = setTimeout(() => killGroup(child, 'SIGKILL'), 3000);
				// A grandchild that left the process group (a background download) can
				// hold the pipes open long after the kill. Do not wait for it.
				forceTimer = setTimeout(() => finish(null, 'timeout'), 6000);
			},
			Math.max(0, deadline - Date.now())
		);
		const write = (/** @type {string} */ text) => {
			tail = (tail + text).slice(-2000);
			log.write(text);
			process.stdout.write(text);
		};
		const handleLine = (/** @type {string} */ line) => {
			if (!line.trim()) return;
			/** @type {any} */
			let event = null;
			try {
				event = JSON.parse(line);
			} catch {
				/* Plain text from the CLI or a test double. */
			}
			if (!event || typeof event !== 'object' || typeof event.type !== 'string')
				return write(line + '\n');
			if (event.type === 'system' && event.subtype === 'init' && event.model)
				meta.model = event.model;
			else if (event.type === 'assistant') {
				for (const block of event.message?.content ?? []) {
					if (block.type === 'text' && block.text?.trim()) write(block.text.trim() + '\n');
					else if (block.type === 'tool_use')
						write(`  · ${block.name} ${summarizeToolInput(block.input)}\n`);
				}
			} else if (event.type === 'result') {
				resultSubtype = String(event.subtype ?? '');
				meta.turns = typeof event.num_turns === 'number' ? event.num_turns : null;
				meta.cost_usd = typeof event.total_cost_usd === 'number' ? event.total_cost_usd : null;
				const models = Object.keys(event.modelUsage ?? {});
				if (models.length) meta.model = models.join(', ');
				if (event.is_error)
					resultError = String(
						event.result ?? (Array.isArray(event.errors) ? event.errors.join('; ') : '')
					).slice(0, 300);
				write(
					`[result] ${resultSubtype || 'done'} · turns ${meta.turns ?? '?'} · $${(meta.cost_usd ?? 0).toFixed(2)} · ${meta.model ?? 'unknown model'}\n`
				);
			}
		};
		child.stdout.on('data', (chunk) => {
			transcript?.write(chunk);
			buffer += chunk;
			let index;
			while ((index = buffer.indexOf('\n')) >= 0) {
				handleLine(buffer.slice(0, index));
				buffer = buffer.slice(index + 1);
			}
		});
		child.stderr.on('data', (chunk) => {
			log.write(chunk);
			process.stderr.write(chunk);
		});
		child.once('error', (error) => finish(error));
		child.once('close', (code, signal) => {
			if (buffer) handleLine(buffer);
			if (timedOut) finish(null, 'timeout');
			else if (code === 0) finish(null);
			// The CLI exits 1 at the turn cap; the session holds all gathered work.
			else if (
				resultSubtype === 'error_max_turns' ||
				(code === 1 && /Reached max turns \(\d+\)/.test(tail))
			)
				finish(null, 'max_turns');
			else {
				const detail = resultError || tail.trim().slice(-200);
				finish(new Error(`Claude exited ${code ?? signal}${detail ? `: ${detail}` : ''}`));
			}
		});
	});
}

/**
 * @param {string} requestFile
 * @param {string} logFile
 * @param {{root: string, model?: string | null, maxTurns: number, timeoutSeconds: number, transcriptFile?: string, fix?: {sessionId: string, problem: string}}} options
 *   `fix` resumes an earlier session of this stage to correct files the runner rejected.
 * @returns {Promise<{model: string | null, turns: number, cost_usd: number, wrapped_up: string | null, session_id: string}>}
 */
export async function executeClaude(requestFile, logFile, options) {
	const log = createWriteStream(logFile, { flags: 'a' });
	const transcript = options.transcriptFile
		? createWriteStream(options.transcriptFile, { flags: 'a' })
		: null;
	const sessionId = randomUUID();
	const shared = [
		'--dangerously-skip-permissions',
		...NO_CONNECTORS,
		...(options.model ? ['--model', options.model] : [])
	];
	/** @type {{model: string | null, turns: number, cost_usd: number, wrapped_up: string | null, session_id: string}} */
	const total = { model: null, turns: 0, cost_usd: 0, wrapped_up: null, session_id: sessionId };
	const absorb = (
		/** @type {{model: string | null, turns: number | null, cost_usd: number | null}} */ meta
	) => {
		total.model = meta.model ?? total.model;
		total.turns += meta.turns ?? 0;
		total.cost_usd = Math.round((total.cost_usd + (meta.cost_usd ?? 0)) * 100) / 100;
	};
	const prompt = `Read ${requestFile}. It is the complete stage request. Read its command_file and standard_file, then complete only this stage. Write the requested output files. Do not modify any other files or publish anything.`;
	// Stages write their outputs last, so hitting the turn cap or the clock used to
	// discard the whole session. Resume it once with a small budget to record what it found.
	const wrapUp = `You reached this stage's turn or time limit. Stop gathering: no new searches or sources. Using only what this session already verified, write the requested output files from ${requestFile} now. Where essential evidence is still unverified, record that honestly in the form the command_file allows (for research: insufficient_evidence with specific research_tasks). Never invent evidence, locators or confidence to fill a field.`;
	const wrapUpSeconds = Math.min(WRAP_UP_SECONDS, options.timeoutSeconds * 0.25);
	try {
		if (options.fix) {
			// The stage finished but the runner rejected its files. The session still
			// holds everything it read, so a short resume can correct them.
			total.session_id = options.fix.sessionId;
			log.write(
				`\n[runner] Output check failed (${options.fix.problem}); resuming session ${options.fix.sessionId} to fix the files\n`
			);
			const fix = `The runner checked the output files you wrote for ${requestFile} and rejected them:\n\n${options.fix.problem}\n\nCorrect the requested output files so this check passes, and change nothing else: no new research, no new sources, no rewriting of passages the check did not name. If the check names a claim whose passage is missing, point that claim at text that really is in the article (or restore the text), and keep the claim's meaning true to its sources. Never invent evidence to satisfy the check. ${EVIDENCE_CHECK_HINT}`;
			const run = await runClaude(
				[
					'-p',
					fix,
					'--resume',
					options.fix.sessionId,
					'--max-turns',
					String(WRAP_UP_TURNS),
					...shared
				],
				{ log, transcript, root: options.root, deadline: Date.now() + wrapUpSeconds * 1000 }
			);
			absorb(run.meta);
			if (run.status === 'max_turns') throw new Error('Claude reached max turns');
			if (run.status === 'timeout') throw new Error('Stage timed out');
			return total;
		}
		let run = await runClaude(
			['-p', prompt, '--session-id', sessionId, '--max-turns', String(options.maxTurns), ...shared],
			{ log, transcript, root: options.root, deadline: Date.now() + options.timeoutSeconds * 1000 }
		);
		absorb(run.meta);
		if (run.status !== 'ok') {
			total.wrapped_up = run.status;
			log.write(
				`\n[runner] ${run.status === 'timeout' ? 'Time' : 'Turn'} limit reached; resuming session ${sessionId} to write outputs\n`
			);
			run = await runClaude(
				['-p', wrapUp, '--resume', sessionId, '--max-turns', String(WRAP_UP_TURNS), ...shared],
				{ log, transcript, root: options.root, deadline: Date.now() + wrapUpSeconds * 1000 }
			);
			absorb(run.meta);
		}
		if (run.status === 'max_turns') throw new Error('Claude reached max turns');
		if (run.status === 'timeout') throw new Error('Stage timed out');
		return total;
	} finally {
		await Promise.all(
			[log, transcript].map((stream) => stream && new Promise((resolve) => stream.end(resolve)))
		);
	}
}

/**
 * Network and CLI check before any stage runs. An outage used to look like a
 * research timeout and was charged to the person as a failed attempt.
 * @returns {Promise<string[]>} problems; empty when healthy
 */
export async function preflight() {
	try {
		await fetch('https://api.anthropic.com', {
			method: 'HEAD',
			signal: AbortSignal.timeout(15000)
		});
	} catch (error) {
		return [`network: cannot reach api.anthropic.com (${errorMessage(error)})`];
	}
	return new Promise((resolve) => {
		const child = spawn(
			cli(),
			[
				'-p',
				'Reply with only the word ok',
				'--max-turns',
				'1',
				'--model',
				'haiku',
				...NO_CONNECTORS
			],
			{ stdio: ['ignore', 'pipe', 'pipe'] }
		);
		let output = '';
		const timer = setTimeout(() => child.kill('SIGKILL'), 120000);
		child.stdout.on('data', (chunk) => (output += chunk));
		child.stderr.on('data', (chunk) => (output += chunk));
		child.once('error', (error) => {
			clearTimeout(timer);
			resolve([`claude CLI: ${errorMessage(error)}`]);
		});
		child.once('close', (code) => {
			clearTimeout(timer);
			resolve(
				code === 0
					? []
					: [
							`claude CLI: a one-word test call failed (exit ${code ?? 'killed'}): ${output.trim().slice(-200)}`
						]
			);
		});
	});
}

/** @param {ReturnType<typeof parseArgs>} options @param {{root?: string, execute?: typeof executeClaude | ((requestFile: string, logFile: string, options: any) => Promise<any>), cacheRoot?: string}} dependencies */
export async function runPipeline(
	options,
	{ root = repoRoot, execute = executeClaude, cacheRoot } = {}
) {
	const logsRoot = path.join(root, 'docs/content-analysis/pipeline-logs');
	const draftsRoot = path.join(root, 'src/blog/people/drafts');
	// Saved source text lives outside the repository: the repo is public and full
	// transcripts and article text must not be committed.
	const cache =
		cacheRoot ||
		process.env.BLOG_PIPELINE_CACHE ||
		(root === repoRoot
			? path.join(homedir(), '.cache/9takes-research')
			: path.join(root, '.cache/9takes-research'));
	await fs.mkdir(logsRoot, { recursive: true });
	const matches = (await fs.readdir(draftsRoot)).filter(
		(file) => file.endsWith('.md') && normalize(file.slice(0, -3)) === normalize(options.subject)
	);
	if (matches.length > 1) throw new Error('Ambiguous subject: more than one matching draft');
	if (matches.length) options.subject = matches[0].slice(0, -3);
	if (!matches.length && options.mode === 'resume') {
		for (const name of (await fs.readdir(logsRoot)).sort().reverse()) {
			try {
				const run = await readJson(path.join(logsRoot, name, 'run.json'));
				if (
					run.schema_version === 3 &&
					typeof run.subject === 'string' &&
					normalize(run.subject) === normalize(options.subject)
				) {
					options.subject = parseArgs([run.subject]).subject;
					break;
				}
			} catch {
				/* Not a valid v3 checkpoint. */
			}
		}
	}
	const subject = options.subject;
	const draftPath = path.join(draftsRoot, `${subject}.md`);
	if (options.mode === 'create' && matches.length)
		throw new Error('Draft exists; use --refresh, --reverify or --resume');
	if (['refresh', 'reverify', 'reassess'].includes(options.mode) && !matches.length)
		throw new Error(`--${options.mode} requires an existing draft`);
	const snapshotDir = path.join(cache, subject.toLowerCase(), 'sources');

	/** Newest v3 run for this subject, optionally the one a draft points at.
	 * @param {string} [preferred] @param {string} [exclude] */
	async function findRun(preferred, exclude) {
		const names = (await fs.readdir(logsRoot)).filter((name) => !name.startsWith('.'));
		const ordered = [
			...(preferred && names.includes(path.basename(preferred)) ? [path.basename(preferred)] : []),
			...names.sort().reverse()
		];
		for (const name of ordered) {
			const runDir = path.join(logsRoot, name);
			if (exclude && runDir === exclude) continue;
			try {
				const run = await readJson(path.join(runDir, 'run.json'));
				if (
					run.schema_version === 3 &&
					typeof run.subject === 'string' &&
					normalize(run.subject) === normalize(subject)
				)
					return { dir: runDir, state: run };
			} catch {
				/* Legacy or incomplete directory. */
			}
		}
		return null;
	}

	const lock = path.join(logsRoot, '.pipeline.lock');
	try {
		await fs.mkdir(lock);
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') throw error;
		const pid = Number(await fs.readFile(path.join(lock, 'pid'), 'utf8').catch(() => ''));
		if (!pid)
			throw new Error('Pipeline lock has no PID; inspect it before removing it', { cause: error });
		try {
			process.kill(pid, 0);
			throw new Error(`Pipeline already running (PID ${pid})`, { cause: error });
		} catch (probe) {
			if (!(probe instanceof Error) || !('code' in probe) || probe.code !== 'ESRCH') throw probe;
		}
		await fs.rm(lock, { recursive: true });
		await fs.mkdir(lock);
	}
	await fs.writeFile(path.join(lock, 'pid'), String(process.pid));
	await fs.writeFile(path.join(lock, 'person'), subject);
	// Run/checkpoint history is JSON; stage artifacts are parsed through Zod.
	/** @type {any} */
	let state;
	let dir = '';
	let interrupted = false;
	const onSignal = () => {
		interrupted = true;
		stopChildren();
	};
	process.on('SIGTERM', onSignal);
	process.on('SIGINT', onSignal);
	try {
		const live = await fs.readFile(draftPath, 'utf8').catch(() => '');
		const liveWorkflow = live ? matter(live, {}).data.editorial_workflow : null;
		const pointed =
			liveWorkflow?.version === 3 && typeof liveWorkflow.run_dir === 'string'
				? path.resolve(root, liveWorkflow.run_dir)
				: undefined;
		const timestamp = () =>
			`${now().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')}_${subject}`;

		if (options.mode === 'resume') {
			const candidates = (await fs.readdir(logsRoot))
				.filter((name) => name.endsWith(`_${subject}`))
				.sort()
				.reverse();
			for (const name of candidates) {
				const file = path.join(logsRoot, name, 'run.json');
				if (!(await exists(file))) continue;
				const previous = await readJson(file);
				if (previous.schema_version === 3 && previous.subject === subject) {
					state = previous;
					dir = path.dirname(file);
					break;
				}
			}
			// Checkpoint keys changed on 2026-11-13. Resuming an old finished run would
			// redo every stage only to reach the same hold.
			if (state && state.cache_version !== 2 && ['held', 'completed'].includes(state.run_status)) {
				console.log(
					`That run already finished (${state.editorial_status}); there is nothing to resume. Use --reverify to repair and re-check the draft as it stands, --reassess to re-apply the release rules, or --refresh to start over.`
				);
				return { exitCode: state.editorial_status === 'eligible' ? 0 : 2, dir, state };
			}
		} else if (options.mode === 'reassess') {
			const prior = await findRun(pointed);
			if (!prior) throw new Error('No v3 run found for this draft');
			state = prior.state;
			dir = prior.dir;
		} else if (options.mode === 'reverify') {
			const prior = await findRun(pointed);
			if (!prior) throw new Error('No v3 run found for this draft; use --refresh');
			const priorFinal = (await exists(path.join(prior.dir, 'evidence-repair.json')))
				? 'repair'
				: 'edit';
			for (const name of [
				'draft.md',
				'evidence-draft.json',
				'evidence.json',
				`evidence-${priorFinal}.json`,
				`resolution-${priorFinal}.json`
			])
				if (!(await exists(path.join(prior.dir, name))))
					throw new Error(
						`The last run never reached the edit stage (${name} is missing); use --resume or --refresh`
					);
			const frozenType = Number(
				matter(await fs.readFile(path.join(prior.dir, 'draft.md'), 'utf8'), {}).data.enneagram
			);
			if (Number(matter(live, {}).data.enneagram) !== frozenType)
				throw new Error(
					'The type changed since the jury reviewed this profile; run --refresh --expanded-review so the new argument gets its own review'
				);
			dir = path.join(logsRoot, timestamp());
			await fs.mkdir(dir);
			const carried = (await fs.readdir(prior.dir)).filter(
				(name) =>
					['baseline.md', 'evidence.json', 'draft.md', 'evidence-draft.json'].includes(name) ||
					/^review-[a-z]+\.json$/.test(name)
			);
			for (const name of carried)
				await fs.copyFile(path.join(prior.dir, name), path.join(dir, name));
			await fs.copyFile(
				path.join(prior.dir, `evidence-${priorFinal}.json`),
				path.join(dir, 'prior-evidence-final.json')
			);
			await fs.copyFile(
				path.join(prior.dir, `resolution-${priorFinal}.json`),
				path.join(dir, 'prior-resolution.json')
			);
			if (await exists(path.join(prior.dir, `verification-${priorFinal}.json`)))
				await fs.copyFile(
					path.join(prior.dir, `verification-${priorFinal}.json`),
					path.join(dir, 'prior-verification.json')
				);
			await fs.writeFile(path.join(dir, 'owner-draft.md'), cleanReaderCopy(live));
			const priorBaseline = await fs.readFile(path.join(dir, 'baseline.md'), 'utf8');
			state = {
				schema_version: 3,
				cache_version: 2,
				subject,
				mode: 'reverify',
				carried_from: path.relative(root, prior.dir),
				// Path labels and lane tags are bookkeeping, not an owner edit.
				owner_edited: await fs
					.readFile(path.join(prior.dir, `candidate-${priorFinal}.md`), 'utf8')
					.then(
						(candidate) => editorialHash(candidate) !== editorialHash(live),
						() => true
					),
				prior_blockers: prior.state.blockers || [],
				started_at: now(),
				stages: {},
				baseline_sha256: sha256(priorBaseline),
				materialized_sha256: sha256(live),
				expanded: !!prior.state.expanded
			};
		}
		if (!state) {
			dir = path.join(logsRoot, timestamp());
			await fs.mkdir(dir);
			await fs.writeFile(path.join(dir, 'baseline.md'), live);
			state = {
				schema_version: 3,
				cache_version: 2,
				subject,
				mode: options.mode,
				started_at: now(),
				stages: {},
				baseline_sha256: sha256(live),
				materialized_sha256: live ? sha256(live) : null,
				expanded: options.expanded
			};
			// An earlier run's evidence and findings are paid-for work. A fresh run that
			// is not told what the last jury and verifier found tends to repeat it.
			const prior = await findRun(pointed, dir);
			if (prior) {
				for (const name of [
					'evidence-repair.json',
					'evidence-edit.json',
					'evidence-draft.json',
					'evidence.json'
				]) {
					if (await exists(path.join(prior.dir, name))) {
						await fs.copyFile(path.join(prior.dir, name), path.join(dir, 'prior-evidence.json'));
						break;
					}
				}
				const read = (/** @type {string} */ name) =>
					readJson(path.join(prior.dir, name)).catch(() => null);
				const verification =
					(await read('verification-repair.json')) || (await read('verification-edit.json'));
				const priorEvidence = await read('evidence.json');
				const reviewFindings = [];
				for (const name of (await fs.readdir(prior.dir)).filter((n) =>
					/^review-[a-z]+\.json$/.test(n)
				)) {
					const record = await read(name);
					for (const finding of record?.findings ?? [])
						if (finding.severity !== 'minor') reviewFindings.push(finding);
				}
				if (verification || reviewFindings.length || (prior.state.blockers || []).length)
					await writeJson(path.join(dir, 'prior-findings.json'), {
						from_run: path.relative(root, prior.dir),
						editorial_status: prior.state.editorial_status ?? null,
						blockers: prior.state.blockers || [],
						research_tasks: [
							...(priorEvidence?.research_tasks ?? []),
							...(verification?.research_tasks ?? [])
						],
						verifier_findings: verification?.findings ?? [],
						reviewer_findings: reviewFindings
					});
			}
		}
		// A reassessment compares the reader-visible article with what was verified
		// (below), so path labels and lane tags added since the run do not block it.
		if (options.mode !== 'reassess' && (live ? sha256(live) : null) !== state.materialized_sha256)
			throw new Error(
				'Draft changed outside this run. Use --reverify to re-check it as it stands, or --refresh to start over with it as the baseline.'
			);
		state.expanded ||= options.expanded;
		const save = () =>
			atomicWrite(path.join(dir, 'run.json'), JSON.stringify(state, null, 2) + '\n');
		const baseline = await fs.readFile(path.join(dir, 'baseline.md'), 'utf8');
		if (sha256(baseline) !== state.baseline_sha256) throw new Error('Baseline snapshot changed');
		// A re-verify keeps the publication state of the draft as it stands today; the
		// carried baseline may predate its first publish.
		const identity = matter(state.mode === 'reverify' ? live : baseline, {}).data;
		const isNew = state.mode === 'reverify' ? false : !baseline.trim();
		const baselineReader = path.join(dir, 'baseline-reader.md');
		const model = process.env.BLOG_PIPELINE_MODEL || process.env.ANTHROPIC_MODEL || null;
		const verifyModel = process.env.BLOG_PIPELINE_VERIFY_MODEL || model;
		const standardFile = path.join(root, 'docs/writing-system/people-profile-standard.md');
		const contractFile = path.join(root, 'scripts/lib/blogEditorial.js');
		const fingerprint = async (/** @type {Record<string, string>} */ files) =>
			Object.fromEntries(
				await Promise.all(
					Object.entries(files).map(async ([key, file]) => [key, sha256(await fs.readFile(file))])
				)
			);
		/** @param {string} markdown @param {{profile_format?: string, sources?: Array<{id: string, access?: string}>} | null} evidence */
		const machineChecks = (markdown, evidence) =>
			buildChecks({
				markdown,
				root,
				snapshotDir,
				format: profileFormat(evidence),
				sources: evidence?.sources
			});

		/**
		 * @param {string} id
		 * @param {string} command
		 * @param {Record<string, string>} inputs
		 * @param {string[]} outputNames
		 * @param {(outputs: Record<string, string>) => Promise<unknown>} validate
		 * @param {Record<string, any>} extra
		 */
		async function stage(id, command, inputs, outputNames, validate, extra = {}) {
			if (interrupted) throw new Error('Pipeline interrupted');
			const commandFile = path.join(root, `.claude/commands/blog_${command}_people_v3.md`);
			const outputs = Object.fromEntries(outputNames.map((name) => [name, path.join(dir, name)]));
			// A checkpoint is keyed on what the stage reads and the prompt it follows.
			// Settings files, this runner and the timeout used to be in the key, so
			// switching the default model, clicking "always allow" in another session,
			// or resuming with a longer timeout threw away hours of finished stages.
			const allInputs = {
				...inputs,
				command: commandFile,
				standard: standardFile,
				contract: contractFile
			};
			const stageModel = command === 'verify' ? verifyModel : model;
			const inputHashes = await fingerprint(allInputs);
			const cacheKey = sha256(JSON.stringify({ inputHashes, model: stageModel, extra }));
			const previous = state.stages[id];
			if (previous?.status === 'complete' && previous.cache_key === cacheKey) {
				const hashes = await fingerprint(outputs).catch(() => null);
				if (hashes && JSON.stringify(hashes) === JSON.stringify(previous.output_hashes)) {
					await validate(outputs);
					console.log(`[${id}] Reusing validated checkpoint`);
					return outputs;
				}
			}
			for (const file of Object.values(outputs)) await fs.rm(file, { force: true });
			await fs.mkdir(snapshotDir, { recursive: true });
			const requestFile = path.join(dir, `${id}.request.json`);
			await writeJson(requestFile, {
				schema_version: 3,
				subject,
				mode: state.mode,
				role: extra.role,
				root,
				command_file: commandFile,
				standard_file: standardFile,
				contract_file: contractFile,
				source_cache_dir: snapshotDir,
				inputs,
				outputs,
				...extra
			});
			const started = Date.now();
			state.stages[id] = {
				status: 'running',
				started_at: now(),
				cache_key: cacheKey,
				input_hashes: inputHashes,
				model: stageModel || 'CLI default'
			};
			state.current_stage = id;
			await save();
			console.log(`[${id}] Starting`);
			const transcriptFile = path.join(dir, `${id}.transcript.jsonl`);
			try {
				const executeOptions = {
					root,
					model: stageModel,
					timeoutSeconds: options.timeoutSeconds,
					transcriptFile,
					// Research at 80 hit the cap on refreshes with long baselines (Druski, Ben Shelton).
					// Verify at 60 ran out before re-reading 8 of ~50 sources (Dario Amodei, 2026-10-05).
					maxTurns: command === 'research' ? 120 : command === 'verify' ? 100 : 60
				};
				const meta = await execute(requestFile, path.join(dir, `${id}.log`), executeOptions);
				if (meta && typeof meta === 'object')
					Object.assign(state.stages[id], {
						model: meta.model || state.stages[id].model,
						turns: meta.turns,
						cost_usd: meta.cost_usd,
						...(meta.wrapped_up ? { wrapped_up_after: meta.wrapped_up } : {})
					});
				const checkOutputs = async () => {
					const after = await fingerprint(allInputs);
					const changed = Object.keys(inputHashes).filter((key) => after[key] !== inputHashes[key]);
					if (changed.length)
						throw new Error(
							`An input changed while the stage ran (${changed.join(', ')}), by this stage or a parallel session; rerun with --resume`
						);
					for (const file of Object.values(outputs).filter((file) => file.endsWith('.md'))) {
						await fs.writeFile(file, cleanReaderCopy(await fs.readFile(file, 'utf8')));
					}
					await validate(outputs);
				};
				try {
					await checkOutputs();
				} catch (problem) {
					// A finished stage whose files fail the runner's check used to end the
					// run, discarding the research and draft over one fixable field (Kate
					// Middleton, 2026-11-24: one claim anchored to YAML syntax). The session
					// still holds its work, so it gets one short resume to correct the files.
					const sessionId = meta && typeof meta === 'object' ? meta.session_id : null;
					if (!sessionId || /^An input changed/.test(errorMessage(problem))) throw problem;
					const detail = errorMessage(problem).slice(0, 2000);
					console.log(`[${id}] Output check failed; asking the stage to fix its files: ${detail}`);
					state.stages[id].output_fix = detail.slice(0, 300);
					await save();
					const fixed = await execute(requestFile, path.join(dir, `${id}.log`), {
						...executeOptions,
						fix: { sessionId, problem: detail }
					});
					if (fixed && typeof fixed === 'object')
						Object.assign(state.stages[id], {
							turns: (state.stages[id].turns ?? 0) + (fixed.turns ?? 0),
							cost_usd:
								Math.round(((state.stages[id].cost_usd ?? 0) + (fixed.cost_usd ?? 0)) * 100) / 100
						});
					await checkOutputs();
				}
				Object.assign(state.stages[id], {
					status: 'complete',
					output_hashes: await fingerprint(outputs)
				});
				// The readable log keeps the trace; the raw event stream is only worth
				// its size when something went wrong.
				if (!process.env.BLOG_PIPELINE_KEEP_TRANSCRIPTS)
					await fs.rm(transcriptFile, { force: true });
			} catch (error) {
				Object.assign(state.stages[id], { status: 'failed', error: errorMessage(error) });
				await fs.writeFile(path.join(dir, 'FAILED_AT_STAGE'), `${id}: ${errorMessage(error)}\n`);
				throw error;
			} finally {
				Object.assign(state.stages[id], {
					finished_at: now(),
					duration_seconds: Math.round((Date.now() - started) / 1000)
				});
				await fs.appendFile(
					path.join(dir, 'stage-summary.tsv'),
					`${id}\t${command}\t${state.stages[id].status === 'complete' ? 0 : 1}\t${state.stages[id].duration_seconds}s\n`
				);
				await save();
			}
			return outputs;
		}

		/** @param {string} editorialStatus @param {string[]} blockers @param {ReturnType<import('./lib/blogEditorial.js').calculateQuality> | null} quality */
		async function finish(editorialStatus, blockers, quality = null) {
			state.run_status = editorialStatus === 'eligible' ? 'completed' : 'held';
			state.editorial_status = editorialStatus;
			state.blockers = blockers;
			state.finished_at = now();
			const cost = Object.values(state.stages).reduce(
				(/** @type {number} */ sum, /** @type {any} */ s) => sum + (s.cost_usd || 0),
				0
			);
			state.cost_usd = Math.round(cost * 100) / 100;
			await save();
			await fs.rm(path.join(dir, 'FAILED_AT_STAGE'), { force: true });
			const advisory =
				editorialStatus === 'eligible' && !!quality && quality.overall < ADVISORY_OVERALL;
			await writeJson(path.join(dir, 'summary.json'), {
				...state,
				completed: true,
				person: subject,
				draft_path: draftPath,
				log_dir: dir,
				revised: !!state.stages.repair,
				final_overall: quality?.overall ?? null,
				final_discoverability: quality?.discoverability ?? null,
				score_advisory: advisory,
				perspective_final_status: editorialStatus === 'eligible' ? 'pass' : 'hold'
			});
			console.log(
				`Editorial status: ${editorialStatus}${quality ? ` (score ${quality.overall})` : ''}\n${blockers.join('\n')}\nArtifacts: ${dir}`
			);
			if (editorialStatus === 'eligible') {
				if (advisory)
					console.log(
						`Note: the score is below ${ADVISORY_OVERALL}. Every fact check passed, so it is released; give it a read before publishing.`
					);
				const type = matter(await fs.readFile(draftPath, 'utf8').catch(() => ''), {}).data
					.enneagram;
				console.log(
					`Next: export the portrait, then\n  ./scripts/prepare-personality-image.sh <portrait.png> ${type ?? '<type>'} ${subject}\n  node scripts/personBlogParser.js ${subject} --publish\nEverything waiting on you: pnpm people:ready`
				);
			} else if (editorialStatus === 'needs_revision')
				console.log(
					`To try one more repair and check: scripts/run-blog-pipeline.sh ${subject} --reverify (also the path after you edit the draft by hand)`
				);
			return { exitCode: editorialStatus === 'eligible' ? 0 : 2, dir, state };
		}

		/** @param {Record<string, string>} files @param {string} id @param {ReturnType<import('./lib/blogEditorial.js').calculateQuality> | null} [quality] */
		async function materialize(files, id, quality) {
			if (interrupted) throw new Error('Pipeline interrupted');
			const current = await fs.readFile(draftPath, 'utf8').catch(() => '');
			if ((current ? sha256(current) : null) !== state.materialized_sha256)
				throw new Error('Live draft changed during run; refusing to overwrite');
			const parsed = matter(await fs.readFile(files[`${id}.md`], 'utf8'), {});
			for (const key of ['date', 'lastmod', 'published', 'person', 'loc'])
				if (identity[key] !== undefined) parsed.data[key] = identity[key];
			if (isNew) parsed.data.published = false;
			parsed.data.editorial_workflow = { version: 3, run_dir: path.relative(root, dir) };
			delete parsed.data.content_quality;
			if (quality) parsed.data.content_quality = quality;
			if (quality && !quality.needs_review)
				parsed.data.production_pretext = readyPretext(parsed.data.production_pretext);
			// Models must resolve inherited blockers explicitly in resolution.json.
			const raw = matter.stringify(parsed.content, parsed.data);
			await atomicWrite(draftPath, raw);
			state.materialized_sha256 = sha256(raw);
			await save();
			return raw;
		}

		/** Everything fixed once the jury has reviewed the frozen draft.
		 * @returns {Promise<{frozen: string, draftEvidence: import('./lib/blogEditorial.js').Evidence, reviews: import('./lib/blogEditorial.js').Review[], reviewFiles: Record<string, string>, researchFile: string, draftFile: string, draftEvidenceFile: string}>} */
		async function loadJury() {
			const draftFile = path.join(dir, 'draft.md');
			const draftEvidenceFile = path.join(dir, 'evidence-draft.json');
			const frozen = await fs.readFile(draftFile, 'utf8');
			const draftEvidence = validateEvidence(await readJson(draftEvidenceFile), subject, frozen);
			/** @type {Record<string, string>} */
			const reviewFiles = {};
			const reviews = [];
			for (const name of (await fs.readdir(dir)).sort()) {
				const role = name.match(/^review-([a-z]+)\.json$/)?.[1];
				if (!role) continue;
				reviewFiles[`review-${role}`] = path.join(dir, name);
				reviews.push(reviewSchema.parse(await readJson(path.join(dir, name))));
			}
			return {
				frozen,
				draftEvidence,
				reviews,
				reviewFiles,
				researchFile: path.join(dir, 'evidence.json'),
				draftFile,
				draftEvidenceFile
			};
		}

		/**
		 * The release decision for one candidate. Shared by the full run, a
		 * re-verify and a reassessment.
		 * @param {{markdown: string, id: string, jury: Awaited<ReturnType<typeof loadJury>>, verificationFile: string, enforceMustFix: boolean}} input
		 */
		async function evaluate({ markdown, id, jury, verificationFile, enforceMustFix }) {
			const evidenceFile = path.join(dir, `evidence-${id}.json`);
			const resolutionFile = path.join(dir, `resolution-${id}.json`);
			const evidence = validateEvidence(await readJson(evidenceFile), subject, markdown);
			const verification = verificationSchema.parse(await readJson(verificationFile));
			let verdict = assessEditorial({
				subject,
				markdown,
				evidence,
				reviews: jury.reviews,
				resolution: await readJson(resolutionFile),
				verification,
				baseline,
				expanded: state.expanded,
				reviewedMarkdown: jury.frozen,
				reviewedEvidence: jury.draftEvidence
			});
			// Publisher and lint rules that postdate older releases are enforced here,
			// on new work, instead of inside the stored release decision.
			const checks = await machineChecks(markdown, evidence);
			if (enforceMustFix && checks.must_fix.length)
				verdict = {
					...verdict,
					eligible: false,
					blockers: [...verdict.blockers, ...checks.must_fix]
				};
			return {
				verdict,
				verification,
				evidence,
				checks,
				finalFiles: {
					baseline: path.join(dir, 'baseline.md'),
					research: jury.researchFile,
					draft: jury.draftFile,
					draft_evidence: jury.draftEvidenceFile,
					evidence: evidenceFile,
					resolution: resolutionFile,
					verification: verificationFile,
					...jury.reviewFiles
				}
			};
		}

		/** Write the release, confirm it validates, and close the run.
		 * @param {{id: string, result: Awaited<ReturnType<typeof evaluate>>}} input */
		async function release({ id, result }) {
			const { verdict, verification, finalFiles } = result;
			const files = { [`${id}.md`]: path.join(dir, `${id}.md`) };
			const markdown = await materialize(
				files,
				id,
				verdict.quality ? { ...verdict.quality, needs_review: !verdict.eligible } : null
			);
			if (!verdict.eligible) {
				await fs.rm(path.join(dir, 'release.json'), { force: true });
				return finish(
					verification.status === 'insufficient_evidence'
						? 'insufficient_evidence'
						: 'needs_revision',
					verdict.blockers,
					verdict.quality
				);
			}
			const hashes = await fingerprint(finalFiles);
			await writeJson(path.join(dir, 'release.json'), {
				schema_version: 3,
				subject,
				content_sha256: editorialHash(markdown),
				expanded: state.expanded,
				artifacts: Object.fromEntries(
					Object.entries(finalFiles).map(([key, file]) => [
						key,
						{ file: path.basename(file), sha256: hashes[key] }
					])
				)
			});
			const status = await getEditorialPublishStatus(draftPath, root);
			if (!status.valid)
				return finish(
					'needs_revision',
					[status.blocker || 'Editorial release failed'],
					verdict.quality
				);
			return finish('eligible', [], verdict.quality);
		}

		// ── Reassess: no model calls ────────────────────────────────────────────
		if (options.mode === 'reassess') {
			const id = (await exists(path.join(dir, 'verification-repair.json'))) ? 'repair' : 'edit';
			const verificationFile = path.join(dir, `verification-${id}.json`);
			for (const name of [`${id}.md`, `evidence-${id}.json`, `resolution-${id}.json`])
				if (!(await exists(path.join(dir, name))) || !(await exists(verificationFile)))
					throw new Error(
						'That run never reached verification; use --resume, --reverify or --refresh'
					);
			const verified = verificationSchema.parse(await readJson(verificationFile));
			if (!matchesEditorialHash(live, verified.content_sha256)) {
				console.log(
					`Reassessment of ${path.relative(root, dir)}: the article was edited after it was verified. Use --reverify to repair and re-check it as it stands.`
				);
				return { exitCode: 2, dir, state };
			}
			const result = await evaluate({
				markdown: live,
				id,
				jury: await loadJury(),
				verificationFile,
				enforceMustFix: false
			});
			for (const note of result.checks.must_fix) console.log(`Warning: ${note}`);
			const { verdict } = result;
			if (options.dryRun || !verdict.eligible || !verdict.quality) {
				console.log(
					`Reassessment of ${path.relative(root, dir)}: ${verdict.eligible ? 'would pass' : 'still held'}${verdict.quality ? ` (score ${verdict.quality.overall})` : ''}\n${verdict.blockers.join('\n')}`
				);
				return { exitCode: verdict.eligible ? 0 : 2, dir, state };
			}
			// Update the draft where it stands instead of rebuilding it from the run's
			// output, which would drop path labels and lane tags added since.
			const parsed = matter(live, {});
			parsed.data.editorial_workflow = { version: 3, run_dir: path.relative(root, dir) };
			parsed.data.content_quality = { ...verdict.quality, needs_review: false };
			parsed.data.production_pretext = readyPretext(parsed.data.production_pretext);
			const raw = matter.stringify(parsed.content, parsed.data);
			await atomicWrite(draftPath, raw);
			state.materialized_sha256 = sha256(raw);
			state.reassessed_at = now();
			const hashes = await fingerprint(result.finalFiles);
			await writeJson(path.join(dir, 'release.json'), {
				schema_version: 3,
				subject,
				content_sha256: editorialHash(raw),
				expanded: state.expanded,
				artifacts: Object.fromEntries(
					Object.entries(result.finalFiles).map(([key, file]) => [
						key,
						{ file: path.basename(file), sha256: hashes[key] }
					])
				)
			});
			const status = await getEditorialPublishStatus(draftPath, root);
			if (!status.valid) {
				// Leave the draft as it was found rather than half-released.
				await atomicWrite(draftPath, live);
				state.materialized_sha256 = sha256(live);
				await fs.rm(path.join(dir, 'release.json'), { force: true });
				console.log(`Reassessment could not cut a valid release: ${status.blocker}`);
				return { exitCode: 2, dir, state };
			}
			return await finish('eligible', [], verdict.quality);
		}

		state.run_status = 'running';
		state.editorial_status = 'pending';
		await save();
		await fs.writeFile(baselineReader, cleanReaderCopy(baseline));

		/** @param {string} id @param {Record<string, string>} inputs @param {Record<string, any>} [extra] */
		async function edit(id, inputs, extra = {}) {
			return stage(
				id,
				'edit',
				inputs,
				[`${id}.md`, `evidence-${id}.json`, `resolution-${id}.json`],
				async (o) => {
					validateEvidence(
						await readJson(o[`evidence-${id}.json`]),
						subject,
						await fs.readFile(o[`${id}.md`], 'utf8')
					);
					resolutionSchema.parse(await readJson(o[`resolution-${id}.json`]));
				},
				extra
			);
		}

		/**
		 * Verify the candidate; allow one targeted repair and a second verification.
		 * @param {{edited: Record<string, string>, id: string, repairsLeft: number, jury: Awaited<ReturnType<typeof loadJury>>, editInputs: Record<string, string>}} input
		 */
		async function verifyAndRelease({ edited, id, repairsLeft, jury, editInputs }) {
			for (;;) {
				const markdown = await materialize(edited, id);
				const candidate = path.join(dir, `candidate-${id}.md`);
				await fs.writeFile(candidate, markdown);
				const evidence = validateEvidence(
					await readJson(edited[`evidence-${id}.json`]),
					subject,
					markdown
				);
				const checksFile = path.join(dir, `checks-${id}.json`);
				await writeJson(checksFile, await machineChecks(markdown, evidence));
				const verifyName = `verification-${id}.json`;
				const verifyFiles = await stage(
					`verify-${id}`,
					'verify',
					{
						draft: candidate,
						evidence: edited[`evidence-${id}.json`],
						resolution: edited[`resolution-${id}.json`],
						...jury.reviewFiles,
						baseline: baselineReader,
						checks: checksFile
					},
					[verifyName],
					async (o) => verificationSchema.parse(await readJson(o[verifyName])),
					{
						content_sha256: editorialHash(markdown),
						evidence_sha256: sha256(JSON.stringify(evidence))
					}
				);
				const result = await evaluate({
					markdown,
					id,
					jury,
					verificationFile: verifyFiles[verifyName],
					enforceMustFix: true
				});
				const { verdict, verification } = result;
				if (
					verdict.eligible ||
					verdict.blockers.some((blocker) => blocker.startsWith('review_scope_changed:')) ||
					verification.status === 'insufficient_evidence' ||
					evidence.status === 'insufficient_evidence' ||
					repairsLeft <= 0
				)
					return release({ id, result });
				repairsLeft--;
				await writeJson(path.join(dir, 'repair-findings.json'), {
					...verdict,
					machine_checks: result.checks
				});
				edited = await edit('repair', {
					...editInputs,
					draft: candidate,
					evidence: edited[`evidence-${id}.json`],
					resolution: edited[`resolution-${id}.json`],
					verification: verifyFiles[verifyName],
					checks: path.join(dir, 'repair-findings.json')
				});
				id = 'repair';
			}
		}

		// ── Re-verify: one repair on the draft as it stands, then verification ──
		if (state.mode === 'reverify') {
			const jury = await loadJury();
			const priorEvidence = await readJson(path.join(dir, 'prior-evidence-final.json'));
			const findingsFile = path.join(dir, 'repair-findings.json');
			if (!(await exists(findingsFile)))
				await writeJson(findingsFile, {
					reverify: true,
					owner_edited: state.owner_edited,
					blockers: state.prior_blockers,
					machine_checks: await machineChecks(live, priorEvidence)
				});
			/** @type {Record<string, string>} */
			const inputs = {
				draft: path.join(dir, 'owner-draft.md'),
				evidence: path.join(dir, 'prior-evidence-final.json'),
				resolution: path.join(dir, 'prior-resolution.json'),
				...jury.reviewFiles,
				baseline: baselineReader,
				checks: findingsFile
			};
			if (await exists(path.join(dir, 'prior-verification.json')))
				inputs.verification = path.join(dir, 'prior-verification.json');
			const edited = await edit('repair', inputs, {
				reverify: true,
				owner_edited: state.owner_edited
			});
			return await verifyAndRelease({
				edited,
				id: 'repair',
				repairsLeft: 0,
				jury,
				editInputs: inputs
			});
		}

		// ── Full run ────────────────────────────────────────────────────────────
		/** @type {Record<string, string>} */
		const researchInputs = { baseline: baselineReader };
		const researchNotes = path.join(root, 'docs/content-analysis/research', `${subject}.md`);
		if (await exists(researchNotes)) researchInputs.research_notes = researchNotes;
		for (const [key, name] of [
			['prior_evidence', 'prior-evidence.json'],
			['prior_findings', 'prior-findings.json']
		])
			if (await exists(path.join(dir, name))) researchInputs[key] = path.join(dir, name);
		const research = await stage(
			'research',
			'research',
			researchInputs,
			['evidence.json'],
			async (o) => validateEvidence(await readJson(o['evidence.json']), subject)
		);
		const researchEvidence = validateEvidence(await readJson(research['evidence.json']), subject);
		if (researchEvidence.status !== 'ready')
			return await finish('insufficient_evidence', researchEvidence.research_tasks);
		// A later artifact cannot silently downgrade risks identified in research.
		const previousType = matter(baseline, {}).data.enneagram;
		state.expanded ||=
			requiredRoles(researchEvidence).length === EXPANDED_ROLES.length ||
			(previousType !== undefined &&
				Number(previousType) !== researchEvidence.type_hypothesis.type);
		await save();
		const draft = await stage(
			'draft',
			'draft',
			{ baseline: baselineReader, evidence: research['evidence.json'] },
			['draft.md', 'evidence-draft.json'],
			async (o) =>
				validateEvidence(
					await readJson(o['evidence-draft.json']),
					subject,
					await fs.readFile(o['draft.md'], 'utf8')
				)
		);
		const frozen = await fs.readFile(draft['draft.md'], 'utf8');
		const draftEvidence = validateEvidence(
			await readJson(draft['evidence-draft.json']),
			subject,
			frozen
		);
		const draftChecks = path.join(dir, 'draft-checks.json');
		await writeJson(draftChecks, await machineChecks(frozen, draftEvidence));
		/** @type {Record<string, string>} */
		const reviewInputs = {
			draft: draft['draft.md'],
			evidence: draft['evidence-draft.json'],
			checks: draftChecks
		};
		const similarityFile = path.join(dir, 'similarity.json');
		const scanner = path.join(root, 'scripts/same-type-similarity.mjs');
		if (await exists(scanner)) {
			try {
				const { stdout } = await promisify(execFile)(
					process.execPath,
					[scanner, draft['draft.md'], '--json'],
					{ cwd: root, timeout: 60000, maxBuffer: 8 * 1024 * 1024 }
				);
				await writeJson(similarityFile, JSON.parse(stdout));
			} catch (error) {
				await writeJson(similarityFile, { advisory_unavailable: errorMessage(error) });
			}
		} else
			await writeJson(similarityFile, {
				advisory_unavailable: 'Scanner is not installed in this workspace'
			});
		reviewInputs.similarity = similarityFile;
		const reviewExtra = {
			content_sha256: editorialHash(frozen),
			evidence_sha256: sha256(JSON.stringify(draftEvidence))
		};
		/** @type {import('./lib/blogEditorial.js').Review[]} */
		const reviews = [];
		/** @param {string} role */
		async function review(role) {
			const name = `review-${role}.json`;
			const output = await stage(
				`review-${role}`,
				'review',
				reviewInputs,
				[name],
				async (o) => {
					const r = reviewSchema.parse(await readJson(o[name]));
					if (
						r.role !== role ||
						!matchesEditorialHash(frozen, r.content_sha256) ||
						r.evidence_sha256 !== reviewExtra.evidence_sha256
					)
						throw new Error('Review does not match frozen inputs');
				},
				{ ...reviewExtra, role }
			);
			reviews.push(await readJson(output[name]));
		}
		// The six-role jury used to replace the evidence reviewer, so on nearly every
		// run nobody reopened a source until the final verification, with one repair
		// left. The evidence reviewer now sits on the full jury as well.
		/** @param {Array<{risks: import('./lib/blogEditorial.js').Evidence['risks']}>} seen */
		const jurors = (seen) => {
			const roles = requiredRoles(draftEvidence, seen, state.expanded);
			return roles.length === EXPANDED_ROLES.length ? ['evidence', ...roles] : roles;
		};
		// Separate sessions see only the same frozen draft and evidence. Sequential
		// execution avoids one failed concurrent reviewer leaving orphan work.
		for (const role of jurors([])) await review(role);
		for (const role of jurors(reviews))
			if (!reviews.some((r) => r.role === role)) await review(role);
		const jury = await loadJury();
		const editInputs = {
			...reviewInputs,
			...jury.reviewFiles,
			baseline: baselineReader
		};
		const edited = await edit('edit', editInputs);
		return await verifyAndRelease({ edited, id: 'edit', repairsLeft: 1, jury, editInputs });
	} catch (error) {
		if (state && dir && !(options.mode === 'reassess')) {
			state.run_status = 'failed';
			state.editorial_status = 'pending';
			state.error = errorMessage(error);
			await fs.writeFile(
				path.join(dir, 'FAILED_AT_STAGE'),
				`${state.current_stage || 'setup'}: ${errorMessage(error)}\n`
			);
			await writeJson(path.join(dir, 'run.json'), state);
			await writeJson(path.join(dir, 'summary.json'), {
				...state,
				completed: false,
				person: subject,
				draft_path: draftPath,
				log_dir: dir
			});
		}
		throw error;
	} finally {
		stopChildren();
		process.off('SIGTERM', onSignal);
		process.off('SIGINT', onSignal);
		await fs.rm(lock, { recursive: true, force: true });
	}
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	try {
		const options = parseArgs(process.argv.slice(2));
		const problems =
			options.preflight && options.mode !== 'reassess' && !process.env.BLOG_PIPELINE_CLAUDE
				? await preflight()
				: [];
		if (problems.length) {
			console.error(
				`Preflight failed; nothing was attempted.\n${problems.join('\n')}\n(--skip-preflight overrides.)`
			);
			process.exitCode = 3;
		} else process.exitCode = (await runPipeline(options)).exitCode;
	} catch (error) {
		console.error(`Pipeline failed: ${errorMessage(error)}`);
		process.exitCode = 1;
	}
}
