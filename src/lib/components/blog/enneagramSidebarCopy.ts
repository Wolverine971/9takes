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
		title: 'Get the next personality breakdown by email',
		copy: 'Fresh celebrity analyses, relationship reads, and enneagram-based explanations from 9takes.',
		buttonLabel: 'Get personality emails'
	},
	'enneagram-corner': {
		title: 'Get enneagram guides by email',
		copy: 'Type-specific growth, relationship, stress, and self-understanding guides from 9takes.',
		buttonLabel: 'Get enneagram guides'
	},
	'enneagram-mental-health': {
		title: 'Get enneagram mental health guides by email',
		copy: 'New type-aware writing on anxiety, burnout, healing, and emotional patterns from 9takes.',
		buttonLabel: 'Get mental health guides'
	},
	'enneagram-type': {
		title: 'Get type-by-type enneagram insights by email',
		copy: 'Clear breakdowns of each type, their patterns, and how they relate to other people.',
		buttonLabel: 'Get type insights'
	},
	'pop-culture': {
		title: 'Get new pop culture personality reads by email',
		copy: 'Fresh celebrity analyses, internet-culture breakdowns, and enneagram takes on public figures.',
		buttonLabel: 'Get pop culture emails'
	},
	community: {
		title: 'Get the next community take by email',
		copy: 'Sharp questions, honest answers, and personality-driven community conversations from 9takes.',
		buttonLabel: 'Get community emails'
	},
	'how-to-guides': {
		title: 'Get practical psychology guides by email',
		copy: 'New how-to breakdowns on relationships, communication, and understanding people.',
		buttonLabel: 'Get practical guides'
	},
	generic: {
		title: 'Get enneagram insights by email',
		copy: 'New guides and 9takes updates. No account required.',
		buttonLabel: 'Subscribe'
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
