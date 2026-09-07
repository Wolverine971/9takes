// Run against isolated PostgreSQL WASM: node scripts/tests/comment-ranking-db.mjs /path/to/pglite/dist/index.js
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(
	process.argv[2] ? pathToFileURL(process.argv[2]).href : '@electric-sql/pglite'
);
const db = new PGlite();
const host = '9ce7ff91-d7f8-4397-b00d-8716e335aaee';
const reader = '00000000-0000-0000-0000-000000000001';
await db.exec(`
CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
CREATE TABLE profiles(id uuid PRIMARY KEY, admin boolean DEFAULT false, external_id text, enneagram integer);
CREATE TABLE questions(id bigint PRIMARY KEY, pinned_comment_ids bigint[] DEFAULT '{}', removed boolean DEFAULT false, flagged boolean DEFAULT false);
CREATE TABLE comments(id bigint PRIMARY KEY, parent_id bigint, parent_type text, comment text, author_id uuid, fingerprint text, ip text, created_at timestamptz DEFAULT now(), modified_at timestamptz, like_count integer DEFAULT 0, comment_count integer DEFAULT 0, removed boolean DEFAULT false);
CREATE TABLE comment_like(id bigint PRIMARY KEY, comment_id bigint, user_id uuid);
CREATE TABLE host_reply_drafts(id bigint PRIMARY KEY, comment_id bigint UNIQUE, question_id bigint, status text DEFAULT 'pending', posted_comment_id bigint);
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
INSERT INTO profiles VALUES ('${host}', true, 'dj', 8), ('${reader}', false, 'reader', 5);
INSERT INTO questions(id,pinned_comment_ids) VALUES (118, '{1}'), (119, '{}');
INSERT INTO comments(id, parent_id, parent_type, comment, created_at) SELECT i, 118, 'question', 'sincere take ' || i, '2026-09-01'::timestamptz + i * interval '1 minute' FROM generate_series(1,10) i;
UPDATE comments SET author_id = '${reader}', fingerprint = 'reader-browser' WHERE id = 10;
INSERT INTO comments(id,parent_id,parent_type,comment,removed) VALUES (11,118,'question','removed',true),(12,1,'comment','reply',false),(13,119,'question','foreign',false);
INSERT INTO host_reply_drafts(id,comment_id,question_id) VALUES (1,3,118);
`);
await db.exec(
	await readFile(
		new URL('../../supabase/migrations/20260907175553_comment_ranking.sql', import.meta.url),
		'utf8'
	)
);
const query = async (sql, params = []) => (await db.query(sql, params)).rows;
let payload = (
	await query('select get_question_take_data(118,$1,$2,$3) as data', [
		reader,
		'reader-browser',
		host
	])
)[0].data;
assert.equal(payload.total_count, 10);
assert.equal(payload.takes.length, 10);
assert.equal(payload.own_takes[0].id, 10);
assert.equal(payload.own_takes[0].is_own, true);
assert.equal(JSON.stringify(payload).includes('fingerprint'), false);
assert.equal(JSON.stringify(payload).includes('reader-browser'), false);
assert.equal(JSON.stringify(payload).includes('draft'), false);
// SQL permission surface and service invocation.
assert.equal(
	(
		await query(
			"select has_function_privilege('anon','public.increment_comment_views(bigint,bigint[],uuid,text)','EXECUTE') as allowed"
		)
	)[0].allowed,
	false
);
assert.equal(
	(
		await query(
			"select has_table_privilege('authenticated','public.comment_view_reset_audit','SELECT') as allowed"
		)
	)[0].allowed,
	false
);
await db.exec('set role service_role');
assert.equal(
	(
		await query(
			'select increment_comment_views(118,ARRAY[1,1,2,10,11,12,13]::bigint[],$1,$2) as n',
			[reader, 'reader-browser']
		)
	)[0].n,
	2
);
assert.equal(
	(
		await query('select increment_comment_views(118,ARRAY[1]::bigint[],NULL,$1) as n', [
			'locked-browser'
		])
	)[0].n,
	0
);
assert.equal(
	(await query('select increment_comment_views(118,ARRAY[1]::bigint[],NULL,NULL) as n'))[0].n,
	0
);
assert.equal(
	(
		await query('select increment_comment_views(118,ARRAY[1,10]::bigint[],NULL,$1) as n', [
			'reader-browser'
		])
	)[0].n,
	1
);
assert.equal((await query('select view_count from comments where id=1'))[0].view_count, 2);
await db.exec('reset role');
// Moderation, host reply override, text floor, small-question threshold and rotations.
await db.exec(
	"UPDATE host_reply_drafts SET low_effort=true WHERE id=1; UPDATE comments SET view_count=5 WHERE id=1; UPDATE comments SET comment='lol' WHERE id=2;"
);
let ranks = await query('select * from get_question_take_ranking(118,$1) order by rank', [host]);
assert.equal(ranks.find((r) => Number(r.id) === 1).round, 1);
assert.equal(ranks.find((r) => Number(r.id) === 2).below_floor, true);
assert.equal(ranks.find((r) => Number(r.id) === 3).below_floor, true);
assert.ok(
	Number(ranks.find((r) => Number(r.id) === 1).rank) <
		Number(ranks.find((r) => Number(r.id) === 2).rank)
);
await db.exec(
	`INSERT INTO comments(id,parent_id,parent_type,author_id,comment) VALUES(14,3,'comment','${host}','a host reply'); UPDATE host_reply_drafts SET status='posted', posted_comment_id=14 WHERE id=1;`
);
assert.ok(
	Number(
		(await query('select take_rank_at_post from host_reply_drafts where id=1'))[0].take_rank_at_post
	) > 0
);
payload = (
	await query('select get_question_take_data(118,$1,$2,$3) as data', [
		reader,
		'reader-browser',
		host
	])
)[0].data;
assert.equal(payload.takes.find((t) => t.id === 3).ranking_low_effort, false);
// A reply rank snapshot survives future exposure changes.
const savedRank = (await query('select take_rank_at_post from host_reply_drafts where id=1'))[0]
	.take_rank_at_post;
