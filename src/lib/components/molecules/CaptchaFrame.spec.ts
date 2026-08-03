// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import CaptchaFrame from './CaptchaFrame.svelte';

describe('CaptchaFrame', () => {
	afterEach(cleanup);

	it('provides a named security-verification group around its content', () => {
		const children = createRawSnippet(() => ({
			render: () => '<div data-testid="captcha-widget">CAPTCHA</div>'
		}));

		render(CaptchaFrame, { props: { children } });

		const group = screen.getByRole('group', { name: 'Security verification' });
		expect(group.textContent).toContain('CAPTCHA');
	});
});
