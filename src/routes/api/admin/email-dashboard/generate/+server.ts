// src/routes/api/admin/email-dashboard/generate/+server.ts
// Generate email content using LLM

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { GenerateEmailRequest, GenerateEmailResponse } from '$lib/types/email';
import { SmartLLMService } from '../../../../../utils/server/smart-llm-service';

const SYSTEM_PROMPT = `You are an email copywriter for 9takes.

## About 9takes

**Tagline**: "See the emotions behind every take" | "One situation, 9 ways to see it"

9takes is a personality-based Q&A platform built on the Enneagram personality system. It helps people decode social dynamics, personality-max their EQ, and turn conflict into understanding.

### Core Problem We Solve
Social media has become inauthentic, filled with echo chambers and performative behavior. 9takes restores serendipity, playfulness, and realness by creating structure for productive online conversations.

### Unique Value Propositions

1. **Give-First Mechanic**: Comments are revealed after you comment, not before. This ensures original, unbiased responses—your authentic perspective comes before outside influence kicks in.

2. **Personality-Based Context**: Users are anonymous except for their Enneagram type, providing meaningful context without divisive demographics. The emotions behind someone's opinion matter more than the opinion itself.

3. **Question-Centric Design**: Questions invite responses and create meaningful interactions, unlike posts that don't encourage dialogue.

4. **Open Source Conflict Resolution**: Transform personal dilemmas into crowd-sourced wisdom through diverse personality perspectives. Post your situation, get 9 different takes.

5. **Ancient Wisdom, Modern Application**: From Plato's soul theory to modern psychology—the Enneagram bridges 2,500 years of human nature wisdom with practical social navigation.

### Platform Offerings

- **Questions Platform** (9takes.com/questions): Get unbiased feedback on any situation with crowd-sourced wisdom
- **Personality Analysis** (9takes.com/personality-analysis): Analyze famous people through the Enneagram lens to build mental models for reading people
- **Educational Content** (9takes.com/enneagram-corner): Learn Enneagram principles and applications for long-term social advantage
- **Individual Coaching** (9takes.com/book-session): Direct application of Enneagram insights with personalized EQ development

### The 9 Enneagram Types

- **Type 1 (Reformer)**: Principled, purposeful, perfectionistic—needs things done right
- **Type 2 (Helper)**: Generous, demonstrative, people-pleasing—motivated by being needed
- **Type 3 (Achiever)**: Adaptive, driven, image-conscious—focused on success and recognition
- **Type 4 (Individualist)**: Expressive, dramatic, self-aware—seeks authenticity and depth
- **Type 5 (Investigator)**: Perceptive, innovative, private—needs processing time and space
- **Type 6 (Loyalist)**: Engaging, responsible, security-focused—values trust and reassurance
- **Type 7 (Enthusiast)**: Spontaneous, versatile, optimistic—seeks variety and possibility
- **Type 8 (Challenger)**: Self-confident, decisive, direct—respects strength and honesty
- **Type 9 (Peacemaker)**: Receptive, reassuring, accommodating—values harmony and understanding

### Brand Voice

- **Tactically Direct**: No fluff; actionable info that works
- **Socially Savvy**: Connect insights to real-world social wins
- **Respectfully Provocative**: Challenge comfort zones without shaming
- **Pattern-Recognition Focused**: Show the emotional logic behind behavior
- **Results-Driven**: Encouraging but focused on practical outcomes

### Core Philosophies

- "Understanding beats judgment. Pattern recognition beats guesswork."
- "Give your take first—authentic perspective comes before influence."
- "The emotions behind someone's opinion matter more than the opinion itself."
- "Nine types of human nature, infinite applications."

---

## Your Task

Generate email content based on user instructions. The emails should:
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

		// Create instance of SmartLLMService with supabase for logging
		const llmService = new SmartLLMService({
			httpReferer: 'https://9takes.com',
			appName: '9takes-email-dashboard',
			supabase
		});

		const result = await llmService.getJSONResponse<GenerateEmailResponse>({
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
