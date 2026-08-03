// scripts/check-marketing-content-queue.mjs
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const queuePath = path.join(repositoryRoot, 'docs', 'marketing', 'content-ops', 'queue.json');

const statusOrder = [
	'captured',
	'triaged',
	'briefed',
	'copy_ready',
	'design_ready',
	'rendered',
	'qa',
	'approved',
	'scheduled',
	'published',
	'measured'
];
const allowedStatuses = new Set([...statusOrder, 'blocked']);
const requiredItemFields = [
	'id',
	'title',
	'channel',
	'format',
	'campaign',
	'pillar',
	'status',
	'priority',
	'source_paths',
	'asset_paths',
	'owner',
	'next_action',
	'risk_flags',
	'learnings'
];

const jsonOutput = process.argv.includes('--json');
const strict = process.argv.includes('--strict');

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const errors = [];
const seenIds = new Set();

if (!queue.targets || !Array.isArray(queue.items)) {
	errors.push('Queue must contain targets and items.');
}

for (const [index, item] of (queue.items ?? []).entries()) {
	for (const field of requiredItemFields) {
		if (!(field in item))
			errors.push(`items[${index}] (${item.id ?? 'unknown'}) is missing ${field}.`);
	}

	if (seenIds.has(item.id)) errors.push(`Duplicate queue id: ${item.id}.`);
	seenIds.add(item.id);

	if (!allowedStatuses.has(item.status)) {
		errors.push(`${item.id}: unknown status ${item.status}.`);
	}

	for (const sourcePath of item.source_paths ?? []) {
		if (!fs.existsSync(path.join(repositoryRoot, sourcePath))) {
			errors.push(`${item.id}: missing source path ${sourcePath}.`);
		}
	}

	for (const assetPath of item.asset_paths ?? []) {
		if (!fs.existsSync(path.join(repositoryRoot, assetPath))) {
			errors.push(`${item.id}: missing asset path ${assetPath}.`);
		}
	}

	if (item.target_date && !/^\d{4}-\d{2}-\d{2}$/.test(item.target_date)) {
		errors.push(`${item.id}: target_date must be YYYY-MM-DD or null.`);
	}
}

const instagramItems = (queue.items ?? []).filter((item) => item.channel === 'instagram');
const counts = Object.fromEntries([...allowedStatuses].map((status) => [status, 0]));
for (const item of instagramItems) counts[item.status] += 1;

const indexOf = (status) => statusOrder.indexOf(status);
const isAtLeast = (item, status) =>
	item.status !== 'blocked' && indexOf(item.status) >= indexOf(status);

const approvedOrScheduled = instagramItems.filter((item) =>
	['approved', 'scheduled'].includes(item.status)
).length;
const copyReadyOrLater = instagramItems.filter(
	(item) => isAtLeast(item, 'copy_ready') && !['published', 'measured'].includes(item.status)
).length;
const triagedOrLater = instagramItems.filter(
	(item) => isAtLeast(item, 'triaged') && !['published', 'measured'].includes(item.status)
).length;
const designReady = counts.design_ready;
const inQa = counts.qa;

const health =
	approvedOrScheduled >= 15
		? 'green'
		: approvedOrScheduled >= queue.targets.minimum_approved_or_scheduled
			? 'yellow'
			: 'red';

const summary = {
	queue: path.relative(repositoryRoot, queuePath),
	updated_at: queue.updated_at,
	health,
	instagram_items: instagramItems.length,
	approved_or_scheduled: approvedOrScheduled,
	approved_or_scheduled_floor: queue.targets.minimum_approved_or_scheduled,
	copy_ready_or_later: copyReadyOrLater,
	copy_ready_or_later_floor: queue.targets.minimum_copy_ready_or_later,
	triaged_or_later: triagedOrLater,
	triaged_or_later_floor: queue.targets.minimum_triaged_or_later,
	design_ready: designReady,
	design_ready_cap: queue.targets.maximum_design_ready,
	qa: inQa,
	qa_cap: queue.targets.maximum_qa,
	counts,
	errors
};

if (jsonOutput) {
	console.log(JSON.stringify(summary, null, 2));
} else {
	console.log(`Marketing content runway: ${health.toUpperCase()}`);
	console.log(
		`Approved/scheduled: ${approvedOrScheduled}/${queue.targets.minimum_approved_or_scheduled}`
	);
	console.log(
		`Copy-ready or later: ${copyReadyOrLater}/${queue.targets.minimum_copy_ready_or_later}`
	);
	console.log(`Triaged or later: ${triagedOrLater}/${queue.targets.minimum_triaged_or_later}`);
	console.log(`Design-ready WIP: ${designReady}/${queue.targets.maximum_design_ready}`);
	console.log(`QA WIP: ${inQa}/${queue.targets.maximum_qa}`);
	console.log(
		`States: ${Object.entries(counts)
			.filter(([, count]) => count > 0)
			.map(([status, count]) => `${status}=${count}`)
			.join(', ')}`
	);
	if (errors.length > 0) {
		console.error('Validation errors:');
		for (const error of errors) console.error(`- ${error}`);
	}
}

if (errors.length > 0) process.exit(1);

if (
	strict &&
	(approvedOrScheduled < queue.targets.minimum_approved_or_scheduled ||
		copyReadyOrLater < queue.targets.minimum_copy_ready_or_later ||
		triagedOrLater < queue.targets.minimum_triaged_or_later ||
		designReady > queue.targets.maximum_design_ready ||
		inQa > queue.targets.maximum_qa)
) {
	process.exit(2);
}
