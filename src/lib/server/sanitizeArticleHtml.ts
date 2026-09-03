// src/lib/server/sanitizeArticleHtml.ts
import sanitizeHtml from 'sanitize-html';

/** Database-authored HTML is rendered with @html, so enforce this boundary even
 * when the author is an admin. Compromised content must not execute scripts. */
export function sanitizeArticleHtml(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: [
			...sanitizeHtml.defaults.allowedTags,
			'img',
			'figure',
			'figcaption',
			'details',
			'summary',
			'iframe'
		],
		allowedAttributes: {
			'*': [
				'id',
				'class',
				'title',
				'role',
				'aria-*',
				'data-*',
				'itemscope',
				'itemtype',
				'itemprop',
				'style'
			],
			a: ['href', 'name', 'target', 'rel'],
			img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
			iframe: [
				'src',
				'title',
				'width',
				'height',
				'allow',
				'allowfullscreen',
				'loading',
				'referrerpolicy'
			],
			th: ['colspan', 'rowspan', 'scope'],
			td: ['colspan', 'rowspan']
		},
		allowedIframeHostnames: [
			'www.youtube.com',
			'www.youtube-nocookie.com',
			'open.spotify.com',
			'player.vimeo.com'
		],
		allowedSchemes: ['http', 'https', 'mailto', 'tel'],
		allowProtocolRelative: false,
		allowedStyles: {
			'*': {
				width: [/^\d+(?:\.\d+)?(?:px|%)$/],
				display: [/^(?:flex|block|inline|inline-block|none)$/],
				'justify-content': [/^(?:center|start|end|space-between)$/],
				'object-position': [/^[\d.%\s-]+$/],
				'text-align': [/^(?:left|right|center)$/]
			}
		},
		transformTags: {
			a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } })
		}
	});
}
