#!/usr/bin/env node
// scripts/run-blog-pipeline.mjs
// Six ordinary model calls: research, draft, two reviews, edit, verify.
import { promises as fs, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { homedir } from 'node:os';
import matter from 'gray-matter';
import {
	sha256,
	editorialHash,
	evidenceSchema,
	reviewSchema,
	resolutionSchema,
	verificationSchema,
	validateEvidence,
	requiredRoles,
	checkDraft,
	assessEditorial,
	getEditorialPublishStatus,
	readJson,
	writeJson,
	atomicWrite,
	errorMessage,
	cleanReaderCopy
} from './lib/blogEditorial.js';

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

/** @param {string[]} args */
export function parseArgs(args) {
	const options = { mode: 'create', expanded: false, timeoutSeconds: 2700, subject: '' };
	for (const arg of args) {
		if (arg === '--resume' || arg === '--refresh') {
			if (options.mode !== 'create') throw new Error('Choose either --resume or --refresh');
			options.mode = arg.slice(2);
		} else if (arg === '--expanded-review') options.expanded = true;
		else if (arg.startsWith('--stage-timeout-seconds='))
			options.timeoutSeconds = Number(arg.split('=')[1]);
		else if (!options.subject && /^[\p{L}\p{N}][\p{L}\p{N}.'’ -]*$/u.test(arg))
			options.subject = arg.trim().replace(/\s+/g, '-');
		else throw new Error(`Unknown or invalid argument: ${arg}`);
	}
	if (!options.subject || !Number.isFinite(options.timeoutSeconds) || options.timeoutSeconds <= 0)
		throw new Error(
			'Usage: scripts/run-blog-pipeline.sh Person [--resume | --refresh] [--expanded-review] [--stage-timeout-seconds=2700]'
		);
	return options;
}

/**
 * @param {string} requestFile
 * @param {string} logFile
 * @param {{root: string, model?: string | null, maxTurns: number, timeoutSeconds: number}} options
 * @returns {Promise<void>}
 */
export async function executeClaude(requestFile, logFile, options) {
	const log = createWriteStream(logFile, { flags: 'a' });
	const prompt = `Read ${requestFile}. It is the complete stage request. Read its command_file and standard_file, then complete only this stage. Write the requested output files. Do not modify any other files or publish anything.`;
	return new Promise((resolve, reject) => {
		const child = spawn(
			process.env.BLOG_PIPELINE_CLAUDE || 'claude',
			[
				'-p',
				prompt,
				'--dangerously-skip-permissions',
				'--max-turns',
				String(options.maxTurns),
				...(options.model ? ['--model', options.model] : [])
			],
			{ cwd: options.root, detached: true, stdio: ['ignore', 'pipe', 'pipe'] }
		);
		children.add(child);
		let timedOut = false;
		/** @type {ReturnType<typeof setTimeout> | undefined} */
		let killTimer;
		let finished = false;
		const timer = setTimeout(() => {
			timedOut = true;
			killGroup(child);
			killTimer = setTimeout(() => killGroup(child, 'SIGKILL'), 3000);
		}, options.timeoutSeconds * 1000);
		child.stdout.on('data', (chunk) => {
			log.write(chunk);
			process.stdout.write(chunk);
		});
		child.stderr.on('data', (chunk) => {
			log.write(chunk);
			process.stderr.write(chunk);
		});
		const finish = (/** @type {unknown} */ error) => {
			if (finished) return;
			finished = true;
			clearTimeout(timer);
			clearTimeout(killTimer);
			killGroup(child, 'SIGKILL');
			children.delete(child);
			log.end(() => (error ? reject(error) : resolve()));
		};
		child.once('error', finish);
		child.once('close', (code, signal) =>
			finish(
				timedOut
					? new Error('Stage timed out')
					: code === 0
						? null
						: new Error(`Claude exited ${code ?? signal}`)
			)
		);
	});
}

/** @param {ReturnType<typeof parseArgs>} options @param {{root?: string, execute?: typeof executeClaude}} dependencies */
export async function runPipeline(options, { root = repoRoot, execute = executeClaude } = {}) {
	const logsRoot = path.join(root, 'docs/content-analysis/pipeline-logs');
	const draftsRoot = path.join(root, 'src/blog/people/drafts');
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
		throw new Error('Draft exists; use --refresh or --resume');
	if (options.mode === 'refresh' && !matches.length)
		throw new Error('Refresh requires an existing draft');
	const lock = path.join(logsRoot, '.pipeline.lock');
	try {
		await fs.mkdir(lock);
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'EEXIST') throw error;
		const pid = Number(await fs.readFile(path.join(lock, 'pid'), 'utf8').catch(() => ''));
		if (!pid) throw new Error('Pipeline lock has no PID; inspect it before removing it');
		try {
			process.kill(pid, 0);
			throw new Error(`Pipeline already running (PID ${pid})`);
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
		}
		if (!state) {
			dir = path.join(
				logsRoot,
				`${now().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')}_${subject}`
			);
			await fs.mkdir(dir);
			const baseline = await fs.readFile(draftPath, 'utf8').catch(() => '');
			await fs.writeFile(path.join(dir, 'baseline.md'), baseline);
			state = {
				schema_version: 3,
				subject,
				mode: options.mode,
				started_at: now(),
				stages: {},
				baseline_sha256: sha256(baseline),
				materialized_sha256: baseline ? sha256(baseline) : null,
				expanded: options.expanded
			};
		}
		const live = await fs.readFile(draftPath, 'utf8').catch(() => '');
		if ((live ? sha256(live) : null) !== state.materialized_sha256)
			throw new Error(
				'Draft changed outside this run. Use --refresh to preserve and review those changes.'
			);
		state.expanded ||= options.expanded;
		const save = () =>
			atomicWrite(path.join(dir, 'run.json'), JSON.stringify(state, null, 2) + '\n');
		const baseline = await fs.readFile(path.join(dir, 'baseline.md'), 'utf8');
		if (sha256(baseline) !== state.baseline_sha256) throw new Error('Baseline snapshot changed');
		const baselineReader = path.join(dir, 'baseline-reader.md');
		await fs.writeFile(baselineReader, cleanReaderCopy(baseline));
		const priorEvidence = path.join(dir, 'prior-evidence.json');
		const previousWorkflow = matter(baseline, {}).data.editorial_workflow;
		if (
			previousWorkflow?.version === 3 &&
			typeof previousWorkflow.run_dir === 'string' &&
			!(await exists(priorEvidence))
		) {
			const previousDir = path.resolve(root, previousWorkflow.run_dir);
			if (previousDir.startsWith(logsRoot + path.sep)) {
				for (const name of [
					'evidence-repair.json',
					'evidence-edit.json',
					'evidence-draft.json',
					'evidence.json'
				]) {
					if (await exists(path.join(previousDir, name))) {
						await fs.copyFile(path.join(previousDir, name), priorEvidence);
						break;
					}
				}
			}
		}
		const model = process.env.BLOG_PIPELINE_MODEL || process.env.ANTHROPIC_MODEL || null;
		const standardFile = path.join(root, 'docs/writing-system/people-profile-standard.md');
		const contractFile = path.join(root, 'scripts/lib/blogEditorial.js');
		/** @type {Record<string, string>} */
		const configurationFiles = {};
		for (const [key, file] of Object.entries({
			project_instructions: path.join(root, 'CLAUDE.md'),
			project_settings: path.join(root, '.claude/settings.json'),
			project_local_settings: path.join(root, '.claude/settings.local.json'),
			user_settings: path.join(homedir(), '.claude/settings.json')
		}))
			if (await exists(file)) configurationFiles[key] = file;
		const fingerprint = async (/** @type {Record<string, string>} */ files) =>
			Object.fromEntries(
				await Promise.all(
					Object.entries(files).map(async ([key, file]) => [key, sha256(await fs.readFile(file))])
				)
			);
		state.run_status = 'running';
		state.editorial_status = 'pending';
		await save();
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
			const allInputs = {
				...inputs,
				...configurationFiles,
				command: commandFile,
				standard: standardFile,
				contract: contractFile,
				runner: path.join(root, 'scripts/run-blog-pipeline.mjs')
			};
			const inputHashes = await fingerprint(allInputs);
			const cacheKey = sha256(
				JSON.stringify({
					inputHashes,
					model,
					cli: process.env.BLOG_PIPELINE_CLAUDE || 'claude',
					extra,
					timeout: options.timeoutSeconds
				})
			);
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
				model: model || 'CLI default'
			};
			state.current_stage = id;
			await save();
			console.log(`[${id}] Starting`);
			try {
				await execute(requestFile, path.join(dir, `${id}.log`), {
					root,
					model,
					timeoutSeconds: options.timeoutSeconds,
					maxTurns: command === 'research' ? 80 : 60
				});
				if (JSON.stringify(await fingerprint(allInputs)) !== JSON.stringify(inputHashes))
					throw new Error('Stage modified a read-only input');
				for (const file of Object.values(outputs).filter((file) => file.endsWith('.md'))) {
					await fs.writeFile(file, cleanReaderCopy(await fs.readFile(file, 'utf8')));
				}
				await validate(outputs);
				Object.assign(state.stages[id], {
					status: 'complete',
					output_hashes: await fingerprint(outputs)
				});
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
			await save();
			await fs.rm(path.join(dir, 'FAILED_AT_STAGE'), { force: true });
			await writeJson(path.join(dir, 'summary.json'), {
				...state,
				completed: true,
				person: subject,
				draft_path: draftPath,
				log_dir: dir,
				revised: !!state.stages.repair,
				final_overall: quality?.overall ?? null,
				final_discoverability: quality?.discoverability ?? null,
				perspective_final_status: editorialStatus === 'eligible' ? 'pass' : 'hold'
			});
			console.log(
				`Editorial status: ${editorialStatus}\n${blockers.join('\n')}\nArtifacts: ${dir}`
			);
			return { exitCode: editorialStatus === 'eligible' ? 0 : 2, dir, state };
		}
		/** @type {Record<string, string>} */
		const researchInputs = { baseline: baselineReader };
		const researchNotes = path.join(root, 'docs/content-analysis/research', `${subject}.md`);
		if (await exists(researchNotes)) researchInputs.research_notes = researchNotes;
		if (await exists(priorEvidence)) researchInputs.prior_evidence = priorEvidence;
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
			requiredRoles(researchEvidence).length === 6 ||
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
		await writeJson(path.join(dir, 'draft-checks.json'), checkDraft(frozen));
		/** @type {Record<string, string>} */
		const reviewInputs = { draft: draft['draft.md'], evidence: draft['evidence-draft.json'] };
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
		/** @type {Record<string, string>} */
		const reviewFiles = {};
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
						r.content_sha256 !== reviewExtra.content_sha256 ||
						r.evidence_sha256 !== reviewExtra.evidence_sha256
					)
						throw new Error('Review does not match frozen inputs');
				},
				{ ...reviewExtra, role }
			);
			reviewFiles[`review-${role}`] = output[name];
			reviews.push(await readJson(output[name]));
		}
		// Separate sessions see only the same frozen draft and evidence. Sequential
		// execution avoids one failed concurrent reviewer leaving orphan work.
		for (const role of requiredRoles(draftEvidence, [], state.expanded)) await review(role);
		for (const role of requiredRoles(draftEvidence, reviews, state.expanded))
			if (!reviews.some((r) => r.role === role)) await review(role);
		/** @param {string} id @param {Record<string, string>} inputs */
		async function edit(id, inputs) {
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
				}
			);
		}
		const editInputs = {
			...reviewInputs,
			...reviewFiles,
			baseline: baselineReader,
			checks: path.join(dir, 'draft-checks.json')
		};
		let edited = await edit('edit', editInputs),
			finalId = 'edit';
		/** @param {Record<string, string>} files @param {string} id @param {ReturnType<import('./lib/blogEditorial.js').calculateQuality> | null} [quality] */
		async function materialize(files, id, quality) {
			if (interrupted) throw new Error('Pipeline interrupted');
			const current = await fs.readFile(draftPath, 'utf8').catch(() => '');
			if ((current ? sha256(current) : null) !== state.materialized_sha256)
				throw new Error('Live draft changed during run; refusing to overwrite');
			const parsed = matter(await fs.readFile(files[`${id}.md`], 'utf8'), {});
			const original = matter(baseline, {}).data;
			for (const key of ['date', 'lastmod', 'published', 'person', 'loc'])
				if (original[key] !== undefined) parsed.data[key] = original[key];
			if (!baseline.trim()) parsed.data.published = false;
			parsed.data.editorial_workflow = { version: 3, run_dir: path.relative(root, dir) };
			delete parsed.data.content_quality;
			if (quality) parsed.data.content_quality = quality;
			if (quality && !quality.needs_review) {
				parsed.data.production_pretext = {
					...parsed.data.production_pretext,
					status: 'ready',
					handoff_from: 'blog_pipeline_v3',
					reviewed: true,
					ready_for_production: true,
					sync_mode: 'full',
					requires: ['db_sync', 'db_verify', 'regenerate_famous_types', 'image_check'],
					blockers: []
				};
			}
			// Models must resolve inherited blockers explicitly in resolution.json.
			const raw = matter.stringify(parsed.content, parsed.data);
			await atomicWrite(draftPath, raw);
			state.materialized_sha256 = sha256(raw);
			await save();
			return raw;
		}
		let markdown = '';
		/** @type {import('./lib/blogEditorial.js').Verification | undefined} */
		let verification;
		/** @type {ReturnType<typeof assessEditorial> | undefined} */
		let verdict;
		/** @type {Record<string, string> | undefined} */
		let finalFiles;
		for (let attempt = 0; attempt < 2; attempt++) {
			markdown = await materialize(edited, finalId);
			const candidate = path.join(dir, `candidate-${finalId}.md`);
			await fs.writeFile(candidate, markdown);
			const evidence = validateEvidence(
				await readJson(edited[`evidence-${finalId}.json`]),
				subject,
				markdown
			);
			const checks = path.join(dir, `checks-${finalId}.json`);
			await writeJson(checks, checkDraft(markdown));
			const verifyName = `verification-${finalId}.json`;
			const verifyFiles = await stage(
				`verify-${finalId}`,
				'verify',
				{
					draft: candidate,
					evidence: edited[`evidence-${finalId}.json`],
					resolution: edited[`resolution-${finalId}.json`],
					...reviewFiles,
					baseline: baselineReader,
					checks
				},
				[verifyName],
				async (o) => verificationSchema.parse(await readJson(o[verifyName])),
				{
					content_sha256: editorialHash(markdown),
					evidence_sha256: sha256(JSON.stringify(evidence))
				}
			);
			verification = verificationSchema.parse(await readJson(verifyFiles[verifyName]));
			verdict = assessEditorial({
				subject,
				markdown,
				evidence,
				reviews,
				resolution: await readJson(edited[`resolution-${finalId}.json`]),
				verification,
				baseline,
				expanded: state.expanded,
				reviewedMarkdown: frozen,
				reviewedEvidence: draftEvidence
			});
			finalFiles = {
				baseline: path.join(dir, 'baseline.md'),
				research: research['evidence.json'],
				draft: draft['draft.md'],
				draft_evidence: draft['evidence-draft.json'],
				evidence: edited[`evidence-${finalId}.json`],
				resolution: edited[`resolution-${finalId}.json`],
				verification: verifyFiles[verifyName],
				...reviewFiles
			};
			if (
				verdict.eligible ||
				verdict.blockers.some((blocker) => blocker.startsWith('review_scope_changed:')) ||
				verification.status === 'insufficient_evidence' ||
				evidence.status === 'insufficient_evidence' ||
				attempt === 1
			)
				break;
			await writeJson(path.join(dir, 'repair-findings.json'), verdict);
			edited = await edit('repair', {
				...editInputs,
				draft: candidate,
				evidence: edited[`evidence-${finalId}.json`],
				resolution: edited[`resolution-${finalId}.json`],
				verification: verifyFiles[verifyName],
				checks: path.join(dir, 'repair-findings.json')
			});
			finalId = 'repair';
		}
		if (!verdict || !verification || !finalFiles)
			throw new Error('No final evaluation was produced');
		await materialize(
			edited,
			finalId,
			verdict.quality ? { ...verdict.quality, needs_review: !verdict.eligible } : null
		);
		if (!verdict.eligible) {
			await fs.rm(path.join(dir, 'release.json'), { force: true });
			return await finish(
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
		const release = await getEditorialPublishStatus(draftPath, root);
		if (!release.valid)
			return await finish(
				'needs_revision',
				[release.blocker || 'Editorial release failed'],
				verdict.quality
			);
		return await finish('eligible', [], verdict.quality);
	} catch (error) {
		if (state && dir) {
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
		process.exitCode = (await runPipeline(parseArgs(process.argv.slice(2)))).exitCode;
	} catch (error) {
		console.error(`Pipeline failed: ${errorMessage(error)}`);
		process.exitCode = 1;
	}
}
