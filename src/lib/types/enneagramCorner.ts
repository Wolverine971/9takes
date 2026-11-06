// src/lib/types/enneagramCorner.ts
// Shapes for Enneagram Corner section pages (built in $lib/server/enneagramCornerSections).

export type CornerPost = {
	slug: string;
	href: string;
	title: string;
	description: string;
	pic: string | null;
	date: string | null;
	lastmod: string | null;
	published: boolean;
	type: string[];
	subtopics: string[];
};

export type CornerCard = Pick<
	CornerPost,
	'slug' | 'href' | 'title' | 'description' | 'pic' | 'date' | 'lastmod'
>;

export type CornerLane = {
	slug: string;
	title: string;
	descriptor: string;
	posts: CornerCard[];
};

export type CornerSectionLink = {
	slug: string;
	title: string;
	href: string;
	descriptor: string;
	count: number;
};

export type CornerSectionView = {
	section: Omit<CornerSectionLink, 'count'>;
	lanes: CornerLane[];
	/** Lanes with no published post yet (content gaps; never rendered). */
	emptyLanes: string[];
	total: number;
	latestUpdate: string | null;
	otherSections: CornerSectionLink[];
};
