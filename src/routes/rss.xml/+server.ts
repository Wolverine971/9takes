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

const xml = (
	posts: any
) => `<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>9takes</title>
    <link>https://9takes.com/</link>
    <description>A blog built with SvelteKit about tech and stuff!</description>
    ${posts
			.map(
				(post: any) =>
					`<item>
          <title>${post.title}</title>
          <description>${post.description}</description>
          <link>${post.loc}/</link>
          <pubDate>${new Date(post.date)}</pubDate>
          <<updated>${new Date(post.lastmod)}</updated>
          <content:encoded>${post.previewHtml} 
            <div style="margin-top: 50px; font-style: italic;">
              <strong>
                <a href="${post.loc}">
                  Keep reading
                </a>
              </strong>  
            </div>
          </content:encoded>
        </item>
      `
			)
			.join('')}
  </channel>
</rss>`;
