// POST /api/admin/email-dashboard/generate
// Generate email content using LLM

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { GenerateEmailRequest, GenerateEmailResponse } from '$lib/types/email';
import { smartLLMService } from '$utils/server/smart-llm-service';

const SYSTEM_PROMPT = `You are an email copywriter for 9takes, a personality-based Q&A platform built on the Enneagram personality system. 9takes helps people understand themselves and others through the lens of personality.

Your task is to generate email content based on user instructions. The emails should:
- Be clean, professional, and engaging
- Match the requested tone (professional, friendly, or casual)
- Include a clear call-to-action when appropriate
- Be concise and scannable
- Use simple HTML formatting (h1, h2, p, a, ul/li, strong)

Output format: Return valid JSON with:
{
  "subject": "Email subject line (under 60 characters)",
  "html_content": "<h1>Heading</h1><p>Content...</p>",
  "plain_text": "Plain text version of the email"
}

Important:
- Do NOT include <html>, <head>, <body> tags - just the inner content
- Use {{name}} placeholder for recipient's name if personalization is needed
- Keep subject lines under 60 characters
- Make the first sentence compelling for email previews
- For buttons, use: <a href="URL" style="display:inline-block;padding:14px 28px;background-color:#6c5ce7;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Button Text</a>`;

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	// Check authentication
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	// Check admin status
	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	try {
		const body: GenerateEmailRequest = await request.json();
		const { instructions, context } = body;

		if (!instructions || !instructions.trim()) {
			throw error(400, 'Instructions are required');
		}

		const userPrompt = `Generate an email based on these instructions:

${instructions}

Context:
- Audience: ${context?.audience_type || 'General subscribers'}
- Number of recipients: ${context?.recipient_count || 'Unknown'}
- Desired tone: ${context?.tone || 'professional'}

Generate the email content now. Return valid JSON only.`;

		const result = await smartLLMService.getJSONResponse<GenerateEmailResponse>({
			systemPrompt: SYSTEM_PROMPT,
			userPrompt,
			userId: session.user.id,
			profile: 'balanced',
			operationType: 'email_generation',
			temperature: 0.7
		});

		// Validate the response structure
		if (!result.subject || !result.html_content) {
			throw error(500, 'Invalid response from LLM');
		}

		const response: GenerateEmailResponse = {
			subject: result.subject,
			html_content: result.html_content,
			plain_text: result.plain_text || ''
		};

		return json(response);
	} catch (e) {
		console.error('Error generating email:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Failed to generate email');
	}
};
