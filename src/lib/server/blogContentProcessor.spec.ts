// src/lib/server/blogContentProcessor.spec.ts
import { describe, expect, it } from 'vitest';
import { processBlogContent } from './blogContentProcessor';

describe('processBlogContent', () => {
	it('renders QuickAnswer fallback HTML for crawlers before client mounting', async () => {
		const result = await processBlogContent(`<QuickAnswer question="What is Taylor Swift's type?">
Taylor reads as **Type 3** because image, momentum, and achievement keep returning as the pattern.
</QuickAnswer>

## Next section

Body copy.`);

		expect(result.placeholders[0]).toMatchObject({
			id: 'component-quickanswer-0',
			type: 'QuickAnswer',
			props: {
				question: "What is Taylor Swift's type?"
			}
		});
		expect(result.placeholders[0].props).not.toHaveProperty('is');
		expect(result.content).toContain('data-ssr-fallback');
		expect(result.content).toContain('itemscope itemtype="https://schema.org/Question"');
		expect(result.content).toContain('What is Taylor Swift&#39;s type?');
		expect(result.content).toContain('Taylor reads as **Type 3**');
	});

	it('auto-inserts a stable BlogPurpose fallback before the last h2', async () => {
		const first = await processBlogContent(`## First

Opening copy.

## Last

Closing copy.`);
		const second = await processBlogContent(`## First

Opening copy.

## Last

Closing copy.`);

		expect(first.content).toBe(second.content);
		expect(first.placeholders).toContainEqual({
			id: 'component-blogpurpose-0',
			type: 'BlogPurpose',
			props: {}
		});
		expect(first.content).toContain('Want to understand your own pattern?');
		expect(first.content.indexOf('Want to understand your own pattern?')).toBeLessThan(
			first.content.indexOf('<h2 id="last">Last</h2>')
		);
	});

	it('does not auto-insert BlogPurpose when the post already includes one', async () => {
		const result = await processBlogContent(`<BlogPurpose />

## Last

Closing copy.`);

		expect(result.placeholders).toEqual([
			{
				id: 'component-blogpurpose-0',
				type: 'BlogPurpose',
				props: {}
			}
		]);
		expect(result.content.match(/Want to understand your own pattern\\?/g)).toHaveLength(1);
	});

	it('keeps PopCard content visible as an SSR figure fallback', async () => {
		const result = await processBlogContent(
			'<PopCard image="/types/3s/Taylor-Swift.webp" displayText="Taylor Swift" subtext="Pop strategist" />'
		);

		expect(result.placeholders[0]).toMatchObject({
			id: 'component-popcard-0',
			type: 'PopCard'
		});
		expect(result.content).toContain('<figure class="pop-card pop-card--ssr">');
		expect(result.content).toContain('Taylor Swift');
		expect(result.content).toContain('Pop strategist');
	});
});