await db.exec('UPDATE comments SET view_count=1000 WHERE id=3;');
assert.equal(
	(await query('select take_rank_at_post from host_reply_drafts where id=1'))[0].take_rank_at_post,
	savedRank
);
await db.exec('UPDATE comments SET removed=true WHERE id=9;');
ranks = await query('select * from get_question_take_ranking(118,$1) order by rank', [host]);
assert.equal(Number(ranks[0].id), 1); // Exactly 9 takes: curated first, despite exposure.
// Audit and reset are atomic and admin restricted.
await assert.rejects(query('select reset_question_comment_views(118,$1)', [reader]));
await db.exec('set role service_role');
await query('select reset_question_comment_views(118,$1)', [host]);
assert.equal(
	Number(
		(
			await query(
				"select sum(view_count) as views from comments where parent_type='question' and parent_id=118"
			)
		)[0].views
	),
	0
);
assert.equal(Number((await query('select count(*) as n from comment_view_reset_audit'))[0].n), 1);
assert.ok(
	Number(
		(await query('select previous_view_count from comment_view_reset_audit'))[0].previous_view_count
	) > 0
);
await db.exec('reset role');
// Cap, own outside the cap, and equal-date cursor paging have no gaps or repeats.
await db.exec(
	"INSERT INTO comments(id,parent_id,parent_type,comment,created_at) SELECT i,118,'question','new take ' || i,'2026-09-07'::timestamptz FROM generate_series(100,214) i;"
);
payload = (
	await query('select get_question_take_data(118,$1,$2,$3) as data', [
		reader,
		'reader-browser',
		host
	])
)[0].data;
assert.equal(payload.takes.length, 100);
assert.equal(payload.own_takes[0].id, 10);
assert.equal(
	payload.takes.some((t) => t.id === 10),
	false
);
const last = payload.takes.at(-1);
const next = (
	await query('select get_question_take_data(118,$1,$2,$3,10,$4,$5) as data', [
		reader,
		'reader-browser',
		host,
		last.created_at,
		last.id
	])
)[0].data;
assert.equal(next.takes.length, 10);
assert.equal(
	next.takes.some((t) => payload.takes.some((old) => old.id === t.id)),
	false
);
// Repeat migration is safe; existing view totals and historical snapshots survive.
await db.exec(
	await readFile(
		new URL('../../supabase/migrations/20260907175553_comment_ranking.sql', import.meta.url),
		'utf8'
	)
);
assert.equal(
	(await query('select take_rank_at_post from host_reply_drafts where id=1'))[0].take_rank_at_post,
	savedRank
);
// Canonical weekly reports execute against the same migrated schema.
await db.exec(
	'ALTER TABLE questions ADD COLUMN starter_rank integer; UPDATE questions SET starter_rank=1 WHERE id=118;'
);
for (const name of [
	'comment-ranking-weekly.sql',
	'comment-ranking-length.sql',
	'comment-ranking-round-deltas.sql'
]) {
	await db.exec(
		await readFile(
			new URL(`../../docs/growth/question-commenting/sql/${name}`, import.meta.url),
			'utf8'
		)
	);
}
await db.close();
console.log(
	'Comment ranking SQL checks passed: migration, permissions, gate, increments, rank, moderation, audit, cap, own takes and cursor.'
);
