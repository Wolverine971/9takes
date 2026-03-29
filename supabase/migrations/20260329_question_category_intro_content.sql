-- supabase/migrations/20260329_question_category_intro_content.sql
alter table if exists question_categories
	add column if not exists intro_markdown text,
	add column if not exists intro_description text,
	add column if not exists intro_status text not null default 'missing',
	add column if not exists intro_source text not null default 'ai',
	add column if not exists intro_prompt_version text,
	add column if not exists intro_generated_at timestamptz,
	add column if not exists intro_updated_at timestamptz not null default now(),
	add column if not exists intro_updated_by uuid references profiles(id),
	add column if not exists intro_reviewed_at timestamptz,
	add column if not exists intro_context jsonb not null default '{}'::jsonb;

create table if not exists question_category_intro_runs (
	id uuid primary key default gen_random_uuid(),
	category_id integer not null references question_categories(id) on delete cascade,
	status text not null,
	trigger text not null,
	prompt_version text,
	model text,
	context jsonb not null default '{}'::jsonb,
	output jsonb,
	error text,
	created_by uuid references profiles(id),
	started_at timestamptz not null default now(),
	finished_at timestamptz,
	created_at timestamptz not null default now()
);

create index if not exists question_categories_intro_status_idx
	on question_categories (intro_status);

create index if not exists question_category_intro_runs_category_id_idx
	on question_category_intro_runs (category_id);

create index if not exists question_category_intro_runs_status_idx
	on question_category_intro_runs (status);

create index if not exists question_category_intro_runs_created_at_idx
	on question_category_intro_runs (created_at desc);
