// src/lib/email/sequences.spec.ts
import { describe, expect, it } from 'vitest';
import peopleWall from '../data/people-wall.json';
import {
	REACTIVATION_PEOPLE_WALL_CARD_URLS,
	REACTIVATION_PEOPLE_WALL_URL,
	buildReactivationPersonUrl
} from './reactivation-sequence-content';
import { generateEmailHtml } from './base-template';
import { rewriteLinksForTracking, rewritePlainTextLinksForTracking } from './base-template';
import { ENNEAGRAM_TYPE_PROMPT_KEY } from './enneagram-type-prompt-content';
import { prepareSequenceSend, type SequenceSendRow, WELCOME_SEQUENCE_KEY } from './sequences';

function makeSequenceRow(overrides: Partial<SequenceSendRow> = {}): SequenceSendRow {
	return {
		enrollment_id: 'enrollment-1',
		sequence_key: 'custom_sequence',
		user_id: 'user-1',
		recipient_email: 'alice@example.com',
		recipient_source: 'profiles',
		recipient_source_id: 'user-1',
		recipient_name: 'Alice',
		enneagram: '5',
		step_number: 1,
		subject: 'Welcome, {{first_name}}',
		html_content:
			'<p>Hello {{first_name}}</p><a href="{{questions_url}}">Browse</a><p>{{unknown_token}}</p>',
		plain_text: 'Hi {{first_name}} - {{ask_question_url}}',
		...overrides
	};
}

