import {
	ChartNoAxesCombined,
	FileCode2,
	FileText,
	FolderKanban,
	LayoutDashboard,
	Link2,
	Mail,
	Megaphone,
	MessageCircle,
	MessagesSquare,
	PenLine,
	RefreshCw,
	Search,
	Shapes,
	Target,
	Users,
	Wrench
} from '@lucide/svelte';

export type AdminNavItem = {
	href: string;
	label: string;
	icon: typeof LayoutDashboard;
	exact?: boolean;
};

export type AdminNavGroup = {
	label: string;
	description: string;
	items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
	{
		label: 'Overview',
		description: 'Traffic, health, and discovery',
		items: [
			{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
			{ href: '/admin/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
			{ href: '/admin/search', label: 'Search', icon: Search }
		]
	},
	{
		label: 'People',
		description: 'Members, conversations, and clients',
		items: [
			{ href: '/admin/users', label: 'Users', icon: Users },
			{ href: '/admin/consulting', label: 'Consulting', icon: Target },
			{ href: '/admin/comments', label: 'Comments', icon: MessageCircle },
			{ href: '/admin/messages', label: 'Messages', icon: MessagesSquare }
		]
	},
	{
		label: 'Content',
		description: 'Publishing, questions, and taxonomy',
		items: [
			{ href: '/admin/content-board', label: 'Content board', icon: FolderKanban },
			{ href: '/admin/questions', label: 'Questions', icon: MessageCircle },
			{ href: '/admin/categories', label: 'Categories', icon: Shapes },
			{ href: '/admin/drafts', label: 'Drafts', icon: PenLine }
		]
	},
	{
		label: 'Reach',
		description: 'Email, sequences, and campaigns',
		items: [
			{ href: '/admin/email-dashboard', label: 'Email', icon: Mail },
			{ href: '/admin/welcome-sequence', label: 'Welcome sequence', icon: FileText },
			{ href: '/admin/reactivation-sequence', label: 'Reactivation', icon: RefreshCw },
			{ href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
			{ href: '/admin/transactional-emails', label: 'Email templates', icon: FileCode2 }
		]
	},
	{
		label: 'System',
		description: 'Links, assets, and internal tools',
		items: [
			{ href: '/admin/links', label: 'Links', icon: Link2 },
			{ href: '/admin/asset-generators', label: 'Asset tools', icon: Wrench }
		]
	}
];

export function isAdminNavActive(
	item: { href: string; exact?: boolean },
	pathname: string
): boolean {
	if (item.exact) return pathname === item.href;
	return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

const detailRoutes: Array<{
	test: RegExp;
	label: string;
	parentHref: string;
}> = [
	{
		test: /^\/admin\/search\/typeahead\/?$/,
		label: 'Search typeahead',
		parentHref: '/admin/search'
	},
	{
		test: /^\/admin\/questions\/hierarchy\/?$/,
		label: 'Question hierarchy',
		parentHref: '/admin/questions'
	},
	{
		test: /^\/admin\/categories\/[^/]+\/?$/,
		label: 'Category editor',
		parentHref: '/admin/categories'
	},
	{
		test: /^\/admin\/content-board\/personality-analysis\/[^/]+\/?$/,
		label: 'Profile editor',
		parentHref: '/admin/content-board'
	},
	{
		test: /^\/admin\/drafts\/[^/]+\/?$/,
		label: 'Draft editor',
		parentHref: '/admin/drafts'
	},
	{
		test: /^\/admin\/blog-diff\/[^/]+\/?$/,
		label: 'Version comparison',
		parentHref: '/admin/content-board'
	},
	{
		test: /^\/admin\/links\/[^/]+\/?$/,
		label: 'Link analytics',
		parentHref: '/admin/links'
	},
	{
		test: /^\/admin\/consulting\/clients\/[^/]+\/?$/,
		label: 'Client workspace',
		parentHref: '/admin/consulting'
	},
	{
		test: /^\/admin\/consulting\/sessions\/[^/]+\/?$/,
		label: 'Session workspace',
		parentHref: '/admin/consulting'
	},
	{
		test: /^\/admin\/consulting\/resources\/[^/]+\/?$/,
		label: 'Resource editor',
		parentHref: '/admin/consulting'
	},
	{
		test: /^\/admin\/consulting\/clients\/?$/,
		label: 'Clients',
		parentHref: '/admin/consulting'
	},
	{
		test: /^\/admin\/consulting\/sessions\/?$/,
		label: 'Sessions',
		parentHref: '/admin/consulting'
	},
	{
		test: /^\/admin\/consulting\/resources\/?$/,
		label: 'Resources',
		parentHref: '/admin/consulting'
	},
	{
		test: /^\/admin\/asset-generators\/poster-generator\/?$/,
		label: 'Poster generator',
		parentHref: '/admin/asset-generators'
	},
	{
		test: /^\/admin\/asset-generators\/question-print\/?$/,
		label: 'Question print',
		parentHref: '/admin/asset-generators'
	},
	{
		test: /^\/admin\/asset-generators\/zine-creator\/?$/,
		label: 'Zine creator',
		parentHref: '/admin/asset-generators'
	}
];

export function getAdminRouteContext(pathname: string) {
	const detail = detailRoutes.find((route) => route.test.test(pathname));
	const parentHref = detail?.parentHref;
	const parentItem =
		adminNavGroups.flatMap((group) => group.items).find((item) => item.href === parentHref) ??
		adminNavGroups
			.flatMap((group) => group.items)
			.filter((item) => isAdminNavActive(item, pathname))
			.sort((a, b) => b.href.length - a.href.length)[0];
	const group =
		adminNavGroups.find((candidate) =>
			candidate.items.some((item) => item.href === parentItem?.href)
		) ?? adminNavGroups[0];

	return {
		label: detail?.label ?? parentItem?.label ?? 'Admin',
		group,
		parentItem
	};
}
