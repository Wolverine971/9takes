// src/lib/data/enneagramCompatibility.ts
/**
 * Single source of truth for the 45 Enneagram type pairings on
 * /enneagram-corner/enneagram-compatibility-matrix. Three surfaces render from
 * this module, so an edit here updates all of them:
 *
 *   - the 9x9 compatibility chart (CompatibilityChart.svelte)
 *   - the pick-two-types calculator (CompatibilityCalculator.svelte)
 *   - the full per-pair reads (CompatibilityReads.svelte)
 *
 * Editing notes:
 *   - Prose fields allow one inline markup: [link text](/internal-path).
 *   - Quotes and apostrophes are stored curly, matching MDsvex smartypants output.
 *   - The heading anchors (e.g. #4--8-the-intense-power) derive from `types` +
 *     `title`. Renaming a title changes its anchor, which breaks inbound
 *     fragment links. Treat titles as frozen.
 *   - No em dashes (blog lint rule).
 */
import type { EnneagramType } from '$lib/enneagram/selfReportedType';

export type { EnneagramType };

export interface CompatibilityPairing {
	/** Lower type first. Pairings are order-insensitive: 8 + 4 reads as 4 + 8. */
	types: readonly [EnneagramType, EnneagramType];
	/** Pairing name, e.g. "The Intense Power". Frozen: it feeds the anchor id. */
	title: string;
	/** Short chart-cell label: where the pairing tends to crack. */
	faultLine: string;
	/** What pulls the pair together. */
	draw: string;
	/** How the fault line shows up. */
	crack: string;
	/** What makes it work (rendered after a bold "What makes it work:" label). */
	works: string;
}

export interface TextSegment {
	text: string;
	href?: string;
}

export const ENNEAGRAM_TYPES: readonly EnneagramType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Short type names used by the chart headers and calculator options. */
export const COMPATIBILITY_TYPE_NAMES: Readonly<Record<EnneagramType, string>> = {
	1: 'Perfectionist',
	2: 'Helper',
	3: 'Achiever',
	4: 'Individualist',
	5: 'Investigator',
	6: 'Loyalist',
	7: 'Enthusiast',
	8: 'Challenger',
	9: 'Peacemaker'
};

/** The pair the calculator shows when the URL does not pick one. */
export const DEFAULT_CALCULATOR_PAIR: Readonly<{ a: EnneagramType; b: EnneagramType }> = {
	a: 2,
	b: 8
};

/** Element id of the calculator section; shared links land here. */
export const CALCULATOR_ANCHOR_ID = 'compatibility-calculator';

