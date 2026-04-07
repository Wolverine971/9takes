-- supabase/migrations/20260407_question_category_slugs.sql
alter table if exists public.question_categories
	add column if not exists slug text;

create or replace function public.slugify_question_category_name(value text)
returns text
language sql
immutable
as $$
	select trim(
		both '-'
		from regexp_replace(
			regexp_replace(
				regexp_replace(lower(coalesce(value, '')), '&', ' and ', 'g'),
				'[''’]',
				'',
				'g'
			),
			'[^a-z0-9]+',
			'-',
			'g'
		)
	);
$$;

create or replace function public.set_question_category_slug()
returns trigger
language plpgsql
as $$
declare
	base_slug text;
	candidate_slug text;
	parent_slug text;
begin
	base_slug := public.slugify_question_category_name(new.category_name);

	if base_slug is null or base_slug = '' then
		raise exception 'Question category slug cannot be empty for id %', new.id;
	end if;

	candidate_slug := base_slug;

	if exists (
		select 1
		from public.question_categories existing
		where existing.slug = candidate_slug
			and existing.id <> new.id
	) then
		if new.parent_id is not null then
			select coalesce(
				nullif(parent.slug, ''),
				public.slugify_question_category_name(parent.category_name)
			)
			into parent_slug
			from public.question_categories parent
			where parent.id = new.parent_id;

			if parent_slug is not null and parent_slug <> '' then
				candidate_slug := base_slug || '-' || parent_slug;
			end if;
		end if;
	end if;

	if exists (
		select 1
		from public.question_categories existing
		where existing.slug = candidate_slug
			and existing.id <> new.id
	) then
		candidate_slug := base_slug || '-' || new.id::text;
	end if;

	new.slug := candidate_slug;
	return new;
end;
$$;

drop trigger if exists question_categories_set_slug on public.question_categories;

create trigger question_categories_set_slug
before insert or update of category_name, parent_id
on public.question_categories
for each row
execute function public.set_question_category_slug();

do $$
declare
	category_row record;
begin
	for category_row in
		with category_priority as (
			select
				qc.id,
				public.slugify_question_category_name(qc.category_name) as base_slug,
				qc.level,
				count(distinct child.id) as child_count,
				count(distinct case when question.id is not null then tag.question_id end) as direct_question_count
			from public.question_categories qc
			left join public.question_categories child
				on child.parent_id = qc.id
			left join public.question_category_tags tag
				on tag.tag_id = qc.id
			left join public.questions question
				on question.id = tag.question_id
				and question.removed = false
			group by qc.id, qc.category_name, qc.level
		)
		select id
		from category_priority
		order by
			base_slug,
			child_count desc,
			direct_question_count desc,
			level asc nulls last,
			id asc
	loop
		update public.question_categories
		set category_name = category_name
		where id = category_row.id;
	end loop;
end;
$$;

alter table public.question_categories
	alter column slug set not null;

create unique index if not exists question_categories_slug_key
	on public.question_categories (slug);
