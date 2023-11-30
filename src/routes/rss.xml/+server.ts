import { getPosts } from '$lib/getPosts';

const name = '9takes';
const website = 'https://9takes.com';

export async function GET() {
  const posts = await getPosts();
  const body = xml(posts);

  // const headers = {
  // 	'Cache-Control': 'max-age=0, s-maxage=3600',
  // 	'Content-Type': 'application/xml'
  // };
  return new Response(body);
}

const xml = (posts: any) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:source="http://source.scripting.com/">
  <channel>
    <title>9takes</title>
    <link>https://9takes.com/</link>
    <description>9takes- Anonymous questions and answers based on personality. What are people thinking, feeling, and doing?</description>
    ${posts
    .map(
      (post: any) =>
        `<item>
          <title>${post.title}</title>
          <description>${post.description}</description>
          <link>${post.loc}/</link>
          <pubDate>${post.rssDate}</pubDate>
          <lastBuildDate>${post.rssUpdateDate}</lastBuildDate>
        </item>
      `
    )
    .join('')}
  </channel>
</rss>`;

// <updated>${post.rssUpdateDate}</updated>;
// <content:encoded>
// 	${post.previewHtml}
// 	<div style="margin-top: 50px; font-style: italic;">
// 		<strong>
// 			<a href="${post.loc}">Keep reading</a>
// 		</strong>
// 	</div>
// </content:encoded>;