export const COMPATIBILITY_PAIRINGS: readonly CompatibilityPairing[] = [
	{
		types: [1, 1],
		title: 'The Perfectionist Mirror',
		faultLine: 'Rigidity spirals',
		draw: 'Two Ones create a relationship built on shared standards and mutual understanding of the constant inner critic. They instinctively know why the other needs things done “right.”',
		crack:
			'The danger zone: their inner critics can team up against the relationship itself. When stressed, they may compete over who has the correct moral position. Rigidity spirals become common.',
		works:
			'Deliberately practicing imperfection together. Scheduling play. Agreeing that “good enough” is sometimes the goal.'
	},
	{
		types: [1, 2],
		title: 'The Reformer and Helper Dance',
		faultLine: 'Criticism vs. unappreciated care',
		draw: 'The Two softens the One’s sharp edges with warmth and emotional attunement. The One provides structure and principled direction the Two secretly craves.',
		crack:
			'Watch for this pattern: the One criticizes the Two’s “emotional” approach to problems. The Two starts feeling their care goes unappreciated. Resentment builds on both sides.',
		works:
			'The One must express appreciation out loud instead of assuming it’s understood. The Two must develop boundaries instead of martyring themselves.'
	},
	{
		types: [1, 3],
		title: 'The Achievement Partnership',
		faultLine: 'Right way vs. winning',
		draw: 'Both types share a drive for excellence and improvement. They can build impressive things together when aligned.',
		crack:
			'The friction point: they define success differently. Ones care about doing things the right way. Threes care about winning. These goals overlap until they don’t.',
		works:
			'Aligning on shared values that transcend external achievement. Finding projects where moral integrity and success converge.'
	},
	{
		types: [1, 4],
		title: 'The Idealist Connection',
		faultLine: 'Criticism vs. sensitivity',
		draw: 'Both types care deeply about authenticity and meaning. They connect through shared appreciation for what matters.',
		crack:
			'The collision: One’s criticism hits the Four’s sensitivity like a precision strike. Four’s emotional intensity overwhelms the One’s need for order. Both feel misunderstood.',
		works:
			'Creating beauty together through disciplined practice. The One learns that feelings have their own logic. The Four learns that structure can support depth.'
	},
	{
		types: [1, 5],
		title: 'The Analytical Alliance',
		faultLine: 'Both retreat, hearts unfed',
		draw: 'Mutual respect for competence and precision creates immediate rapport. Both value doing things correctly and appreciate expertise.',
		crack:
			'The gap: both types retreat under stress, and emotional connection starves. Conversations stay in the head while hearts go unfed.',
		works:
			'Using intellectual intimacy as a gateway to emotional connection. Scheduling dedicated time for non-analytical relating.'
	},
	{
		types: [1, 6],
		title: 'The Security System',
		faultLine: 'Anxiety feeding anxiety',
		draw: 'Shared need for certainty and doing things “right” creates a stable foundation. Both understand why you need to think things through.',
		crack:
			'The trap: anxiety feeding anxiety. Analysis paralysis when decisions need to be made. Neither trusting themselves or each other enough to act.',
		works:
			'Being each other’s voice of reason when fear takes over. Taking imperfect action together and surviving the consequences.'
	},
	{
		types: [1, 7],
		title: 'The Paradox Pairing',
		faultLine: 'Rules vs. freedom',
		draw: 'Intense attraction of opposites. The One is drawn to the Seven’s spontaneity and self-acceptance. The Seven is drawn to the One’s focus and conviction.',
		crack:
			'The clash is predictable: One’s rules versus Seven’s freedom. One sees Seven as irresponsible. Seven sees One as uptight. Both are partially right.',
		works:
			'The One learns that joy is not irresponsible. The Seven learns that depth requires staying with discomfort. Scheduled spontaneity and structured adventure satisfy both.'
	},
	{
		types: [1, 8],
		title: 'The Power Struggle',
		faultLine: 'Righteousness wars',
		draw: 'Mutual respect for strength and conviction. Both types have strong opinions and are willing to fight for them.',
		crack:
			'The battle: control competitions and righteousness wars. Each believes they have the correct position and neither backs down easily.',
		works:
			'Finding causes bigger than both egos. Learning when to yield. Channeling combined intensity toward shared missions.'
	},
	{
		types: [1, 9],
		title: 'The Peaceful Reform',
		faultLine: 'More criticism, more retreat',
		draw: 'The Nine calms the One’s relentless intensity. The One motivates the Nine to take action on things that matter. This can be a deeply complementary pairing.',
		crack:
			'The problem: One’s criticism shuts down the conflict-avoidant Nine. The Nine goes passive. The One gets more critical trying to provoke a response. The Nine retreats further.',
		works:
			'Gentle accountability instead of sharp criticism. Patient progress over demands for immediate change. The One learns that slowness is not laziness. The Nine learns that tension is not catastrophe.'
	},
	{
		types: [2, 2],
		title: 'The Giving Competition',
		faultLine: 'Secret scorekeeping',
		draw: 'Deep empathy creates instant connection. Both understand the impulse to care for others first.',
		crack:
			'The trap: neither admits their own needs. Both keep giving while secretly keeping score. Resentment builds as each waits for the other to finally give back without being asked.',
		works:
			'Consciously taking turns being the supported one. Learning to receive without immediately reciprocating.'
	},
	{
		types: [2, 3],
		title: 'The Power Couple',
		faultLine: 'Used vs. smothered',
		draw: 'The Two supports the Three’s ambitions with warmth and encouragement. The Three appreciates the Two’s care and brings excitement and success to the relationship.',
		crack:
			'The fracture: the Two starts feeling used for support without getting emotional depth back. The Three feels smothered by the Two’s need for closeness.',
		works:
			'Scheduled [quality time](/enneagram-corner/love-languages-and-enneagram-types) disconnected from achievements. The Three learns to be present. The Two learns that the Three’s drive is not rejection.'
	},
	{
		types: [2, 4],
		title: 'The Emotional Intensity',
		faultLine: 'Escalation, no resolution',
		draw: 'Both types live in the heart center. Deep emotional connection and understanding come naturally.',
		crack:
			'The storm: emotional escalation without resolution. The Two’s people-pleasing conflicts with the Four’s need for authenticity. Identity confusion about where one person ends and the other begins.',
		works:
			'The Two learns to be honest about their own feelings instead of always attending to the Four’s. The Four learns to offer care instead of only receiving it.'
	},
	{
		types: [2, 5],
		title: 'The Unlikely Connection',
		faultLine: 'Connection vs. space',
		draw: 'The Two draws the Five out of their cave with warmth. The Five gives the Two something rare: space and independence.',
		crack:
			'The tension: the Two wants more connection. The Five wants more space. Each feels the other is withholding.',
		works:
			'Respecting different intimacy needs without taking it personally. The Two learns that solitude is not abandonment. The Five learns that closeness is not intrusion.'
	},
	{
		types: [2, 6],
		title: 'The Support System',
		faultLine: 'Anxiety and dependency',
		draw: 'Mutual loyalty and care create a foundation of trust. Both prioritize relationship and show up for each other.',
		crack:
			'The spiral: anxiety feeding anxiety. Dependency that stunts both people’s growth. Neither developing the independent strength they need.',
		works:
			'Encouraging each other’s autonomy even when it feels scary. Building individual strength alongside the relationship.'
	},
	{
		types: [2, 7],
		title: 'The Joy and Care',
		faultLine: 'Depth vs. skimming',
		draw: 'The Two grounds the Seven with emotional depth. The Seven lightens the Two with playfulness and optimism.',
		crack:
			'The gap: the Two wants to go deep. The Seven skims the surface of emotions to avoid pain. Both feel unfulfilled.',
		works:
			'The Two learns that playfulness is a valid form of connection. The Seven learns to stay present when emotions get heavy.'
	},
	{
		types: [2, 8],
		title: 'The Intense Bond',
		faultLine: 'Boundary violations',
		draw: 'Powerful protector-nurturer dynamic. The Eight provides strength and protection. The Two provides care and softness. Each gives the other something missing.',
		crack:
			'The clash: power struggles over who leads. Boundary violations in both directions. The Two manipulates through helpfulness. The Eight dominates through force.',
		works:
			'The Two develops their own strength instead of operating through the Eight. The Eight learns that vulnerability is not weakness.'
	},
	{
		types: [2, 9],
		title: 'The Gentle Connection',
		faultLine: 'Problems go underground',
		draw: 'Peaceful, supportive energy flows naturally. Both prioritize harmony and care for others.',
		crack:
			'The danger: both avoid conflict. Problems go underground and fester. Neither addresses issues directly until they become crises.',
		works:
			'Scheduled honest check-ins. Learning that addressing small issues prevents big explosions. Direct communication as an act of love.'
	},
	{
		types: [3, 3],
		title: 'The Success Partnership',
		faultLine: 'Competition, workaholism',
		draw: 'Shared ambition and mutual understanding of the drive to achieve. Both know why performance matters.',
		crack:
			'The problem: competition infiltrates the relationship. Workaholism becomes normalized. Neither slows down long enough to actually connect.',
		works:
			'Celebrating time together for its own sake. Learning that presence matters more than productivity.'
	},
	{
		types: [3, 4],
		title: 'The Success and Depth',
		faultLine: 'Image vs. authenticity',
		draw: 'The Three’s confidence attracts the Four. The Four’s emotional depth intrigues the Three. Initial chemistry can be intense.',
		crack:
			'The friction: Three’s image management collides with Four’s need for authenticity. The Three feels the Four is being dramatic. The Four feels the Three is being fake.',
		works:
			'The Three learns that vulnerability is not weakness. The Four learns that action is not inauthenticity.'
	},
	{
		types: [3, 5],
		title: 'The Strategic Alliance',
		faultLine: 'Feelings performed or analyzed',
		draw: 'Competence attraction and mutual respect for expertise. Both value doing things well.',
		crack:
			'The gap: both avoid emotions in different ways. The Three performs feelings. The Five analyzes them. Neither fully experiences them. Connection suffers.',
		works:
			'Using intellectual connection as a gateway to emotional intimacy. Developing heart language together.'
	},
	{
		types: [3, 6],
		title: 'The Achievement and Security',
		faultLine: 'Risk vs. caution',
		draw: 'The Three provides confidence and forward momentum. The Six provides loyalty and careful thinking. These can balance well.',
		crack:
			'The tension: Three’s risk-taking triggers Six’s anxiety. Six’s caution frustrates Three’s ambition.',
		works:
			'The Three learns prudence. The Six learns confidence. Together they build secure success.'
	},
	{
		types: [3, 7],
		title: 'The Dynamic Duo',
		faultLine: 'Stays surface-level',
		draw: 'High energy and optimism create an exciting dynamic. Both move fast and think positively.',
		crack:
			'The blind spot: avoiding negative emotions becomes a shared habit. Neither goes deep when things get hard. The relationship stays surface-level.',
		works:
			'Slowing down together. Staying present with discomfort. Having adventures that mean something.'
	},
	{
		types: [3, 8],
		title: 'The Power Alliance',
		faultLine: 'Power struggles',
		draw: 'Mutual respect for strength and capability. Both understand ambition and drive.',
		crack:
			'The clash: power struggles over who leads. Control issues on both sides. Neither comfortable being vulnerable.',
		works: 'Learning vulnerability together. Sharing leadership rather than fighting for it.'
	},
	{
		types: [3, 9],
		title: 'The Achievement and Peace',
		faultLine: 'Different paces',
		draw: 'The Three motivates the Nine toward action. The Nine calms the Three’s relentless drive. Good complementary energy.',
		crack:
			'The frustration: different paces and priorities. The Three feels slowed down. The Nine feels pushed.',
		works:
			'The Three learns that being matters. The Nine learns that doing matters. Balance emerges through mutual respect.'
	},
	{
		types: [4, 4],
		title: 'The Emotional Depths',
		faultLine: 'Who feels more',
		draw: 'Deep understanding and connection come naturally. Both know what it feels like to be different and to need authentic expression.',
		crack:
			'The storm: emotional escalation without anchor. Identity competition over who feels more deeply. Taking turns spiraling while the other tries to help.',
		works:
			'Learning emotional regulation as a shared practice. Taking turns being the supported one instead of both drowning simultaneously.'
	},
	{
		types: [4, 5],
		title: 'The Depth and Detachment',
		faultLine: 'Abandoned vs. smothered',
		draw: 'Intellectual and creative connection creates initial rapport. Both appreciate complexity and nuance.',
		crack:
			'The divide: Four’s emotional needs collide with Five’s space needs. The Four feels abandoned. The Five feels smothered. Neither understands the other’s rhythm.',
		works:
			'The Four learns that solitude is not rejection. The Five learns that emotions are not threats. Respecting different processing styles keeps the relationship workable.'
	},
	{
		types: [4, 6],
		title: 'The Intensity and Anxiety',
		faultLine: 'Activated fears',
		draw: 'Deep loyalty and understanding create a strong bond. Both know what it means to feel uncertain about their place in the world.',
		crack:
			'The trigger zone: they activate each other’s fears. The Four’s intensity alarms the Six. The Six’s doubt undermines the Four.',
		works:
			'Building security together. Becoming each other’s safe space rather than each other’s threat.'
	},
	{
		types: [4, 7],
		title: 'The Depth and Light',
		faultLine: 'Melancholy vs. forced positivity',
		draw: 'The Seven brings joy and lightness. The Four brings meaning and depth. Together they can access the full emotional spectrum.',
		crack:
			'The collision: Four’s melancholy versus Seven’s forced positivity. The Four feels dismissed. The Seven feels dragged down.',
		works:
			'Honoring the full emotional spectrum without judgment. The Four learns lightness is not shallow. The Seven learns depth is not depression.'
	},
	{
		types: [4, 8],
		title: 'The Intense Power',
		faultLine: 'Escalating eruptions',
		draw: 'Raw intensity and passion create magnetic attraction. Both types operate at high emotional voltage.',
		crack:
			'The explosion risk: power struggles and emotional eruptions. Neither backs down. Conflicts escalate quickly.',
		works:
			'Channeling intensity into creative expression. Learning emotional mastery together. Using the fire to build rather than destroy.'
	},
	{
		types: [4, 9],
		title: 'The Depth and Peace',
		faultLine: 'Unseen vs. overwhelmed',
		draw: 'The Nine’s calm balances the Four’s emotional storms. Complementary energy that can feel stabilizing.',
		crack:
			'The frustration: the Four feels unseen by the merging Nine. The Nine feels overwhelmed by the Four’s intensity.',
		works:
			'The Four learns that calm is not indifference. The Nine learns that intensity is not attack. Creating space for all emotions without drowning.'
	},
	{
		types: [5, 5],
		title: 'The Mind Meld',
		faultLine: 'Silent disconnection',
		draw: 'Intellectual paradise. Two minds exploring ideas together without judgment or pressure.',
		crack:
			'The gap: emotional disconnection can grow silently. Both prefer thinking to feeling. Hearts go unfed while minds flourish.',
		works:
			'Sharing inner worlds gradually. Developing heart connection alongside intellectual connection. Scheduling emotional intimacy.'
	},
	{
		types: [5, 6],
		title: 'The Research Partnership',
		faultLine: 'Analysis paralysis',
		draw: 'Shared love of understanding creates solid common ground. Both appreciate preparation and careful thinking.',
		crack:
			'The trap: analysis paralysis. Neither trusts enough to act. Both overthink decisions until opportunities pass.',
		works:
			'Balancing thinking with doing. Learning to trust themselves and each other. Taking action before certainty arrives.'
	},
	{
		types: [5, 7],
		title: 'The Mind and Adventure',
		faultLine: 'Exhausted vs. bored',
		draw: 'The Seven energizes the Five with enthusiasm and new experiences. The Five grounds the Seven with depth and focus.',
		crack:
			'The friction: drastically different energy levels and social needs. The Five gets exhausted. The Seven gets bored.',
		works:
			'Respecting different rhythms. The Five learns engagement. The Seven learns focus. Neither tries to change the other’s fundamental nature.'
	},
	{
		types: [5, 8],
		title: 'The Strategy and Power',
		faultLine: 'Push and retreat',
		draw: 'Respect for each other’s competence creates mutual admiration. The Eight values the Five’s intelligence. The Five values the Eight’s decisiveness.',
		crack:
			'The tension: Five’s withdrawal versus Eight’s intensity. The Eight pushes. The Five retreats. Neither understands the other’s response.',
		works:
			'Intellectual respect as foundation. The Five learns assertion. The Eight learns reflection. Meeting in the middle takes conscious effort.'
	},
	{
		types: [5, 9],
		title: 'The Quiet Understanding',
		faultLine: 'Drift no one notices',
		draw: 'Peaceful, low-demand connection feels easy initially. Neither pressures the other.',
		crack:
			'The drift: both withdraw when stressed. Distance grows without anyone noticing. The relationship can slowly starve.',
		works:
			'Gentle invitations to connect. Active engagement rather than passive coexistence. Noticing when distance grows and addressing it.'
	},
	{
		types: [6, 6],
		title: 'The Security Fortress',
		faultLine: 'Fear echoes',
		draw: 'Deep understanding and loyalty create a strong foundation. Both know what it feels like to need reassurance and certainty.',
		crack:
			'The spiral: anxiety amplification. When one worries, the other joins. Fear echoes instead of being soothed.',
		works: 'Building courage together. Being each other’s voice of faith when fear takes over.'
	},
	{
		types: [6, 7],
		title: 'The Security and Adventure',
		faultLine: 'Prepare vs. pretend',
		draw: 'The Seven brings optimism and forward energy. The Six brings grounding and careful thinking. These can complement well.',
		crack:
			'The clash: Six’s anxiety versus Seven’s avoidance. The Six wants to prepare for problems. The Seven wants to pretend problems do not exist.',
		works:
			'Safe adventures together. The Six learns to trust. The Seven learns to acknowledge difficulty.'
	},
	{
		types: [6, 8],
		title: 'The Loyalty and Power',
		faultLine: 'Questioning vs. certainty',
		draw: 'The Eight’s strength calms the Six’s anxiety. The Six feels protected. The Eight feels trusted.',
		crack:
			'The friction: Six’s questioning versus Eight’s certainty. The Six needs to verify. The Eight hates being doubted.',
		works:
			'Building trust through consistent behavior over time. The Six learns confidence. The Eight learns patience with questions.'
	},
	{
		types: [6, 9],
		title: 'The Loyal Peace',
		faultLine: 'Avoided decisions',
		draw: 'Mutual support and stability create a comfortable dynamic. Both value harmony and predictability.',
		crack:
			'The stagnation: both avoid difficult decisions. Problems accumulate while both wait for the other to act.',
		works: 'Learning decisive action together. Patient, steady progress on hard things.'
	},
	{
		types: [7, 7],
		title: 'The Adventure Explosion',
		faultLine: 'Neither processes pain',
		draw: 'Maximum fun and energy. Life becomes an endless series of exciting possibilities.',
		crack:
			'The void: avoiding difficulties and depth. Neither processes pain. The relationship stays surface-level even during crises.',
		works:
			'Learning to stay present with discomfort together. Having adventures that mean something beyond entertainment.'
	},
	{
		types: [7, 8],
		title: 'The Intensity and Joy',
		faultLine: 'Control vs. freedom',
		draw: 'High energy and passion create dynamic chemistry. Both types move fast and think big.',
		crack:
			'The conflict: different approaches to control. The Eight wants to dominate. The Seven wants freedom.',
		works:
			'The Seven learns commitment. The Eight learns lightness. Channeling combined energy toward shared goals.'
	},
	{
		types: [7, 9],
		title: 'The Joy and Peace',
		faultLine: 'Activity vs. peace',
		draw: 'The Nine grounds the Seven with acceptance. The Seven energizes the Nine with enthusiasm.',
		crack:
			'The imbalance: Seven’s constant activity versus Nine’s need for peace. The Seven feels slowed down. The Nine feels exhausted.',
		works: 'Finding balanced rhythm. Active relaxation that satisfies both.'
	},
	{
		types: [8, 8],
		title: 'The Power Coupling',
		faultLine: 'Control battles',
		draw: 'Intense passion and mutual respect. Both understand strength and admire it in the other.',
		crack:
			'The war: control battles with no winner. Neither yields. Arguments become wars of attrition.',
		works:
			'Dividing territories clearly. Learning that surrender is not weakness. Finding causes bigger than either ego.'
	},
	{
		types: [8, 9],
		title: 'The Power and Peace',
		faultLine: 'Overwhelm, then passive aggression',
		draw: 'The Nine softens the Eight’s intensity. The Eight activates the Nine’s hidden fire. This pairing is common and can work beautifully.',
		crack:
			'The override: Eight’s intensity overwhelms the Nine. The Nine goes passive-aggressive. The Eight escalates.',
		works:
			'The Eight learns gentleness. The Nine learns assertion. Respecting that strength looks different in each person.'
	},
	{
		types: [9, 9],
		title: 'The Double Peace',
		faultLine: 'Mutual inaction',
		draw: 'Harmony and understanding come easily. Both prioritize peace and naturally merge with each other’s preferences.',
		crack:
			'The paralysis: mutual inaction and avoidance. Neither takes initiative. Both wait for the other to decide. Life happens to them instead of being shaped by them.',
		works:
			'Learning activation together. Gentle mutual encouragement to engage with life. Taking turns being the one who initiates.'
	}
];