describe('prepareSequenceSend', () => {
	it('renders supported tokens into outbound message content', () => {
		const prepared = prepareSequenceSend(makeSequenceRow());

		expect(prepared.subject).toBe('Welcome, Alice');
		expect(prepared.htmlContent).toContain('<p>Hello Alice</p>');
		expect(prepared.htmlContent).toContain('https://9takes.com/questions');
		expect(prepared.plainText).toBe('Hi Alice - https://9takes.com/questions/create');
		expect(prepared.recipient).toEqual(
			expect.objectContaining({
				email: 'alice@example.com',
				name: 'Alice',
				source: 'profiles',
				source_id: 'user-1',
				enneagram: '5'
			})
		);
	});

	it('uses code-managed copy for the welcome sequence', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'welcome_sequence',
				step_number: 4,
				subject: 'Old DB subject',
				html_content: '<p>Old DB body</p>',
				plain_text: 'Old DB text'
			})
		);

		expect(prepared.subject).toBe("If 9takes isn't useful in these 3 moments, unsubscribe.");
		expect(prepared.preheader).toBe("I'd rather lose you than waste your inbox.");
		expect(prepared.htmlContent).toContain('Before you send a text you might regret');
		expect(prepared.htmlContent).not.toContain('Old DB body');
		expect(prepared.plainText).toContain(
			'Post it as a question: https://9takes.com/questions/create'
		);
		expect(prepared.plainText).not.toContain('Old DB text');
		expect(prepared.linkAttribution).toEqual({
			source: 'welcome',
			medium: 'email',
			campaign: 'welcome-sequence',
			content: 'welcome_sequence_step_4'
		});
	});

	it('prepares the one-off Enneagram type prompt with campaign attribution', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: ENNEAGRAM_TYPE_PROMPT_KEY,
				enneagram: 'unknown',
				subject: 'Database fallback subject',
				html_content: '<p>Database fallback body</p>',
				plain_text: 'Database fallback text'
			})
		);

		expect(prepared.subject).toBe('Make 9takes more useful to you');
		expect(prepared.preheader).toBe('Add your Enneagram type in less than a minute.');
		expect(prepared.htmlContent).toContain('Hi Alice,');
		expect(prepared.htmlContent).toContain('show you where the other types see it differently');
		expect(prepared.htmlContent).toContain('class="button" href="https://9takes.com/account"');
		expect(prepared.htmlContent).toContain(
			'https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type'
		);
		expect(prepared.plainText).toContain('No quiz score gets to decide for you');
		expect(prepared.linkAttribution).toEqual({
			source: 'enneagram-profile',
			medium: 'email',
			campaign: 'enneagram-type-prompt',
			content: 'enneagram_type_prompt_step_1'
		});
	});

	it.each([1, 2, 3, 4])(
		'attributes every first-party HTML and plain-text link in welcome step %i',
		(stepNumber) => {
			const prepared = prepareSequenceSend(
				makeSequenceRow({
					sequence_key: WELCOME_SEQUENCE_KEY,
					step_number: stepNumber
				})
			);
			const trackingId = '550e8400-e29b-41d4-a716-446655440000';
			const trackedHtml = rewriteLinksForTracking(
				prepared.htmlContent,
				trackingId,
				'https://9takes.com',
				prepared.linkAttribution
			);
			const trackedPlainText = rewritePlainTextLinksForTracking(
				prepared.plainText ?? '',
				trackingId,
				'https://9takes.com',
				prepared.linkAttribution
			);

			const encodedTargets = [
				...trackedHtml.matchAll(/\/api\/track\/click\/[^/"']+\/([^"']+)/g),
				...trackedPlainText.matchAll(/\/api\/track\/click\/[^/\s]+\/([^\s.,;:!?]+)/g)
			].map((match) => new URL(decodeURIComponent(Buffer.from(match[1], 'base64url').toString())));

			expect(encodedTargets.length).toBeGreaterThanOrEqual(2);
			for (const target of encodedTargets) {
				expect(target.searchParams.get('utm_source')).toBe('welcome');
				expect(target.searchParams.get('utm_medium')).toBe('email');
				expect(target.searchParams.get('utm_campaign')).toBe('welcome-sequence');
				expect(target.searchParams.get('utm_content')).toMatch(
					new RegExp(`^welcome_sequence_step_${stepNumber}_link_\\d+$`)
				);
			}
		}
	);

	it('uses code-managed copy and profile-created date tokens for reactivation sequences', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'reactivation_dormant',
				step_number: 1,
				recipient_created_at: '2025-02-10T12:00:00.000Z',
				subject: 'Reactivation step 1',
				html_content:
					'<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
				plain_text:
					'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.'
			})
		);

		expect(prepared.subject).toBe(
			'Alice, you signed up for 9takes in February 2025. Quick re-introduction.'
		);
		expect(prepared.preheader).toBe('Take a peek inside the inner worlds of 27 public figures.');
		expect(prepared.htmlContent).toContain('https://9takes.com/personality-analysis/map');
		expect(prepared.htmlContent).toContain(
			'https://9takes.com/email/reactivation/people-wall/cards/emma-watson.jpg'
		);
		expect(
			prepared.htmlContent.match(
				/https:\/\/9takes\.com\/email\/reactivation\/people-wall\/cards\/[^"\s]+\.jpg/g
			)
		).toHaveLength(27);
		expect(prepared.htmlContent).not.toMatch(/<(?:map|area)\b|usemap=/i);

		const people = peopleWall.types.flatMap((row) => row.people);
		expect(people).toHaveLength(27);
		for (const person of people) {
			const profileUrl = buildReactivationPersonUrl(person.slug);
			expect(prepared.htmlContent).toContain(`href="${profileUrl.replaceAll('&', '&amp;')}"`);
			expect(prepared.htmlContent).toContain(
				`src="${REACTIVATION_PEOPLE_WALL_CARD_URLS[person.slug]}"`
			);

			const trackedProfile = new URL(profileUrl);
			expect(trackedProfile.searchParams.get('utm_source')).toBe('reactivation');
			expect(trackedProfile.searchParams.get('utm_medium')).toBe('email');
			expect(trackedProfile.searchParams.get('utm_campaign')).toBe('people-wall');
			expect(trackedProfile.searchParams.get('utm_content')).toBe(`person-${person.slug}`);
		}

		const wallCta = new URL(REACTIVATION_PEOPLE_WALL_URL);
		expect(wallCta.searchParams.get('utm_content')).toBe('people-wall-cta');
		expect(
			Buffer.byteLength(
				generateEmailHtml({
					subject: prepared.subject,
					preheader: prepared.preheader,
					content: prepared.htmlContent
				}),
				'utf8'
			)
		).toBeLessThan(90 * 1024);
		expect(prepared.htmlContent).toContain('See what drives them');
		expect(prepared.plainText).toContain('See what drives them:');
		expect(prepared.linkAttribution).toEqual({
			source: 'reactivation',
			medium: 'email',
			campaign: 'reactivation-sequence',
			content: 'reactivation_dormant_step_1'
		});
		expect(prepared.htmlContent).not.toContain('Old DB body');
	});

	it('uses edited database copy for reactivation sequences when present', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'reactivation_dormant',
				step_number: 2,
				subject: 'Custom subject for {{first_name}}',
				html_content: '<p>Custom body for {{first_name}}</p>',
				plain_text: 'Custom plain text for {{first_name}}'
			})
		);

		expect(prepared.subject).toBe('Custom subject for Alice');
		expect(prepared.htmlContent).toContain('<p>Custom body for Alice</p>');
		expect(prepared.htmlContent).not.toContain("9takes wasn't a product idea");
		expect(prepared.plainText).toBe('Custom plain text for Alice');
	});

	it('falls back to generated plain text when reactivation html is edited without plain text', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'reactivation_dormant',
				step_number: 2,
				subject: 'Custom subject',
				html_content: '<p>Custom html only</p>',
				plain_text: null
			})
		);

		expect(prepared.htmlContent).toContain('Custom html only');
		expect(prepared.plainText).toBeUndefined();
	});

	it('renders re-permission links with the send-time tracking placeholder', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'reactivation_dormant',
				step_number: 4,
				subject: 'Reactivation step 4',
				html_content:
					'<p>Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.</p>',
				plain_text:
					'Code-managed reactivation content. See src/lib/email/reactivation-sequence-content.ts.'
			})
		);

		expect(prepared.htmlContent).toContain(
			'https://9takes.com/api/email/re-permission/yes/__EMAIL_TRACKING_ID__'
		);
		expect(prepared.htmlContent).toContain(
			'https://9takes.com/api/email/re-permission/no/__EMAIL_TRACKING_ID__'
		);
		expect(prepared.plainText).toContain('__EMAIL_TRACKING_ID__');
	});

	it('escapes injected html values and preserves unknown tokens', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				recipient_name: '<script>alert(1)</script>'
			})
		);

		expect(prepared.subject).toBe('Welcome, <script>alert(1)</script>');
		expect(prepared.htmlContent).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
		expect(prepared.htmlContent).toContain('{{unknown_token}}');
		expect(prepared.linkAttribution).toBeUndefined();
	});

	it('falls back to "there" when no recipient name is available', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				recipient_name: null
			})
		);

		expect(prepared.subject).toBe('Welcome, there');
		expect(prepared.recipient.name).toBeUndefined();
	});

	it('treats whitespace-only names as missing recipient metadata', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				recipient_name: '   '
			})
		);

		expect(prepared.subject).toBe('Welcome, there');
		expect(prepared.recipient.name).toBeUndefined();
	});

	it('treats the claim RPC literal "there" name as missing and strips the subject token', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'reactivation_dormant',
				step_number: 1,
				recipient_name: 'there',
				recipient_created_at: '2025-09-10T12:00:00.000Z',
				subject: 'Reactivation step 1',
				html_content: '<p>Code-managed reactivation content</p>',
				plain_text: 'Code-managed reactivation content'
			})
		);

		expect(prepared.subject).toBe(
			'You signed up for 9takes in September 2025. Quick re-introduction.'
		);
		expect(prepared.recipient.name).toBeUndefined();
	});

	it('drops a leading first_name token from the subject when no name exists', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'welcome_sequence',
				step_number: 1,
				recipient_name: null
			})
		);

		expect(prepared.subject).toBe('What were you like as a kid? Three words.');
		expect(prepared.htmlContent).toContain('Hi there,');
	});

	it('re-capitalizes reactivation subjects after dropping the first_name token', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'reactivation_dormant',
				step_number: 1,
				recipient_name: null,
				recipient_created_at: '2025-02-10T12:00:00.000Z',
				subject: 'Reactivation step 1',
				html_content: '<p>Code-managed reactivation content</p>',
				plain_text: 'Code-managed reactivation content'
			})
		);

		expect(prepared.subject).toBe(
			'You signed up for 9takes in February 2025. Quick re-introduction.'
		);
	});

	it('keeps the leading first_name token in subjects when a name exists', () => {
		const prepared = prepareSequenceSend(
			makeSequenceRow({
				sequence_key: 'welcome_sequence',
				step_number: 1,
				recipient_name: 'Alice'
			})
		);

		expect(prepared.subject).toBe('Alice, what were you like as a kid? Three words.');
	});
});
