// src/lib/email/reactivation-people-wall.ts
// Builds the email-safe, individually linked version of the 27-person wall.
// The web route can use ordinary responsive cards. Email uses a presentation
// table and one JPEG per person because responsive HTML image maps are not
// consistently supported across Gmail, Outlook, and mobile email clients.

import peopleWall from '$lib/data/people-wall.json';

type WallPerson = {
	slug: string;
	name: string;
	personaTitle: string;
};

type WallRow = {
	type: number;
	name: string;
	people: WallPerson[];
};

const PEOPLE_WALL_CAMPAIGN = 'people-wall';
const PEOPLE_WALL_CARD_BASE_URL = 'https://9takes.com/email/reactivation/people-wall/cards';

const TYPE_COLORS: Record<number, string> = {
	1: '#6366F1',
	2: '#F472B6',
	3: '#F59E0B',
	4: '#A855F7',
	5: '#0EA5E9',
	6: '#22C55E',
	7: '#FBBF24',
	8: '#DC2626',
	9: '#34D399'
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => {
		const entities: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return entities[character];
	});
}

function buildTrackedUrl(pathname: string, content: string): string {
	const url = new URL(pathname, 'https://9takes.com');
	url.searchParams.set('utm_source', 'reactivation');
	url.searchParams.set('utm_medium', 'email');
	url.searchParams.set('utm_campaign', PEOPLE_WALL_CAMPAIGN);
	url.searchParams.set('utm_content', content);
	return url.toString();
}

export function buildReactivationPersonUrl(slug: string): string {
	return buildTrackedUrl(`/personality-analysis/${slug}`, `person-${slug}`);
}

export const REACTIVATION_PEOPLE_WALL_URL = buildTrackedUrl(
	'/personality-analysis/map',
	'people-wall-cta'
);

// Kept as the canonical social/preview image for the people-wall route.
export const REACTIVATION_PEOPLE_WALL_IMAGE_URL =
	'https://9takes.com/email/reactivation/people-wall-v1.jpg';

export const REACTIVATION_PEOPLE_WALL_CARD_URLS = Object.fromEntries(
	(peopleWall.types as WallRow[]).flatMap((row) =>
		row.people.map((person) => [person.slug, `${PEOPLE_WALL_CARD_BASE_URL}/${person.slug}.jpg`])
	)
) as Record<string, string>;

function renderPersonCard(person: WallPerson, columnIndex: number): string {
	const profileUrl = buildReactivationPersonUrl(person.slug);
	const cardUrl = REACTIVATION_PEOPLE_WALL_CARD_URLS[person.slug];
	const rightPadding = columnIndex === 2 ? '0' : '4px';
	const alt = `${person.name}: ${person.personaTitle}`;

	return `<td width="33.333%" valign="top" style="width:33.333%;padding:0 ${rightPadding} 0 0;vertical-align:top;">
<a href="${escapeHtml(profileUrl)}" title="Read ${escapeHtml(person.name)}: ${escapeHtml(person.personaTitle)}" style="display:block;padding:8px 0;text-decoration:none;">
<img src="${cardUrl}" alt="${escapeHtml(alt)}" width="166" style="display:block;width:100%;max-width:166px;height:auto;border:0;border-radius:8px;" />
</a>
</td>`;
}

function renderTypeRow(row: WallRow, rowIndex: number): string {
	const typeColor = TYPE_COLORS[row.type];
	if (!typeColor) throw new Error(`Missing people-wall email color for Type ${row.type}`);

	const border = rowIndex === 0 ? '' : `border-top:1px solid ${typeColor};`;
	const cards = row.people.map(renderPersonCard).join('\n');

	return `<tr>
<td colspan="3" style="padding:${rowIndex === 0 ? '4px' : '14px'} 2px 6px;${border}font-family:'Courier New',Courier,monospace;font-size:10px;line-height:1.4;font-weight:700;letter-spacing:0.7px;color:${typeColor};text-transform:uppercase;">
TYPE ${row.type} &middot; THE ${escapeHtml(row.name.toUpperCase())}
</td>
</tr>
<tr>
${cards}
</tr>`;
}

function renderPeopleWall(): string {
	const rows = peopleWall.types as WallRow[];
	if (rows.length !== 9 || rows.some((row) => row.people.length !== 3)) {
		throw new Error('Reactivation people wall must contain nine rows of three people');
	}

	return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width:100%;max-width:520px;border-collapse:separate;background-color:#0A0807;border:1px solid #5C4F47;border-radius:16px;">
<tr>
<td style="padding:16px 12px 14px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width:100%;border-collapse:separate;">
<tr>
<td colspan="3" style="padding:0 2px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="font-family:'Courier New',Courier,monospace;font-size:11px;line-height:1.4;font-weight:700;letter-spacing:1px;color:#F59E0B;text-transform:uppercase;">&sect;01 &middot; PEOPLE INDEX</div>
<div style="padding-top:5px;font-size:15px;line-height:1.35;font-weight:700;color:#FAF8F4;">27 people &middot; 9 emotional patterns &middot; 400+ in-depth reads</div>
</td>
</tr>
${rows.map(renderTypeRow).join('\n')}
</table>
</td>
</tr>
</table>`;
}

export const REACTIVATION_PEOPLE_WALL_HTML = renderPeopleWall();
