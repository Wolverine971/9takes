// src/lib/server/personalityCategoryData.spec.ts
import { describe, expect, it } from 'vitest';

import {
	getPersonalityCategoryGroups,
	type PersonalityCategoryPerson
} from './personalityCategoryData';

function makePerson(
	slug: string,
	types: string[],
	overrides: Partial<PersonalityCategoryPerson> = {}
): PersonalityCategoryPerson {
	const primaryCategorySlug = overrides.primaryCategorySlug ?? 'creator-media';
	const categorySlugs = overrides.categorySlugs ?? [primaryCategorySlug];

	return {
		slug,
		name: slug.split('-').join(' '),
		enneagram: '3',
		title: `${slug} title`,
		description: `${slug} description`,
		personaTitle: null,
		lastmod: '2026-03-01',
		date: '2026-02-01',
		types,
		categorySlugs,
		primaryCategorySlug,
		contentQualityScore: 8,
		...overrides
	};
}

describe('getPersonalityCategoryGroups', () => {
	it('clusters creator-media people into curated subgroups', () => {
		const groups = getPersonalityCategoryGroups('creator-media', [
			makePerson('Joe-Rogan', ['creator'], { contentQualityScore: 9 }),
			makePerson('Hasan-Piker', ['creator']),
			makePerson('Tony-Robbins', ['creator', 'entrepreneur']),
			makePerson('Kai-Cenat', ['creator']),
			makePerson('Mr-Beast', ['creator']),
			makePerson('Kylie-Jenner', ['lifestyleInfluencer']),
			makePerson('Unknown-Creator', ['creator'])
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'podcasters-interviewers',
			'news-commentary',
			'business-self-improvement',
			'streamers-live',
			'viral-entertainers',
			'lifestyle-brand-builders',
			'other-internet-personalities'
		]);

		expect(groups.find((group) => group.slug === 'podcasters-interviewers')?.people[0]?.slug).toBe(
			'Joe-Rogan'
		);
		expect(groups.find((group) => group.slug === 'news-commentary')?.people[0]?.slug).toBe(
			'Hasan-Piker'
		);
		expect(
			groups.find((group) => group.slug === 'business-self-improvement')?.people[0]?.slug
		).toBe('Tony-Robbins');
		expect(groups.find((group) => group.slug === 'streamers-live')?.people[0]?.slug).toBe(
			'Kai-Cenat'
		);
		expect(groups.find((group) => group.slug === 'viral-entertainers')?.people[0]?.slug).toBe(
			'Mr-Beast'
		);
		expect(groups.find((group) => group.slug === 'lifestyle-brand-builders')?.people[0]?.slug).toBe(
			'Kylie-Jenner'
		);
		expect(
			groups.find((group) => group.slug === 'other-internet-personalities')?.people[0]?.slug
		).toBe('Unknown-Creator');
	});

	it('clusters film-tv people into screen-specific sections', () => {
		const groups = getPersonalityCategoryGroups('film-tv', [
			makePerson('Amy-Poehler', ['comedian', 'celebrity', 'movieStar'], {
				categorySlugs: ['film-tv'],
				primaryCategorySlug: 'film-tv'
			}),
			makePerson('Zendaya', ['newMovieStar', 'movieStar'], {
				categorySlugs: ['film-tv'],
				primaryCategorySlug: 'film-tv'
			}),
			makePerson('Natalie-Portman', ['movieStar'], {
				categorySlugs: ['film-tv'],
				primaryCategorySlug: 'film-tv'
			}),
			makePerson('Kim-Kardashian', ['celebrity'], {
				categorySlugs: ['film-tv'],
				primaryCategorySlug: 'film-tv'
			})
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'tv-comedy-crossovers',
			'rising-stars-franchise-leads',
			'screen-icons-leading-actors',
			'celebrity-image-public-fascination'
		]);
	});

	it('clusters music people into genre and crossover sections', () => {
		const groups = getPersonalityCategoryGroups('music', [
			makePerson('Taylor-Swift', ['musician'], {
				categorySlugs: ['music'],
				primaryCategorySlug: 'music'
			}),
			makePerson('Travis-Scott', ['musician'], {
				categorySlugs: ['music'],
				primaryCategorySlug: 'music'
			}),
			makePerson('Grimes', ['musician'], {
				categorySlugs: ['music'],
				primaryCategorySlug: 'music'
			}),
			makePerson('John-Mayer', ['musician'], {
				categorySlugs: ['music'],
				primaryCategorySlug: 'music'
			}),
			makePerson('Addison-Rae', ['creator', 'musician', 'tiktoker'], {
				categorySlugs: ['music'],
				primaryCategorySlug: 'music'
			})
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'pop-stars-hitmakers',
			'rappers-genre-disruptors',
			'alternative-art-pop-voices',
			'singer-songwriters-roots',
			'crossovers-multi-hyphenates'
		]);
	});

	it('clusters politics people into leaders, activists, royals, and campaign figures', () => {
		const groups = getPersonalityCategoryGroups('politics-public', [
			makePerson('Joe-Biden', ['politician'], {
				categorySlugs: ['politics-public'],
				primaryCategorySlug: 'politics-public'
			}),
			makePerson('Greta-Thunberg', ['activist'], {
				categorySlugs: ['politics-public'],
				primaryCategorySlug: 'politics-public'
			}),
			makePerson('Princess-Diana', ['historical', 'politician'], {
				categorySlugs: ['politics-public'],
				primaryCategorySlug: 'politics-public'
			}),
			makePerson('Alexandria-Ocasio-Cortez', ['politician'], {
				categorySlugs: ['politics-public'],
				primaryCategorySlug: 'politics-public'
			})
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'heads-of-state-power-holders',
			'activists-movement-leaders',
			'royalty-symbolic-public-duty',
			'campaign-politicians-public-persuaders'
		]);
	});

	it('clusters tech-business people into builder, investor, and interpreter lanes', () => {
		const groups = getPersonalityCategoryGroups('tech-business', [
			makePerson('Elon-Musk', ['techie'], {
				categorySlugs: ['tech-business'],
				primaryCategorySlug: 'tech-business'
			}),
			makePerson('Peter-Thiel', ['techie'], {
				categorySlugs: ['tech-business'],
				primaryCategorySlug: 'tech-business'
			}),
			makePerson('Sam-Altman', ['techie', 'entrepreneur'], {
				categorySlugs: ['tech-business'],
				primaryCategorySlug: 'tech-business'
			}),
			makePerson('Alex-Hormozi', ['entrepreneur'], {
				categorySlugs: ['tech-business'],
				primaryCategorySlug: 'tech-business'
			}),
			makePerson('Kara-Swisher', ['techie', 'author'], {
				categorySlugs: ['tech-business'],
				primaryCategorySlug: 'tech-business'
			})
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'big-tech-founders-ceos',
			'investors-strategists-power-brokers',
			'frontier-builders-ai-defense',
			'operators-business-builders',
			'tech-media-interpreters'
		]);
	});

	it('clusters comedy people into stand-up, sketch, satire, and internet lanes', () => {
		const groups = getPersonalityCategoryGroups('comedy', [
			makePerson('Dave-Chappelle', ['comedian'], {
				categorySlugs: ['comedy'],
				primaryCategorySlug: 'comedy'
			}),
			makePerson('Amy-Poehler', ['comedian'], {
				categorySlugs: ['comedy'],
				primaryCategorySlug: 'comedy'
			}),
			makePerson('Jon-Stewart', ['comedian'], {
				categorySlugs: ['comedy'],
				primaryCategorySlug: 'comedy'
			}),
			makePerson('Druski', ['comedian', 'creator'], {
				categorySlugs: ['comedy'],
				primaryCategorySlug: 'comedy'
			})
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'stand-up-headliners',
			'sketch-tv-character-comics',
			'satire-hosts-political-comedy',
			'internet-podcast-comics'
		]);
	});

	it('clusters authors-thinkers people into author and interpreter lanes', () => {
		const groups = getPersonalityCategoryGroups('authors-thinkers', [
			makePerson('J.K.-Rowling', ['author'], {
				categorySlugs: ['authors-thinkers'],
				primaryCategorySlug: 'authors-thinkers'
			}),
			makePerson('Jordan-Peterson', ['psychology'], {
				categorySlugs: ['authors-thinkers'],
				primaryCategorySlug: 'authors-thinkers'
			}),
			makePerson('Kara-Swisher', ['author', 'techie'], {
				categorySlugs: ['authors-thinkers'],
				primaryCategorySlug: 'authors-thinkers'
			})
		]);

		expect(groups.map((group) => group.slug)).toEqual([
			'novelists-world-builders',
			'strategy-psychology-writers',
			'business-media-interpreters'
		]);
	});
});
