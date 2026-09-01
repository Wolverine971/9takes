// src/lib/components/email/EmailComposeModal.ssr.spec.ts
import { readFile } from 'node:fs/promises';
import { compile } from 'svelte/compiler';
import { describe, expect, it } from 'vitest';

describe('EmailComposeModal SSR', () => {
	it('compiles personalization placeholders as literal template text', async () => {
		const filename = new URL('./EmailComposeModal.svelte', import.meta.url);
		const source = await readFile(filename, 'utf8');
		const { js } = compile(source, { filename: filename.pathname, generate: 'server' });

		expect(js.code).toContain("placeholder: '<h1>Hello {{ name }}!</h1>");
	});
});
