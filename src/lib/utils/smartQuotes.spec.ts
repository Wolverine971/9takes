// src/lib/utils/smartQuotes.spec.ts
import { describe, expect, it } from 'vitest';
import { smartQuotesHtml, smartQuotesText } from './smartQuotes';

describe('smartQuotesHtml', () => {
	it('curls double quotes, apostrophes, and nested single quotes', () => {
		expect(smartQuotesText(`He said "I don't know."`)).toBe('He said “I don’t know.”');
		expect(smartQuotesText(`"She told me 'no,' then left."`)).toBe(
			'“She told me ‘no,’ then left.”'
		);
		expect(smartQuotesText(`Loki's "last line" — "For you."`)).toBe(
			'Loki’s “last line” — “For you.”'
		);
	});

	it('opens after brackets and dashes, closes after punctuation', () => {
		expect(smartQuotesText(`("quiet") and —"loud"`)).toBe('(“quiet”) and —“loud”');
		expect(smartQuotesText(`"Really?" she asked.`)).toBe('“Really?” she asked.');
	});

	it('treats leading elisions and decades as apostrophes', () => {
		expect(smartQuotesText(`the '90s, rock 'n' roll, 'em, 'til dawn`)).toBe(
			'the ’90s, rock ’n’ roll, ’em, ’til dawn'
		);
		expect(smartQuotesText(`she said 'nothing'`)).toBe('she said ‘nothing’');
	});

	it('keeps feet-and-inches marks straight', () => {
		expect(smartQuotesText(`He is 6'2" tall`)).toBe(`He is 6'2" tall`);
	});

	it('carries context across inline tags and resets at block tags', () => {
		expect(smartQuotesHtml(`<p>He loved "<em>Breakfast at Tiffany's</em>" most.</p>`)).toBe(
			'<p>He loved “<em>Breakfast at Tiffany’s</em>” most.</p>'
		);
		expect(smartQuotesHtml(`<p><em>Loki</em>'s arc</p><p>"New paragraph"</p>`)).toBe(
			'<p><em>Loki</em>’s arc</p><p>“New paragraph”</p>'
		);
	});

	it('converts entity-encoded quotes', () => {
		expect(smartQuotesHtml('<p>&quot;Go&quot; and it&#39;s &#x27;fine&#x27;</p>')).toBe(
			'<p>“Go” and it’s ‘fine’</p>'
		);
	});

	it('never touches attributes, comments, or code', () => {
		const html =
			'<a href="/x?q=\'a\'" title="say &quot;hi&quot;">"link"</a><!-- "note" --><code>"raw" it\'s</code><pre><code>x = "y"</code></pre>';
		expect(smartQuotesHtml(html)).toBe(
			'<a href="/x?q=\'a\'" title="say &quot;hi&quot;">“link”</a><!-- "note" --><code>"raw" it\'s</code><pre><code>x = "y"</code></pre>'
		);
	});

	it('is idempotent', () => {
		const once = smartQuotesHtml(`<p>"It's done," she said.</p>`);
		expect(smartQuotesHtml(once)).toBe(once);
	});
});
