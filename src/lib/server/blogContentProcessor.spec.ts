// src/lib/server/blogContentProcessor.spec.ts
import { describe, expect, it } from 'vitest';
import { processBlogContent } from './blogContentProcessor';

describe('processBlogContent', () => {
	it('turns an explicit Enneagram dossier element into one article slot', async () => {
		const result = await processBlogContent(`Diagnosis copy.

<EnneagramTypeDossier />

<EnneagramTypeDossier />

## Next section`);

		expect(result.content.match(/data-article-slot="enneagram-type-dossier"/g)).toHaveLength(1);
		expect(result.content).not.toContain('<EnneagramTypeDossier');
		expect(result.placeholders).not.toContainEqual(
			expect.objectContaining({ type: 'EnneagramTypeDossier' })
		);
	});

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
		expect(result.content).toContain("What is Taylor Swift's type?");
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
		expect(first.content).toContain('The fight that started 9takes');
		expect(first.content.indexOf('The fight that started 9takes')).toBeLessThan(
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
		expect(result.content.match(/The fight that started 9takes/g)).toHaveLength(1);
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

	it('semantically opts personality-article PopCards into the contained portrait treatment', async () => {
		const result = await processBlogContent(
			'<PopCard image="/types/3s/Taylor-Swift.webp" displayText="Taylor Swift" />',
			{ popCardImageTreatment: 'personality' }
		);

		expect(result.placeholders[0].props).toMatchObject({
			imageTreatment: 'personality'
		});
		expect(result.content).toContain('class="pop-card pop-card--ssr personality-portrait-well"');
		expect(result.content).toContain('class="personality-portrait-image"');
	});

	it('renders registered evidence media with quote and image attribution before mounting', async () => {
		const result = await processBlogContent(
			'<EvidenceFigure evidenceId="elon-kimbal-musk-empathy-quote" />'
		);

		expect(result.placeholders[0]).toEqual({
			id: 'component-evidencefigure-0',
			type: 'EvidenceFigure',
			props: { evidenceId: 'elon-kimbal-musk-empathy-quote' }
		});
		expect(result.content).toContain('data-evidence-id="elon-kimbal-musk-empathy-quote"');
		expect(result.content).toContain('blog-evidence--portrait');
		expect(result.content).toContain('Kimbal Musk');
		expect(result.content).toContain('Quote source');
		expect(result.content).toContain('What Elon Musk Really Believes');
		expect(result.content).toContain('CC BY-SA 4.0');
		expect(result.content).toContain('edited for web');
	});

	it("treats DJ's structured read marker as editorial-only", async () => {
		const result = await processBlogContent(
			'## DJ\'s reasoning: his mind is his shelter\n\nLead paragraph.\n\n<DJReadCard readId="elon-musk" />\n\nClosing paragraph.'
		);

		expect(result.placeholders).not.toEqual(
			expect.arrayContaining([expect.objectContaining({ type: 'DJReadCard' })])
		);
		expect(result.headings).toContainEqual({
			level: 2,
			text: 'How Elon Musk turns uncertainty into a map',
			id: 'how-elon-musk-turns-uncertainty-into-a-map'
		});
		expect(result.content).toContain('Lead paragraph.');
		expect(result.content).toContain('Closing paragraph.');
		expect(result.content).not.toContain("DJ's reasoning");
		expect(result.content).not.toContain('DJReadCard');
		expect(result.content).not.toContain('data-dj-read-id');
	});
});
