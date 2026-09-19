// src/lib/rehype-internal-links.spec.ts
import { describe, expect, it } from 'vitest';
import rehypeInternalLinks, { normalizeInternalHref } from './rehype-internal-links.js';

type Node = {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: Node[];
};

const link = (href: string, rel?: unknown): Node => ({
	type: 'element',
	tagName: 'a',
	properties: rel === undefined ? { href } : { href, rel },
	children: []
});

const run = (node: Node): Node => {
	rehypeInternalLinks()({ type: 'root', children: [node] } as never);
	return node;
};

describe('normalizeInternalHref', () => {
	it('rewrites absolute 9takes URLs to root-relative paths', () => {
		expect(normalizeInternalHref('https://9takes.com/enneagram-corner/foo#bar')).toBe(
			'/enneagram-corner/foo#bar'
		);
		expect(normalizeInternalHref('https://www.9takes.com/questions?x=1')).toBe('/questions?x=1');
		expect(normalizeInternalHref('https://9takes.com')).toBe('/');
	});

	it('strips trailing slashes that would 308', () => {
		expect(normalizeInternalHref('https://9takes.com/enneagram-corner/')).toBe('/enneagram-corner');
		expect(normalizeInternalHref('/enneagram-corner/#top')).toBe('/enneagram-corner#top');
		expect(normalizeInternalHref('/')).toBe('/');
	});

	it('ignores external and protocol-relative links', () => {
		expect(normalizeInternalHref('https://example.com/9takes.com')).toBeNull();
		expect(normalizeInternalHref('https://9takes.com.evil.io/x')).toBeNull();
		expect(normalizeInternalHref('//cdn.example.com/a')).toBeNull();
		expect(normalizeInternalHref('#section')).toBeNull();
	});
});

describe('rehypeInternalLinks', () => {
	it('drops nofollow from internal links', () => {
		const node = run(link('https://9takes.com/questions', ['nofollow']));
		expect(node.properties).toEqual({ href: '/questions' });
	});

	it('keeps other rel tokens on internal links', () => {
		const node = run(link('https://9takes.com/questions', 'nofollow noopener'));
		expect(node.properties).toEqual({ href: '/questions', rel: ['noopener'] });
	});

	it('leaves external links untouched', () => {
		const node = run(link('https://example.com/', ['nofollow']));
		expect(node.properties).toEqual({ href: 'https://example.com/', rel: ['nofollow'] });
	});
});
