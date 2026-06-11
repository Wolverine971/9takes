<!-- src/lib/components/molecules/FamousTypes.svelte -->
<script lang="ts">
	export let type: number; //: Database['public']['Tables']['comments']['Row'];
	import {
		getPersonalityCategoryBySlug,
		getPersonalityCategorySlugs,
		type PersonalityCategorySlug
	} from '$lib/personalityCategories';
	import { famousTypes, type FamousTypePerson } from '$lib/components/molecules/famousTypes';
	import {
		buildPersonalityAnalysisPath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	type FamousTypeGroup = {
		slug: PersonalityCategorySlug | 'other';
		label: string;
		people: FamousTypePerson[];
	};

	const CATEGORY_ORDER: PersonalityCategorySlug[] = [
		'creator-media',
		'music',
		'comedy',
		'film-tv',
		'politics-public',
		'tech-business',
		'authors-thinkers'
	];

	const FALLBACK_GROUP: Pick<FamousTypeGroup, 'slug' | 'label'> = {
		slug: 'other',
		label: 'Other Public Figures'
	};

	function getDisplayCategory(person: FamousTypePerson): PersonalityCategorySlug | null {
		const slugs = getPersonalityCategorySlugs(person.types ?? [], person.name);
		return CATEGORY_ORDER.find((slug) => slugs.includes(slug)) ?? null;
	}

	function groupFamousPeople(people: FamousTypePerson[] = []): FamousTypeGroup[] {
		const grouped = new Map<FamousTypeGroup['slug'], FamousTypeGroup>();

		for (const person of people) {
			const slug = getDisplayCategory(person) ?? FALLBACK_GROUP.slug;
			const category = slug === 'other' ? null : getPersonalityCategoryBySlug(slug);
			const label = category?.label ?? FALLBACK_GROUP.label;

			if (!grouped.has(slug)) {
				grouped.set(slug, { slug, label, people: [] });
			}

			grouped.get(slug)?.people.push(person);
		}

		return [...grouped.values()].sort((a, b) => {
			const aIndex = a.slug === 'other' ? Number.POSITIVE_INFINITY : CATEGORY_ORDER.indexOf(a.slug);
			const bIndex = b.slug === 'other' ? Number.POSITIVE_INFINITY : CATEGORY_ORDER.indexOf(b.slug);
			return aIndex - bIndex;
		});
	}

	$: groupedFamousTypes = groupFamousPeople(famousTypes[type] ?? []);
</script>

<div class="famous-types">
	{#each groupedFamousTypes as group}
		<section class="famous-types__group" aria-labelledby={`famous-types-${type}-${group.slug}`}>
			<h3 class="famous-types__heading" id={`famous-types-${type}-${group.slug}`}>
				{group.label}
			</h3>
			<ul class="famous-types__list">
				{#each group.people as person}
					<li>
						{#if person.link}
							<a href={buildPersonalityAnalysisPath(person.name)}>
								{formatPersonalityDisplayName(person.name)}
							</a>
						{:else}
							<span>{formatPersonalityDisplayName(person.name)}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	.famous-types {
		margin: 0.85rem 0 0;
		columns: 19rem auto;
		column-gap: 1.75rem;
	}

	.famous-types__group {
		break-inside: avoid;
		display: inline-block;
		width: 100%;
		margin: 0 0 0.95rem;
		padding-top: 0.55rem;
		border-top: 1px solid var(--border-color, rgba(17, 24, 39, 0.14));
	}

	.famous-types__heading {
		margin: 0 0 0.35rem;
		font-size: 0.82rem;
		line-height: 1.25;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-bright);
	}

	.famous-types__list {
		list-style: none;
		padding: 0;
		margin: 0;
		columns: 11rem auto;
		column-gap: 1rem;
		font-size: 0.95rem;
	}

	.famous-types__list li {
		break-inside: avoid;
		padding: 0.06rem 0;
		line-height: 1.3;
	}

	.famous-types__list a {
		color: inherit;
		text-decoration-thickness: 0.08em;
		text-underline-offset: 0.18em;
	}

	@media (min-width: 48rem) {
		.famous-types {
			column-count: 2;
		}

		.famous-types__list {
			column-count: 2;
		}
	}

	@media (min-width: 72rem) {
		.famous-types {
			column-count: 3;
		}

		.famous-types__list {
			column-count: 2;
		}
	}
</style>
