// src/lib/server/injectedStyleOrder.spec.ts
import { describe, expect, it } from 'vitest';

import { moveInjectedStylesAfterStylesheets } from './injectedStyleOrder';

const page = (head: string, body = '<p>post</p>') =>
	`<!doctype html><html><head><meta charset="utf-8" />${head}</head><body>${body}</body></html>`;

describe('moveInjectedStylesAfterStylesheets', () => {
	it('moves injected component styles after the stylesheet links, keeping their order', () => {
		const html = page(
			'<title>Post</title><style id="svelte-abc1">.a.svelte-abc1{color:red}</style>' +
				'<style id="svelte-def2">.b.svelte-def2{margin:0}</style>' +
				'<link href="/_app/immutable/assets/0.css" rel="stylesheet">' +
				'<link href="/_app/immutable/assets/78.css" rel="stylesheet">'
		);

		expect(moveInjectedStylesAfterStylesheets(html)).toBe(
			page(
				'<title>Post</title>' +
					'<link href="/_app/immutable/assets/0.css" rel="stylesheet">' +
					'<link href="/_app/immutable/assets/78.css" rel="stylesheet">' +
					'<style id="svelte-abc1">.a.svelte-abc1{color:red}</style>' +
					'<style id="svelte-def2">.b.svelte-def2{margin:0}</style>'
			)
		);
	});

	it('leaves pages without injected styles untouched', () => {
		const html = page('<link href="/_app/immutable/assets/0.css" rel="stylesheet">');
		expect(moveInjectedStylesAfterStylesheets(html)).toBe(html);
	});

	it('only touches the head, never body content', () => {
		const body = '<pre>&lt;style id="svelte-x"&gt;</pre><style id="svelte-zz9">.z{}</style>';
		const html = page('<link href="/a.css" rel="stylesheet">', body);
		expect(moveInjectedStylesAfterStylesheets(html)).toBe(html);
	});

	it('ignores other style tags', () => {
		const html = page('<style>.sk{}</style><link href="/a.css" rel="stylesheet">');
		expect(moveInjectedStylesAfterStylesheets(html)).toBe(html);
	});

	it('returns chunks without a closing head unchanged', () => {
		const chunk = '<script>__sveltekit_x.resolve(1, () => [{}])</script>';
		expect(moveInjectedStylesAfterStylesheets(chunk)).toBe(chunk);
	});
});
