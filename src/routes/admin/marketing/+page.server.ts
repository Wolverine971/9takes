// src/routes/admin/marketing/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async (event) => {
	try {
		const { data: campaigns, error: campaignsError } = await supabase
			.from('campaigns')
			.select('*')
			.order('start_date', { ascending: false });

		if (campaignsError) throw campaignsError;

		const { data: content, error: contentError } = await supabase
			.from('content')
			.select('*')
			.order('scheduled_date', { ascending: false });

		if (contentError) throw contentError;

		const { data: templates, error: templatesError } = await supabase
			.from('templates')
			.select('*')
			.order('type', { ascending: true });

		if (templatesError) throw templatesError;

		return {
			campaigns,
			content,
			templates
		};
	} catch (err) {
		console.error('Error fetching data:', err);
		throw error(500, 'Error fetching data');
	}
};

export const actions: Actions = {
	createCampaign: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const campaignData = {
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			start_date: formData.get('start_date') as string,
			end_date: formData.get('end_date') as string,
			color: formData.get('color') as string,
			target_audience: formData.get('target_audience') as string,
			themes_and_topics: formData.get('themes_and_topics') as string,
			target_hashtags: formData.get('target_hashtags') as string,
			campaign_hashtags: formData.get('campaign_hashtags') as string,
			campaign_promotion_accounts: formData.get('campaign_promotion_accounts') as string
		};

		const { data, error: insertError } = await supabase
			.from('campaigns')
			.insert(campaignData)
			.select();

		if (insertError) {
			console.error('Error creating campaign:', insertError);
			return fail(500, { success: false, message: 'Failed to create campaign' });
		}

		return { success: true, campaign: data[0] };
	},

	updateCampaign: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const campaignData = {
			name: formData.get('name') as string,
			description: formData.get('description') as string,
			start_date: formData.get('start_date') as string,
			end_date: formData.get('end_date') as string,
			color: formData.get('color') as string,
			target_audience: formData.get('target_audience') as string,
			themes_and_topics: formData.get('themes_and_topics') as string,
			target_hashtags: formData.get('target_hashtags') as string,
			campaign_hashtags: formData.get('campaign_hashtags') as string,
			campaign_promotion_accounts: formData.get('campaign_promotion_accounts') as string
		};

		const { data, error: updateError } = await supabase
			.from('campaigns')
			.update(campaignData)
			.eq('id', id)
			.select();

		if (updateError) {
			console.error('Error updating campaign:', updateError);
			return fail(500, { success: false, message: 'Failed to update campaign' });
		}

		return { success: true, campaign: data[0] };
	},

	updateCampaignContent: async (event) => {
		const { request } = event;
		const formData = await request.formData();

		const campaignId = formData.get('campaignId') as string;
		const oldStartDate = formData.get('oldStartDate') as string;
		const newStartDate = formData.get('newStartDate') as string;

		console.log('Updating content for campaign:', campaignId);
		const oldDate = new Date(oldStartDate);
		const newDate = new Date(newStartDate);
		const timeDiff = newDate.getTime() - oldDate.getTime();

		// Fetch all content for the campaign
		const { data: contentItems, error: fetchError } = await supabase
			.from('content')
			.select('*')
			.eq('campaign_id', campaignId);

		if (fetchError) {
			console.error('Error fetching campaign content:', fetchError);
			return fail(500, { success: false, message: 'Failed to fetch campaign content' });
		}

		// Update each content item's scheduled_date
		const updatePromises = contentItems.map(async (item) => {
			const oldItemDate = new Date(item.scheduled_date);
			const newItemDate = new Date(oldItemDate.getTime() + timeDiff);

			const { data, error: updateError } = await supabase
				.from('content')
				.update({ scheduled_date: newItemDate.toISOString() })
				.eq('id', item.id)
				.select();

			if (updateError) {
				console.error(`Error updating content item ${item.id}:`, updateError);
				return null;
			}

			return data[0];
		});

		const updatedContent = await Promise.all(updatePromises);
		const successfulUpdates = updatedContent.filter((item) => item !== null);

		if (successfulUpdates.length !== contentItems.length) {
			console.error('Some content items failed to update');
			return fail(500, { success: false, message: 'Some content items failed to update' });
		}

		return { success: true, updatedContent: successfulUpdates };
	},

	createContent: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const contentData = {
			campaign_id: formData.get('campaign_id') as string,
			content_text: formData.get('content_text') as string,
			scheduled_date: formData.get('scheduled_date') as string,
			platform: formData.get('platform') as string,
			content_promotion_accounts: formData.get('content_promotion_accounts') as string,
			content_hashtags: formData.get('content_hashtags') as string,
			content_themes: formData.get('content_themes') as string
		};

		const { data, error: insertError } = await supabase
			.from('content')
			.insert(contentData)
			.select();

		if (insertError) {
			console.error('Error creating content:', insertError);
			return fail(500, { success: false, message: 'Failed to create content' });
		}

		return { success: true, content: data[0] };
	},

	updateContent: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const contentData = {
			campaign_id: formData.get('campaign_id') as string,
			content_text: formData.get('content_text') as string,
			scheduled_date: formData.get('scheduled_date') as string,
			platform: formData.get('platform') as string,
			status: formData.get('status') as string,
			content_promotion_accounts: formData.get('content_promotion_accounts') as string,
			content_hashtags: formData.get('content_hashtags') as string,
			content_themes: formData.get('content_themes') as string
		};

		const { data, error: updateError } = await supabase
			.from('content')
			.update(contentData)
			.eq('id', id)
			.select();

		if (updateError) {
			console.error('Error updating content:', updateError);
			return fail(500, { success: false, message: 'Failed to update content' });
		}

		return { success: true, content: data[0] };
	},

	createTemplate: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const templateData = {
			content_text: formData.get('content_text') as string,
			type: formData.get('type') as string,
			purpose_description: formData.get('purpose_description') as string
		};

		const { data, error: insertError } = await supabase
			.from('templates')
			.insert(templateData)
			.select();

		if (insertError) {
			console.error('Error creating template:', insertError);
			return fail(500, { success: false, message: 'Failed to create template' });
		}

		return { success: true, template: data[0] };
	},

	updateTemplate: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const templateData = {
			content_text: formData.get('content_text') as string,
			type: formData.get('type') as string,
			purpose_description: formData.get('purpose_description') as string
		};

		const { data, error: updateError } = await supabase
			.from('templates')
			.update(templateData)
			.eq('id', id)
			.select();

		if (updateError) {
			console.error('Error updating template:', updateError);
			return fail(500, { success: false, message: 'Failed to update template' });
		}

		return { success: true, template: data[0] };
	},

	deleteTemplate: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const id = formData.get('id') as string;

		const { error: deleteError } = await supabase.from('templates').delete().eq('id', id);

		if (deleteError) {
			console.error('Error deleting template:', deleteError);
			return fail(500, { success: false, message: 'Failed to delete template' });
		}

		return { success: true };
	}
};