function pairKey(a: EnneagramType, b: EnneagramType): string {
	return a <= b ? `${a}-${b}` : `${b}-${a}`;
}

const PAIRINGS_BY_KEY: ReadonlyMap<string, CompatibilityPairing> = new Map(
	COMPATIBILITY_PAIRINGS.map((pairing) => [pairKey(pairing.types[0], pairing.types[1]), pairing])
);

/** Order-insensitive lookup: getCompatibilityPairing(8, 4) === getCompatibilityPairing(4, 8). */
export function getCompatibilityPairing(a: EnneagramType, b: EnneagramType): CompatibilityPairing {
	const pairing = PAIRINGS_BY_KEY.get(pairKey(a, b));
	if (!pairing) {
		throw new Error(`Missing Enneagram compatibility pairing for ${a} + ${b}`);
	}
	return pairing;
}

/** Pairings listed under a type in the full reads: each pair sits under its lower number. */
export function pairingsListedUnder(type: EnneagramType): CompatibilityPairing[] {
	return COMPATIBILITY_PAIRINGS.filter((pairing) => pairing.types[0] === type);
}

/**
 * Heading slug compatible with rehype-slug (github-slugger) for these ASCII
 * headings: lowercase, drop punctuation (including curly apostrophes), and turn
 * each space into a hyphen. "4 + 8: The Intense Power" -> "4--8-the-intense-power".
 */
