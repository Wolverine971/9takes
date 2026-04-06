// src/routes/api/admin/consulting/resources/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	consultingResourceCategories,
	normalizeConsultingResourceRelatedBlogSlug,
	normalizeConsultingResourceSlug,
	renderConsultingResourceMarkdown
} from '$lib/server/consultingResource';

const updateConsultingResourceSchema = z.object({
	title: z.string().trim().min(1).max(160),
	slug: z.string().trim().min(1).max(160),
	description: z.string().max(400).optional().nullable(),
	category: z.enum(consultingResourceCategories),
	content: z.string().min(1).max(50000),
	sort_order: z.number().int().min(-9999).max(9999),
	is_pinned: z.boolean(),
	related_blog_slug: z.string().max(300).optional().nullable()
});

function normalizeOptionalText(value: string | null | undefined): string | null {
	const trimmed = value?.trim() ?? '';
	return trimmed ? trimmed : null;
}

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const resourceId = z.string().uuid().safeParse(params.id);
	if (!resourceId.success) {
		throw error(400, 'Invalid resource id');
	}

	const payload = updateConsultingResourceSchema.safeParse(await request.json());
	if (!payload.success) {
		return json(
			{
				success: false,
				message: payload.error.issues[0]?.message ?? 'Invalid consulting resource payload'
			},
			{ status: 400 }
		);
	}

	const normalizedSlug = normalizeConsultingResourceSlug(payload.data.slug);
	if (!normalizedSlug) {
		return json({ success: false, message: 'Slug cannot be empty.' }, { status: 400 });
	}

	const { supabase } = await requireAdmin(locals);
	const { data: resource, error: updateError } = await supabase
		.from('consulting_resources')
		.update({
			title: payload.data.title.trim(),
			slug: normalizedSlug,
			description: normalizeOptionalText(payload.data.description),
			category: payload.data.category,
			content: payload.data.content,
			sort_order: payload.data.sort_order,
			is_pinned: payload.data.is_pinned,
			related_blog_slug: normalizeConsultingResourceRelatedBlogSlug(payload.data.related_blog_slug),
			updated_at: new Date().toISOString()
		})
		.eq('id', resourceId.data)
		.select('*')
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return json(
				{ success: false, message: 'A resource with this slug already exists.' },
				{ status: 409 }
			);
		}

		if (updateError.code === 'PGRST116') {
			throw error(404, 'Resource not found');
		}

		return json(
			{ success: false, message: updateError.message || 'Failed to save consulting resource' },
			{ status: 400 }
		);
	}

	return json({
		success: true,
		resource,
		renderedHtml: renderConsultingResourceMarkdown(resource.content)
	});
};
