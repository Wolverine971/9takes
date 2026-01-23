// src/routes/api/admin/content/analytics/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Type for the blog data we fetch from the database
interface BlogRow {
	id: number;
	person: string | null;
	title: string | null;
	enneagram: string | null;
	suggestions: unknown;
	published: boolean | null;
	content: string | null;
	lastmod: string | null;
	date: string | null;
	description: string | null;
	meta_title: string | null;
	pic: string | null;
	twitter: string | null;
	instagram: string | null;
	tiktok: string | null;
	wikipedia: string | null;
	category: string | null;
}

// Calculate SEO score (0-100) based on metadata completeness
function calculateSeoScore(blog: {
	title?: string | null;
	description?: string | null;
	meta_title?: string | null;
	pic?: string | null;
	twitter?: string | null;
	instagram?: string | null;
	wikipedia?: string | null;
}): number {
	let score = 0;
	const titleLen = blog.title?.length || 0;
	const descLen = blog.description?.length || 0;
	const metaTitleLen = blog.meta_title?.length || 0;

	// Title length (optimal: 30-60 chars) → 15 points
	if (titleLen >= 30 && titleLen <= 60) score += 15;

	// Description length (optimal: 120-160 chars) → 20 points
	if (descLen >= 120 && descLen <= 160) score += 20;

	// Meta title length (optimal: 30-60 chars) → 15 points
	if (metaTitleLen >= 30 && metaTitleLen <= 60) score += 15;

	// Has featured image → 20 points
	if (blog.pic && blog.pic !== '') score += 20;

	// Has social links (twitter OR instagram) → 15 points
	if ((blog.twitter && blog.twitter !== '') || (blog.instagram && blog.instagram !== ''))
		score += 15;

	// Has Wikipedia reference → 15 points
	if (blog.wikipedia && blog.wikipedia !== '') score += 15;

	return score;
}

// Calculate health score (0-100) composite metric
function calculateHealthScore(
	blog: {
		outgoingCount: number;
		incomingCount: number;
		wordCount: number;
		lastmod?: string | null;
		seoScore: number;
		socialCount: number;
	},
	avgLinks: number
): number {
	// cross_links_score (20%) - based on total links vs average
	const totalLinks = blog.outgoingCount + blog.incomingCount;
	const crossLinksScore = Math.min(100, (totalLinks / Math.max(avgLinks, 1)) * 50);

	// content_length_score (25%) - based on word count benchmarks
	let contentLengthScore = 0;
	if (blog.wordCount >= 5000) contentLengthScore = 100;
	else if (blog.wordCount >= 3000) contentLengthScore = 85;
	else if (blog.wordCount >= 1500) contentLengthScore = 70;
	else contentLengthScore = Math.max(20, (blog.wordCount / 1500) * 70);

	// freshness_score (20%) - days since last edit
	const lastmodDate = blog.lastmod ? new Date(blog.lastmod) : new Date(0);
	const daysSince = Math.floor((Date.now() - lastmodDate.getTime()) / (1000 * 60 * 60 * 24));
	let freshnessScore = 100;
	if (daysSince > 180) freshnessScore = 20;
	else if (daysSince > 90) freshnessScore = 50;
	else if (daysSince > 30) freshnessScore = 75;

	// seo_score (20%) - already calculated
	const seoScore = blog.seoScore;

	// social_score (15%) - based on social link completeness (0-4 links)
	const socialScore = (blog.socialCount / 4) * 100;

	return Math.round(
		crossLinksScore * 0.2 +
			contentLengthScore * 0.25 +
			freshnessScore * 0.2 +
			seoScore * 0.2 +
			socialScore * 0.15
	);
}

