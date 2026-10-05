// src/lib/utils/betaDetailsEmail.spec.ts
import { describe, expect, it } from 'vitest';
import {
	BETA_BOOKING_PLACEHOLDER,
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
			'Grab a time here: https://booking.example/x'
		);
		expect(buildBetaDetailsEmail({}).body).toContain(BETA_BOOKING_PLACEHOLDER);
	});

	it('keeps the coaching disclaimer and the crisis line', () => {
		const { body } = buildBetaDetailsEmail({});
		expect(body).toContain('coaching, not clinical therapy');
		expect(body).toContain('988');
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
