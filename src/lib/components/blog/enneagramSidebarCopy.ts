// src/lib/components/blog/enneagramSidebarCopy.ts
export type EnneagramSidebarContext =
	| 'personality-analysis'
	| 'enneagram-corner'
	| 'enneagram-mental-health'
	| 'enneagram-type'
	| 'pop-culture'
	| 'community'
	| 'how-to-guides'
	| 'generic';

export type EnneagramSidebarCopy = {
	title: string;
	copy: string;
	buttonLabel: string;
};

const SIDEBAR_COPY: Record<EnneagramSidebarContext, EnneagramSidebarCopy> = {
	'personality-analysis': {
		title: 'Get the next breakdown',
		copy: 'Celebrity types, relationship patterns, and plain-English Enneagram context.',
		buttonLabel: 'Send it to me'
	},
	'enneagram-corner': {
		title: 'Get Enneagram notes',
		copy: 'Short guides on type patterns, growth, stress, and relationships.',
		buttonLabel: 'Send it to me'
	},
	'enneagram-mental-health': {
		title: 'Get type-aware guides',
		copy: 'Notes on anxiety, burnout, healing, and emotional patterns.',
		buttonLabel: 'Send it to me'
	},
	'enneagram-type': {
		title: 'Go deeper on each type',
		copy: 'Clear breakdowns of type patterns, blind spots, and relationships.',
		buttonLabel: 'Send it to me'
	},
	'pop-culture': {
		title: 'Get new culture reads',
		copy: 'Celebrity typings and internet-culture reads through the Enneagram lens.',
		buttonLabel: 'Send it to me'
	},
	community: {
		title: 'Get the next reader take',
		copy: 'Questions, answers, and sharper takes from the 9takes community.',
		buttonLabel: 'Send it to me'
	},
	'how-to-guides': {
		title: 'Get practical people guides',
		copy: 'Notes on communication, relationships, and reading people.',
		buttonLabel: 'Send it to me'
	},
	generic: {
		title: 'Get Enneagram notes',
		copy: 'New guides and 9takes updates. No account required.',
		buttonLabel: 'Send it to me'
	}
};

function normalizePathname(pathname: string): string {
	if (!pathname) return '/';
	const trimmed = pathname.trim().toLowerCase();
	if (!trimmed || trimmed === '/') return '/';
	return trimmed.replace(/\/+$/, '') || '/';
}

export function getEnneagramSidebarContext(pathname: string): EnneagramSidebarContext {
	const normalizedPathname = normalizePathname(pathname);

	if (/^\/personality-analysis\/type(\/|$)/.test(normalizedPathname)) {
		return 'enneagram-type';
	}

	if (/^\/personality-analysis(\/|$)/.test(normalizedPathname)) {
		return 'personality-analysis';
	}

	if (/^\/enneagram-corner\/mental-health(\/|$)/.test(normalizedPathname)) {
		return 'enneagram-mental-health';
	}

	if (/^\/enneagram-corner(\/|$)/.test(normalizedPathname)) {
		return 'enneagram-corner';
	}

	if (/^\/pop-culture(\/|$)/.test(normalizedPathname)) {
		return 'pop-culture';
	}

	if (/^\/community(\/|$)/.test(normalizedPathname)) {
		return 'community';
	}

	if (/^\/how-to-guides(\/|$)/.test(normalizedPathname)) {
		return 'how-to-guides';
	}

	return 'generic';
}

export function getEnneagramSidebarCopy(pathname: string): EnneagramSidebarCopy {
	return SIDEBAR_COPY[getEnneagramSidebarContext(pathname)];
}
