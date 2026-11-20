// src/lib/server/rssFeed.ts

// Values come from frontmatter and database rows, so none of them is trusted to be a string.
export type RssFeedPost = {
	title?: unknown;
	description?: unknown;
	loc?: unknown;
	rssDate?: unknown;
	rssUpdateDate?: unknown;
};

const XML_ENTITIES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&apos;'
};

// Characters XML 1.0 does not allow in a document at all.
const XML_INVALID_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;

/** Feed values are plain text, so every one is escaped before it goes into the document. */
export function escapeXml(value: unknown): string {
	return String(value ?? '')
		.replace(XML_INVALID_CHARACTERS, '')
		.replace(/[&<>"']/g, (character) => XML_ENTITIES[character]);
}

export function buildRssXml(posts: RssFeedPost[]): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:source="http://source.scripting.com/">
  <channel>
    <title>9takes RSS Feed</title>
    <link>https://9takes.com</link>
    <description>9takes- Anonymous questions and answers based on personality. What are people thinking, feeling, and doing?</description>
    ${posts
			.map(
				(post) =>
					`<item>
          <title>${escapeXml(post.title)}</title>
          <description>${escapeXml(post.description)}</description>
          <link>${escapeXml(post.loc)}</link>
          <pubDate>${escapeXml(post.rssDate)}</pubDate>
          <lastBuildDate>${escapeXml(post.rssUpdateDate)}</lastBuildDate>
        </item>
      `
			)
			.join('')}
  </channel>
</rss>`;
}