export function slugifyHeading(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\p{Letter}\p{Number}\s_-]/gu, '')
		.replace(/ /g, '-');
}

export function pairingHeading(pairing: CompatibilityPairing): string {
	return `${pairing.types[0]} + ${pairing.types[1]}: ${pairing.title}`;
}

export function pairingAnchor(pairing: CompatibilityPairing): string {
	return slugifyHeading(pairingHeading(pairing));
}

export function typeGroupHeading(type: EnneagramType): string {
	return `Type ${type} Compatibility: The ${COMPATIBILITY_TYPE_NAMES[type]}’s Relationships`;
}

/** Strict URL param parser: exactly one digit 1-9, otherwise null. */
export function parseTypeParam(value: string | null | undefined): EnneagramType | null {
	const trimmed = value?.trim() ?? '';
	return /^[1-9]$/.test(trimmed) ? (Number(trimmed) as EnneagramType) : null;
}

/** Reads ?a=&b= for the calculator. Each side falls back to the default on its own. */
export function resolveCalculatorPair(
	params: URLSearchParams,
	fallback: Readonly<{ a: EnneagramType; b: EnneagramType }> = DEFAULT_CALCULATOR_PAIR
): { a: EnneagramType; b: EnneagramType } {
	return {
		a: parseTypeParam(params.get('a')) ?? fallback.a,
		b: parseTypeParam(params.get('b')) ?? fallback.b
	};
}

/** Query + fragment for a shareable calculator link, e.g. "?a=4&b=8#compatibility-calculator". */
export function calculatorSearch(a: EnneagramType, b: EnneagramType): string {
	return `?a=${a}&b=${b}#${CALCULATOR_ANCHOR_ID}`;
}

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Splits prose into text and link segments for [text](/path) markup. Only
 * site-relative paths and in-page fragments become links; anything else stays
 * literal text, so the data can never emit an off-site or script URL.
 */
export function splitInlineLinks(text: string): TextSegment[] {
	const segments: TextSegment[] = [];
	let cursor = 0;

	for (const match of text.matchAll(INLINE_LINK)) {
		const [whole, label, href] = match;
		const index = match.index ?? 0;
		const isSafe = /^(?:\/(?!\/)|#)/.test(href);
		if (!isSafe) continue;

		if (index > cursor) segments.push({ text: text.slice(cursor, index) });
		segments.push({ text: label, href });
		cursor = index + whole.length;
	}

	if (cursor < text.length) segments.push({ text: text.slice(cursor) });
	return segments;
}