export const GET: RequestHandler = async ({ locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	// Check authentication
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	// Check admin role
	const { data: profile } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!profile?.admin) {
		throw error(403, 'Admin access required');
	}

	try {
		// Fetch all blogs with all fields for analytics
		const { data: blogs, error: fetchError } = await supabase
			.from('blogs_famous_people')
			.select('*')
			.order('person');

		if (fetchError) {
			console.error('Error fetching blogs:', fetchError);
			throw error(500, 'Failed to fetch blogs');
		}

		if (!blogs || blogs.length === 0) {
			return json({ data: [] });
		}

		// Cast to proper type (Supabase returns generic types from .select())
		const typedBlogs = blogs as unknown as BlogRow[];

		// Build a map of person slug -> blog id for quick lookup
		const personToId = new Map<string, number>();
		for (const blog of typedBlogs) {
			if (blog.person) {
				personToId.set(blog.person.toLowerCase(), blog.id);
			}
		}

		// Calculate analytics for each blog
		const analyticsData = typedBlogs.map((blog) => {
			// Parse suggestions to get outgoing links
			let outgoingCount = 0;
			let suggestionsList: string[] = [];

			if (blog.suggestions) {
				if (Array.isArray(blog.suggestions)) {
					suggestionsList = (blog.suggestions as unknown[]).filter(
						(s): s is string => typeof s === 'string'
					);
				} else if (typeof blog.suggestions === 'string') {
					try {
						const parsed = JSON.parse(blog.suggestions);
						suggestionsList = Array.isArray(parsed)
							? parsed.filter((s): s is string => typeof s === 'string')
							: [];
					} catch {
						suggestionsList = [];
					}
				}
				outgoingCount = suggestionsList.length;
			}

			// Calculate content metrics
			const content = blog.content || '';
			const wordCount = content.split(/\s+/).filter(Boolean).length;
			const charCount = content.length;

			// Calculate SEO metrics
			const titleLength = blog.title?.length || 0;
			const descriptionLength = blog.description?.length || 0;
			const metaTitleLength = blog.meta_title?.length || 0;
			const hasImage = !!(blog.pic && blog.pic !== '');
			const hasTwitter = !!(blog.twitter && blog.twitter !== '');
			const hasInstagram = !!(blog.instagram && blog.instagram !== '');
			const hasTiktok = !!(blog.tiktok && blog.tiktok !== '');
			const hasWikipedia = !!(blog.wikipedia && blog.wikipedia !== '');
			const hasSocial = hasTwitter || hasInstagram;
			const socialCount =
				(hasTwitter ? 1 : 0) +
				(hasInstagram ? 1 : 0) +
				(hasTiktok ? 1 : 0) +
				(hasWikipedia ? 1 : 0);

			const seoScore = calculateSeoScore(blog);

			return {
				id: blog.id,
				person: blog.person,
				title: blog.title,
				enneagram: blog.enneagram,
				published: blog.published,
				lastmod: blog.lastmod,
				date: blog.date,
				outgoingCount,
				incomingCount: 0, // Will be calculated below
				wordCount,
				charCount,
				suggestions: suggestionsList,
				// SEO fields
				titleLength,
				descriptionLength,
				metaTitleLength,
				hasImage,
				hasSocial,
				hasWikipedia,
				seoScore,
				// Classification
				category: blog.category,
				// Social fields
				hasTwitter,
				hasInstagram,
				hasTiktok,
				socialCount
			};
		});

		// Calculate incoming links by iterating through all blogs
		// and counting how many times each person appears in others' suggestions
		const incomingCounts = new Map<number, number>();

		for (const blog of analyticsData) {
			for (const suggestedPerson of blog.suggestions) {
				const targetId = personToId.get(suggestedPerson.toLowerCase());
				if (targetId && targetId !== blog.id) {
					incomingCounts.set(targetId, (incomingCounts.get(targetId) || 0) + 1);
				}
			}
		}

		// Calculate average links for health score calculation
		let totalLinks = 0;
		for (const blog of analyticsData) {
			const incoming = incomingCounts.get(blog.id) || 0;
			totalLinks += blog.outgoingCount + incoming;
		}
		const avgLinks = analyticsData.length > 0 ? totalLinks / analyticsData.length : 0;

		// Merge incoming counts into analytics data, calculate health scores, and remove suggestions array
		const result = analyticsData.map((blog) => {
			const incomingCount = incomingCounts.get(blog.id) || 0;
			const healthScore = calculateHealthScore(
				{
					outgoingCount: blog.outgoingCount,
					incomingCount,
					wordCount: blog.wordCount,
					lastmod: blog.lastmod,
					seoScore: blog.seoScore,
					socialCount: blog.socialCount
				},
				avgLinks
			);

			return {
				id: blog.id,
				person: blog.person,
				title: blog.title,
				enneagram: blog.enneagram,
				published: blog.published,
				lastmod: blog.lastmod,
				date: blog.date,
				outgoingCount: blog.outgoingCount,
				incomingCount,
				wordCount: blog.wordCount,
				charCount: blog.charCount,
				// SEO fields
				titleLength: blog.titleLength,
				descriptionLength: blog.descriptionLength,
				metaTitleLength: blog.metaTitleLength,
				hasImage: blog.hasImage,
				hasSocial: blog.hasSocial,
				hasWikipedia: blog.hasWikipedia,
				seoScore: blog.seoScore,
				// Classification
				category: blog.category,
				// Social fields
				hasTwitter: blog.hasTwitter,
				hasInstagram: blog.hasInstagram,
				hasTiktok: blog.hasTiktok,
				socialCount: blog.socialCount,
				// Health score
				healthScore
			};
		});

		return json({ data: result });
	} catch (e) {
		console.error('Error in analytics endpoint:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
