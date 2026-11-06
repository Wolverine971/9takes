// src/lib/utils/betaDetailsEmail.spec.ts
import { describe, expect, it } from 'vitest';
import {
	BETA_BOOKING_PLACEHOLDER,
	betaDetailsEmailHtml,
	buildBetaDetailsEmail,
	buildGmailComposeUrl
} from './betaDetailsEmail';

describe('buildBetaDetailsEmail', () => {
	it('greets by first name when there is one', () => {
		expect(buildBetaDetailsEmail({ name: 'Ryan Smith' }).body.startsWith('Hey Ryan,')).toBe(true);
		expect(buildBetaDetailsEmail({ name: '' }).body.startsWith('Hey,')).toBe(true);
	});

	it('includes the booking link, or a visible placeholder without one', () => {
		expect(buildBetaDetailsEmail({ bookingUrl: 'https://booking.example/x' }).body).toContain(
			'Book your intro call here: https://booking.example/x'
		);
		expect(buildBetaDetailsEmail({}).body).toContain(BETA_BOOKING_PLACEHOLDER);
	});

	it('keeps the coaching disclaimer and the crisis line', () => {
		const { body } = buildBetaDetailsEmail({});
		expect(body).toContain('coaching, not clinical therapy');
		expect(body).toContain('988');
	});

	it('asks for a reply when they are not ready to book', () => {
		expect(buildBetaDetailsEmail({}).body).toContain('P.S. Not ready to book? Hit reply');
	});
});

describe('betaDetailsEmailHtml', () => {
	it('makes paragraphs, keeps line breaks, links URLs, and escapes text', () => {
		const html = betaDetailsEmailHtml(
			'Hi <you>\n\n1. one\n2. two\n\nBook: https://booking.example/x'
		);
		expect(html).toBe(
			'<p>Hi &lt;you&gt;</p>\n<p>1. one<br>2. two</p>\n<p>Book: <a href="https://booking.example/x">https://booking.example/x</a></p>'
		);
	});
});

describe('buildGmailComposeUrl', () => {
	it('opens a prefilled draft in the dj@9takes.com account', () => {
		const url = new URL(
			buildGmailComposeUrl({
				to: 'reader@example.com',
				subject: 'Hi & hello',
				body: 'Line 1\n\nLine 2'
			})
		);

		expect(url.origin).toBe('https://mail.google.com');
		expect(url.searchParams.get('authuser')).toBe('dj@9takes.com');
		expect(url.searchParams.get('view')).toBe('cm');
		expect(url.searchParams.get('to')).toBe('reader@example.com');
		expect(url.searchParams.get('su')).toBe('Hi & hello');
		expect(url.searchParams.get('body')).toBe('Line 1\n\nLine 2');
	});
});
