#!/usr/bin/env node
// scripts/blog-source-audit.mjs
//
// Load-bearing source audit for 9takes people-pipeline drafts (plan item 2.2).
//
// Read-only. For a SINGLE draft, extract the quotes/claims that sit in the five
// "load-bearing" narrative slots and classify each quote's attribution quality.
// The thesis of a personality analysis stands or falls on these five slots, so a
// skeptic must be able to trace the quotes in them:
//
//   1. Epigraph      the opening `> "quote" — Name, _Source_, Year` blockquote.
//   2. Cold open     the `<p class="firstLetter">` scene + the paragraphs that
//                    continue it up to the TL;DR / first H2 (the attribution for a
//                    cold-open quote frequently lands one paragraph below the scene).
//   3. Diagnosis     the paragraphs under `## What Is/is X's Personality Type?`
//                    and `### X is an Enneagram Type N`, where the verdict is argued.
//   4. Empathy turn  the negative-parallelism reframe sentence
//                    (`[behavior] was not [cruelty/vanity/evasion], it was [armor/reflex]`).
//   5. Close         the final one to two paragraphs of the body.
//
// Attribution tiers (traceability, not politeness):
//   inline    a named outlet/publication AND a year adjacent to the quote.
//   vague     attributed but incomplete: exactly one of {outlet, year}, OR a
//             source-venue word ("in an interview", "in his memoir") with no
//             outlet+year pinned.
//   untagged  a quote (or hard factual claim) with NO outlet, NO year, and NO
//             venue reference. A bare speech verb ("he explained decades later",
//             "he once said") counts as untagged: it names no traceable source.
//
// NOTE on the taxonomy: the plan text lists "he once said" as a *vague* example,
// but the ground-truth requirement (Goldblum's cold-open spine quote, attributed
// only "he explained decades later", must classify UNTAGGED) forces the sharper
// line drawn above: a bare attributive verb with zero source anchor is untagged,
// because that is exactly the untraceable failure mode this audit exists to catch.
// A *venue* reference ("in an interview") is what earns the vague tier.
//
// Usage:
//   node scripts/blog-source-audit.mjs <Person-Name | path/to/draft.md> [--json] [--fail-on-untagged-load-bearing]
//
// Exit codes: 0 = ran/clear, 1 = --fail-on-untagged-load-bearing and an untagged load-bearing slot was found, 2 = usage / file error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src', 'blog', 'people', 'drafts');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const failOnUntaggedLoadBearing = args.includes('--fail-on-untagged-load-bearing');
const positional = args.filter((a) => !a.startsWith('--'));
const target = positional[0];

if (!target) {
	process.stderr.write(
		'Usage: node scripts/blog-source-audit.mjs <Person-Name | path/to/draft.md> [--json] [--fail-on-untagged-load-bearing]\n'
	);
	process.exit(2);
}

function resolveDraftPath(arg) {
	const candidates = [
		arg,
		path.join(REPO_ROOT, arg),
		path.join(DRAFTS_DIR, arg.endsWith('.md') ? arg : `${arg}.md`)
	];
	for (const c of candidates) {
		try {
			if (fs.statSync(c).isFile()) return c;
		} catch {
			/* keep looking */
		}
	}
	return null;
}

const filePath = resolveDraftPath(target);
if (!filePath) {
	process.stderr.write(`Draft not found: ${target}\n`);
	process.exit(2);
}

// ---------------------------------------------------------------------------
// Parsing helpers (mirror scripts/blog-lint.sh: split FM/body, strip comments)
// ---------------------------------------------------------------------------
function splitFrontmatter(raw) {
	// Frontmatter lives between the first two lines that are exactly `---`.
	const lines = raw.split('\n');
	let first = -1;
	let second = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === '---') {
			if (first === -1) first = i;
			else {
				second = i;
				break;
			}
		}
	}
	if (first === -1 || second === -1) return { fm: '', body: raw };
	return {
		fm: lines.slice(first + 1, second).join('\n'),
		body: lines.slice(second + 1).join('\n')
	};
}

// Remove HTML comment blocks (ledgers, review notes) — multiline safe.
// Equivalent in intent to blog-lint.sh's line-based awk strip, but correct for
// inline and multi-line comments.
function stripComments(body) {
	return body.replace(/<!--[\s\S]*?-->/g, '');
}

function parseFrontmatter(fm) {
	const get = (key) => {
		const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
		if (!m) return null;
		return m[1].trim().replace(/^['"]/, '').replace(/['"]$/, '');
	};
	return {
		enneagram: (get('enneagram') || '').replace(/[^0-9]/g, '') || null,
		person: get('person'),
		title: get('title'),
		meta_title: get('meta_title'),
		date: get('date')
	};
}

// ---------------------------------------------------------------------------
// Attribution signal detection
// ---------------------------------------------------------------------------
// Unambiguous outlet names (multi-word or non-dictionary): matched case-sensitively.
const OUTLETS = [
	'The Guardian',
	'Guardian',
	'Rolling Stone',
	'Rolling Stone Australia',
	'Los Angeles Times',
	'Official Charts',
	'Sound on Sound',
	'SPIN',
	'Pitchfork',
	'On Purpose with Jay Shetty',
	'New Statesman',
	'IndieWire',
	"Men's Health",
	"Men's Journal",
	'Men’s Health',
	'Men’s Journal',
	'The Rake',
	'NPR',
	'WSJ',
	'Wall Street Journal',
	'CNN',
	'Entertainment Weekly',
	'Esquire',
	'V Magazine',
	'W Magazine',
	'Billboard',
	'Forbes',
	// Celebrity/teen-press and entertainment-trade outlets that carry the primary
	// interviews for this corpus's actor and pop-star pages (Victoria-Justice pass,
	// 2026-08-05). All are named, dated, checkable publications.
	'Marie Claire',
	'Her Campus',
	'The Daily Beast',
	'Daily Beast',
	'Us Weekly',
	'E! News',
	'Teen Vogue',
	'Seventeen',
	'PopCrush',
	'Just Jared',
	'Just Jared Jr.',
	'Nick.com',
	'Mythical Kitchen',
	'Last Meals',
	'Vanity Fair',
	'GQ',
	'Vulture',
	'Hollywood Reporter',
	'The Hollywood Reporter',
	'THR',
	'New York Times',
	'NYT',
	'The New Yorker',
	'New Yorker',
	'The Atlantic',
	'BBC',
	'Playboy',
	'Deadline',
	'Interview Magazine',
	'PAPER',
	'Hot Ones',
	// Sydney-Sweeney pass, 2026-08-15. Backstage is the acting trade that carries
	// primary craft interviews for this corpus; Israel Hayom is a major Israeli
	// daily running syndicated cover interviews. Both named, dated, checkable.
	'Backstage',
	'Israel Hayom',
	'Hollywood Authentic',
	'SmartLess',
	'So True',
	'Lipstick on the Rim',
	"Dinner's on Me",
	'Dinner’s on Me',
	'Bustle',
	'Howard Stern Show',
	'Behind the Wall',
	'TODAY',
	'Nielsen',
	'Cosmopolitan',
	'Detroit News',
	'Gizmodo',
	'Futurism',
	'Associated Press',
	'Bloomberg',
	'Sunday Times',
	'Rotten Tomatoes',
	'Pitchfork',
	'AV Club',
	'The Verge',
	'TechCrunch',
	'Business Insider',
	'Variety',
	'Scientific American',
	'60 Minutes',
	'The Talks',
	'The Telegraph',
	'The Independent',
	'The Scotsman',
	'Newsweek',
	'Happy Sad Confused',
	// Independent / creator-owned outlets that publish full transcripts (Hunter-Biden pass, 2026-07-25)
	'Channel 5',
	'Shawn Ryan Show',
	// Same class: long-form interview shows that post dated, public, full-text
	// transcripts, plus the streamers that are the publisher of record for a
	// dated stand-up special (Bill-Burr pass, 2026-08-19). Without these, a
	// quote pulled verbatim from a transcript or a special grades below a
	// paraphrase in a trade write-up of the same quote.
	'The Tim Ferriss Show',
	'Hulu',
	'Netflix',
	// Same class: lexfridman.com posts dated full-text transcripts of every
	// episode, so a quote pulled verbatim from one is as checkable as a trade
	// write-up (Demis-Hassabis pass, 2026-08-29).
	'Lex Fridman',
	// Checkable Chinese-language / China-coverage venues (Yang-Zhilin pass, 2026-07-23)
	'Tencent Tech',
	'Overseas Unicorn',
	'ChinaTalk',
	'SCMP',
	'South China Morning Post',
	'TechNode',
	'36Kr',
	'KrASIA',
	'First Push',
	'Zhongguancun Forum',
	'Yahoo Finance',
	'CNBC',
	// Tech/business outlet of record for the 2026 DeepMind step-down (the
	// "struggled to get satisfaction" exclusive); non-dictionary name, safe as
	// an unambiguous entry (Demis-Hassabis pass, 2026-08-29).
	'Semafor',
	// Creator-economy / streaming trade press (IShowSpeed pass, 2026-07-25).
	// These are the outlets that actually cover this corpus's creator pages;
	// without them every streamer quote grades untagged no matter how sourced.
	'Dexerto',
	'Sportskeeda',
	'Awful Announcing',
	'Streams Charts',
	// Same class, added on the Jynxzi pass (2026-07-25): checkable creator-economy
	// and games trade press that actually covers this corpus's streamer pages.
	'Dot Esports',
	'Tubefilter',
	'Chess.com',
	'PocketGamer.biz',
	'Kotaku',
	'Polygon',
	'The Verge',
	'TheGrio',
	'Club Shay Shay',
	'Al Jazeera',
	'Complex Networks',
	// Comedy podcasts that publish full public episodes (Stavros-Halkias pass,
	// 2026-07-25). Same class as Shawn Ryan Show / Club Shay Shay above: for
	// stand-up subjects these ARE the primary record, and a named show + date is
	// more checkable than most magazine attributions.
	'Joe Rogan Experience',
	'Are You Garbage',
	// Same class, added on the KSI pass (2026-07-31): Schulz's Flagrant publishes
	// full public episodes and is the primary record for KSI's therapy/goal quotes.
	'Flagrant',
	// Same class, added on the Nara-Smith pass (2026-08-04): the 29 July 2026
	// Call Her Daddy episode is a dated, 93-minute public episode and is the
	// primary record for nearly every load-bearing quote on that subject — the
	// cancer disclosure, the dishes line, the tradwife rebuttal. Without it a
	// creator whose testimony lives in one long podcast grades untagged no
	// matter how precisely it is cited.
	'Call Her Daddy',
	// Coach/athlete interview shows that publish full public episodes
	// (Simone-Biles pass, 2026-08-16; corrected 2026-08-16 editor pass). Aimee
	// Boorman's twelve years of first-hand testimony about Biles lives almost
	// entirely in one dated October 2025 episode of The Art of Excellence
	// (Glenn Zweig, Ep. 122 — "Beyond medals and perfection" is the EPISODE
	// title, not a show, and was registered here in error); The Pivot Podcast
	// is the primary record for the December 2023 Jonathan Owens interview.
	// Without them a subject whose best third-party testimony sits in a long
	// public podcast grades untagged no matter how precisely it is cited.
	'The Art of Excellence',
	'The Pivot Podcast',
	// Streamer-run shows that publish full public episodes (CaseOh pass,
	// 2026-07-26). Same class as the comedy podcasts above: for streamer
	// subjects a named show + date IS the checkable primary record.
	'Jynxzi Podcast',
	'Creature Feature',
	// Spanish-language creator coverage (Ibai-Llanos pass, 2026-07-30). The Wild
	// Project is Jordi Wild's show with full public episodes (same class as Joe
	// Rogan Experience above); Infobae and El Español are the checkable
	// Spanish-language press that actually covers this corpus's Spanish creators.
	'The Wild Project',
	'Infobae',
	'El Español',
	// Gen-Z / creator-beat outlets (Brooke-Monk pass, 2026-07-31). Elite Daily is
	// a BDG title with bylined, dated interviews and is the primary long-form
	// record for this subject; "Daily" is not in OUTLET_SUFFIX, so without an
	// explicit entry every quote from it grades vague no matter how sourced.
	'Elite Daily',
	'The Oxford Blue',
	// Recording Academy's own editorial site (Tate-McRae pass, 2026-08-04). It runs
	// bylined, dated artist interviews and is the primary record for this subject's
	// impostor-syndrome quote; the ".com" in the name means neither OUTLET_SUFFIX
	// nor any existing entry catches it, so it graded vague however well sourced.
	'GRAMMY.com',
	'Grammy.com',
	// Music-press primary record (Machine-Gun-Kelly pass, 2026-08-03). Apple Music's
	// Zane Lowe sessions and Audacy's on-air interviews are where musicians in this
	// corpus actually say the load-bearing things, and both publish dated, watchable
	// full episodes. Same class as Joe Rogan Experience / Shawn Ryan Show above:
	// without them every musician quote grades vague no matter how well sourced.
	'Apple Music',
	'Zane Lowe',
	'Audacy',
	'Rock Sound',
	'Kerrang',
	'Nylon',
	// Long-form film-press interview shows that publish full dated public episodes
	// (Samara-Weaving pass, 2026-08-03). Kevin McCarthy's show posts the complete
	// 90-minute video episode with a numbered episode and release date, which is
	// more checkable than most magazine attributions; it is the primary record for
	// this subject's trust-vetting and Babylon quotes. Same class as Shawn Ryan
	// Show / Club Shay Shay / Zane Lowe above.
	'On Film',
	'Kevin McCarthy',
	// Streamer-facing primary records (Stable-Ronaldo pass, 2026-08-04). All Grown
	// Up posts numbered, dated episodes to Apple Podcasts and Spotify (Ep. 10,
	// September 16, 2024 is this subject's longest on-record interview); Kai Cenat's
	// Streamer University is a named, dated, publicly broadcast event with a full
	// stream record. Same class as Jynxzi Podcast / Club Shay Shay / Are You Garbage
	// above: for streamer subjects these ARE the checkable primary record, and
	// without them every quote from them grades vague no matter how well sourced.
	'All Grown Up',
	'Streamer University',
	// Sports primary record (Caitlin-Clark pass, 2026-08-05). ESPN is the outlet
	// that actually holds this corpus's athlete testimony — the sit-down
	// interviews, the game recaps, the documentary arm — and it was absent, so
	// every athlete quote sourced to a dated ESPN interview graded vague no
	// matter how precisely it was cited. Unambiguous all-caps acronym, same
	// class as NPR / BBC / CNN already listed.
	'ESPN',
	// Sports primary record, second tranche (Patrick-Mahomes pass, 2026-08-23).
	// Sports Illustrated runs the bylined, dated game reports and locker-room
	// accounts that hold this corpus's NFL testimony (the 13-second game, the
	// SB LIX foot-locker report). New Heights and the WHOOP Podcast are dated,
	// public, full-episode interview shows, same class as Hot Ones / The Tim
	// Ferriss Show above, and carry the subject's only first-person account of
	// the rehearsed no-look and the 18 recovery score. The Pivot is the same
	// class (Tyreek Hill's account of the receiver cuss-out lives only there).
	'Sports Illustrated',
	'New Heights',
	'WHOOP Podcast',
	'The Pivot',
	// Local-broadcast primary record (Patrick-Mahomes editor pass, 2026-08-23).
	// KSHB 41 (Kansas City NBC affiliate, bylined Tod Palmer) holds the only
	// transcription of the Aug 22, 2026 sideline availability that closes the
	// Mahomes piece ("they would not let me" / "It's up to Coach Reid"); the
	// draft had been crediting ESPN for quotes ESPN never carried. Unambiguous
	// call-sign acronym, same class as NBC / ESPN above.
	'KSHB',
	// Broadcast primary record (Michael-Jordan pass, 2026-08-14). NBC's
	// "MJ: Insights to Excellence" segments (Tirico, Oct 2025 onward) are this
	// subject's only current long-form testimony — the free-throw story and the
	// "magic pill" quote live nowhere else — so without an entry every quote
	// from them grades vague/untagged no matter how precisely it is cited.
	// Unambiguous all-caps acronym, same class as NPR / BBC / CNN / ESPN.
	'NBC',
	// Legacy-TV primary record (Noah-Wyle pass, 2026-08-09). Television Academy is
	// the Academy's own editorial arm (emmy magazine) and holds this subject's
	// volunteer-email recounting — same class as GRAMMY.com above. Gold Derby runs
	// bylined, dated awards-beat interviews (the McCormack testimony). Great Chat
	// is Josh Smith's interview show with full public episodes (same class as
	// Happy Sad Confused / Call Her Daddy). SlashFilm is checkable film-trade
	// press; "Film" is not in OUTLET_SUFFIX, so without an entry its dated stat
	// reporting grades vague no matter how sourced.
	'Television Academy',
	'Gold Derby',
	'Great Chat',
	'SlashFilm',
	// Fashion press (Gigi-Hadid pass, 2026-08-10). The list had grown up around
	// music, streaming and sports subjects, so the entire fashion vertical was
	// unrepresented: a quote cited to a dated Refinery29 or i-D interview graded
	// vague no matter how precisely it was sourced. Harper's Bazaar needs a full
	// entry because only the bare token "Harper" sits in AMBIGUOUS_OUTLETS, and
	// "Bazaar" is not an OUTLET_SUFFIX word. Bravo and Reality Tea carry the
	// reality-TV primary record (the RHOBH almond scene and Yolanda's later
	// rebuttal). Both apostrophe forms are listed because drafts use curly quotes.
	'Refinery29',
	'i-D',
	'SSENSE',
	'Glamour',
	'WWD',
	"Harper's Bazaar",
	'Harper’s Bazaar',
	'Bravo',
	'Reality Tea',
	// Film-awards trade + youth-culture press (Chase-Infiniti pass, 2026-08-11).
	// TheWrap runs the bylined, dated casting-desk interview that holds this
	// subject's entire audition record and the casting director's razor
	// testimony; "Wrap" is in OUTLET_SUFFIX only as "Wire", so it graded vague
	// however precisely it was cited. Dazed carries the load-bearing belonging
	// quotes for this corpus's young-actor pages. "W Magazine" was already
	// listed but the case-sensitive match missed the lowercase "W magazine"
	// form that drafts actually use for the title. Elle sits in
	// AMBIGUOUS_OUTLETS and still needs an attribution cue, which is correct.
	'TheWrap',
	'The Wrap',
	'Dazed',
	'W magazine',
	// Historical filmed-interview record (Carl-Jung pass, 2026-08-13). C.G. Jung
	// Speaking (Princeton UP, 1977) is the published wording of record for the
	// 1957 University of Houston filmed interviews and the era's other on-camera
	// Jung material; no listed outlet covers a 1950s film series, so without it
	// the close-slot Houston quote grades untagged no matter how well sourced.
	'C.G. Jung Speaking',
	// African music press (Tyla pass, 2026-08-15). The list had grown up around
	// US/UK subjects, so the entire African-music vertical was unrepresented: this
	// corpus's first South African pop subject has her primary record in OkayAfrica
	// (the Sammy Soso popiano interview, the VMAs speech, the tour-cancellation
	// report), Notjustok (the load-bearing tour-routing critique), Revolt (the
	// identity-backlash reporting), IOL and MambaOnline (the choreographer
	// testimony). All bylined, dated, checkable publications; none is matched by
	// OUTLET_SUFFIX. 'British Vogue' needs its own entry because AMBIGUOUS_OUTLETS
	// only holds the bare token 'Vogue', which the ATTR_CUE regex cannot reach
	// across the 'British' modifier.
	'OkayAfrica',
	'Notjustok',
	'Revolt',
	'MambaOnline',
	'IOL',
	'Music In Africa',
	'British Vogue',
	// Long-form tech and comedy shows that publish full public episodes
	// (Alexandr-Wang pass, 2026-08-18). Same class as Joe Rogan Experience /
	// Flagrant / Call Her Daddy above. Theo Von's This Past Weekend is the
	// primary record for this subject's entire childhood spine (the New Mexico
	// math competition, Los Alamos, leaving MIT) and Core Memory (Ashlee Vance)
	// carries his only sit-down about the Meta talent war; Rest of World is the
	// bylined outlet of record for the March 2024 Remotasks cutoff. Without
	// them a tech founder whose best first-person material lives in dated public
	// podcasts grades untagged no matter how precisely it is cited.
	'This Past Weekend',
	'Core Memory',
	'Rest of World',
	// Public-media and morning-show primary record (Ms-Rachel pass, 2026-08-20).
	// This subject's entire "accused of insincerity" spine — the load-bearing
	// diagnosis quotes — lives in two dated public broadcasts: WBUR's Here & Now
	// (June 3, 2025) and Democracy Now! (August 13, 2025, full public transcript).
	// Good Morning America carries the co-star testimony on the 2023 pronoun
	// backlash. All three are named, dated, checkable, and none is matched by
	// OUTLET_SUFFIX, so every quote from them graded vague or untagged no matter
	// how precisely it was cited. Same class as NPR / BBC / CNN / NBC above.
	'WBUR',
	'Here & Now',
	'Democracy Now',
	'Good Morning America',
	// UK national and LGBTQ+ press (Jonathan-Bailey pass, 2026-08-21). The
	// Evening Standard carries this subject's load-bearing privacy quote ("It's
	// not secret, but it's private," Dec 2023) and "Standard" is not in
	// OUTLET_SUFFIX, so it graded vague however precisely it was cited. Both are
	// named, dated, bylined publications. (Attitude, the UK's biggest gay
	// magazine and the venue for his 2020 coming-out interview with Ian
	// McKellen, is a dictionary word and sits in AMBIGUOUS_OUTLETS below.)
	'Evening Standard',
	// Mid-century broadcast and the Enneagram trade press (Frank-Lloyd-Wright
	// pass, 2026-08-26). This subject's single load-bearing admission (arrogance
	// as "a pretty brittle shell") lives only in ABC's The Mike Wallace Interview,
	// filmed 1 and 28 Sept 1957, whose transcript is archived at the Harry Ransom
	// Center and excerpted by the Frank Lloyd Wright Foundation. "Interview" is
	// not in OUTLET_SUFFIX, so the exchange graded untagged however precisely it
	// was cited. Enneagram Monthly is the named, dated trade publication carrying
	// the only independent expert subtype call on this subject (Tim Vreeland,
	// July 2024). S.C. Johnson's published company history is the source of
	// record for the Wingspread "move your chair" exchange, told by Hib Johnson's
	// son Sam, who was at the table.
	'The Mike Wallace Interview',
	'Mike Wallace Interview',
	'Enneagram Monthly',
	'S.C. Johnson',
	// Classical primary-source editions of record (Marcus-Aurelius pass,
	// 2026-08-27). Before this the audit had no vocabulary for a pre-modern
	// subject at all: the wording of record for a Roman emperor is a named
	// scholarly translation, and "Loeb Classical Library vol. 1, p. 217" is a
	// far more checkable citation than most magazine attributions, yet it
	// graded untagged. Same class as C.G. Jung Speaking (Princeton UP) above.
	// George Long is listed by name because a Meditations quotation is only
	// traceable through the translator whose wording it is; the script already
	// lists individual people as outlets of record (Zane Lowe, Kevin McCarthy).
	'Loeb Classical Library',
	'Historia Augusta',
	'Roman History',
	'George Long',
	// Interviewers of record for the classic-rock vertical (Freddie-Mercury pass,
	// 2026-08-28). David Wigg's taped sessions with Mercury (the 1985 Munich
	// interview among them; transcript in youtube-transcripts/) are the primary
	// first-person record for this subject — the scars, ladder, mirrors and
	// untouchable-fantasy quotes live nowhere else. Rudi Dolezal filmed the 1987
	// "Great Pretender" promo interview, Mercury's last on camera, whose wording
	// is the record for the pretence and acting quotes. Same class as Zane Lowe /
	// Kevin McCarthy above: named people whose dated, public filmed interviews
	// are the checkable source.
	'David Wigg',
	'Rudi Dolezal',
	// Primary records for the romantasy vertical (Rebecca-Yarros pass,
	// 2026-08-31). The Book Hook's December 2025 full interview (transcript in
	// youtube-transcripts/) is the first-person record for this subject's
	// safety-hierarchy, media-training and Onyx Storm testimony; "Book" matches
	// VENUE_WORDS, so its quotes graded vague however precisely they were
	// cited. The Library of Congress National Book Festival main-stage event
	// (Sept 2024, transcript in youtube-transcripts/) is the institutional
	// record for the doorbell and fall-in-love quotes; no listed outlet covers
	// a federal-library festival stage. Same class as The Mike Wallace
	// Interview above: named, dated, publicly checkable filmed records.
	'The Book Hook',
	'Library of Congress'
];

// Common dictionary words that are ALSO outlets: only counted as an outlet when
// an attribution cue sits right next to them (kills "people we have profiled").
const AMBIGUOUS_OUTLETS = [
	'People',
	'Time',
	'Us',
	'Empire',
	'Insider',
	'Fortune',
	'Paper',
	'Vogue',
	'Elle',
	'Wired',
	'Slate',
	'Salon',
	'Collider',
	'IGN',
	'NME',
	'CBS',
	'Reuters',
	'Axios',
	'Politico',
	'Atlantic',
	'Harper',
	// Dictionary words that are also creator-press outlets (IShowSpeed pass,
	// 2026-07-25). "Complex" and "Variety" only count next to an attribution cue.
	'Complex',
	'Variety',
	// The Source (Tyla pass, 2026-08-15). The hip-hop title carries this corpus's
	// only record of the Ebro interview that holds the draft's keystone "jail"
	// quote. It sits in AMBIGUOUS_OUTLETS rather than OUTLETS because "source" is
	// a dictionary word; case-sensitive matching plus the adjacent-cue rule keeps
	// "according to a source" from counting.
	'Source',
	// Attitude (Jonathan-Bailey pass, 2026-08-21). The UK's biggest gay magazine
	// holds this subject's entire closeted-twenties spine — the Tupperware box,
	// the withdrawal, "they want you to be gay, but not too gay" — from the Dec
	// 2020 Ian McKellen cover interview. It sits here rather than in OUTLETS
	// because "attitude" is a common noun; the adjacent-cue rule keeps "his
	// attitude to the work" from counting.
	'Attitude'
];
const ATTR_CUE = '(?:told|to|in|for|on|per|via|according to|wrote (?:in|for)|said (?:in|to)|[—-])';

// Publication-shaped names (suffix heuristic), e.g. "Xyz Magazine", "Xyz Times".
const OUTLET_SUFFIX =
	/\b[A-Z][A-Za-z'’&.]+(?:\s+[A-Z][A-Za-z'’&.]+)?\s+(Magazine|Times|Journal|Post|News|Weekly|Reporter|Herald|Tribune|Review|Quarterly|Gazette|Chronicle|Digest|Wire)\b/;

const VENUE_WORDS =
	/\b(interview|memoir|documentary|docuseries|podcast|testimony|deposition|trial|profile|essay|column|newsletter|autobiography|book|statement|tweeted?|tweet|instagram|youtube|episode|press\s+conference|red\s+carpet|on\s+stage|onstage|speech|op-?ed|q&a|liner\s+notes)\b/i;

// A bare attributive speech verb (no source anchoring it).
const SPEECH_VERB =
	/\b(said|says|told|explained|recalled|admitted|wrote|writes|noted|added|reflected|remembered|confessed|insisted|put it|described)\b/i;

function hasOutlet(text) {
	// Case-SENSITIVE: outlets are proper nouns and are always capitalized in the
	// drafts. Matching case-insensitively turned "people we have profiled" into
	// the magazine "People". Multi-word names ("The Guardian") stay unambiguous.
	for (const o of OUTLETS) {
		const re = new RegExp(`(^|[^A-Za-z])${o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`);
		if (re.test(text)) return o;
	}
	for (const o of AMBIGUOUS_OUTLETS) {
		const esc = o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const re = new RegExp(
			`${ATTR_CUE}\\s+${esc}\\b|\\b${esc}\\s+(?:magazine|reported|wrote|said)\\b|,\\s*${esc}\\s*,\\s*(?:19|20)\\d{2}`
		);
		if (re.test(text)) return o;
	}
	// Epigraph / pull-quote structure "— Person, Source, Year": treat the middle
	// comma-token as the source (catches book/album/film titles like a memoir).
	const emAttr = text.match(
		/[—–-]\s*[A-Z][^,]{1,45},\s*([A-Za-z“"'’][^,]{1,55}?),\s*(?:19|20)\d{2}/
	);
	if (emAttr) return emAttr[1].trim();
	const m = text.match(OUTLET_SUFFIX);
	if (m) return m[0];
	return null;
}

// Years: modern four-digit years, nineteenth-century publication dates (a
// standard translation is dated by its edition, e.g. Long's Meditations of
// 1862), and explicitly era-marked ancient years ("162 AD", "44 BC"). The
// era marker is required for anything under four digits so bare counts and
// page numbers cannot masquerade as dates (Marcus-Aurelius pass, 2026-08-27).
function hasYear(text) {
	const m = text.match(/\b(?:18|19|20)\d{2}\b|\b\d{1,4}\s?(?:AD|BC|CE|BCE)\b/);
	return m ? m[0] : null;
}

function hasVenue(text) {
	const m = text.match(VENUE_WORDS);
	return m ? m[0].toLowerCase() : null;
}

function hasSpeechVerb(text) {
	return SPEECH_VERB.test(text);
}

// Primary sources (a dated court record, memoir, deposition) are the gold
// standard — a quote from one + a year is traceable, so it rates inline even
// without a third-party outlet name.
const PRIMARY_VENUE =
	/\b(memoir|autobiography|testimony|testified|deposition|sworn|under\s+oath|court|trial|liner\s+notes)\b/i;

function classifyAttribution(windowText) {
	const outlet = hasOutlet(windowText);
	const year = hasYear(windowText);
	const venue = hasVenue(windowText);
	const primary = PRIMARY_VENUE.test(windowText);
	let cls;
	if ((outlet && year) || (primary && year)) cls = 'inline';
	else if (outlet || year || venue) cls = 'vague';
	else cls = 'untagged';
	return {
		classification: cls,
		signals: { outlet: outlet || null, year: year || null, venue: venue || null }
	};
}

// ---------------------------------------------------------------------------
// Text utilities
// ---------------------------------------------------------------------------
function normalizeQuotes(s) {
	return s.replace(/[“”]/g, '"');
}

function stripInlineMarkup(s) {
	return s
		.replace(/<\/?[^>]+>/g, ' ') // html tags
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // md links -> text
		.replace(/[*_]{1,3}/g, '') // md emphasis
		.replace(/\s+/g, ' ')
		.trim();
}

// Strip HTML tags + markdown links but KEEP prose and its double-quotes, so
// attribute values like class="firstLetter" never masquerade as quoted material.
function stripTagsKeepText(s) {
	return s
		.replace(/<\/?[^>]+>/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[_*]{1,3}/g, '') // md emphasis (so _Born Standing Up_ -> Born Standing Up)
		.replace(/\s+/g, ' ')
		.trim();
}

function splitSentences(text) {
	// Keep it simple and deterministic. Split on sentence-final punctuation
	// followed by whitespace + capital / quote.
	const cleaned = text.replace(/\s+/g, ' ').trim();
	if (!cleaned) return [];
	const parts = cleaned.split(/(?<=[.!?])\s+(?=["“'A-Z])/);
	return parts.map((p) => p.trim()).filter(Boolean);
}

// Given a slot's text, return quote units with attribution windows.
// Quotes are matched against the WHOLE slot string (so multi-sentence quotes
// survive), split quotes ("...," he said, "...") are merged, and the attribution
// window looks both backward (leading "As X told IndieWire in 2023, ...") and
// forward (trailing "— Name, _Source_, Year" / "he told Rolling Stone in 2021").
function quoteUnitsInSlot(slotText) {
	const text = normalizeQuotes(stripTagsKeepText(slotText || ''));
	const spans = [];
	const re = /"([^"]{3,600})"/g;
	let m;
	while ((m = re.exec(text)) !== null) {
		const frag = m[1].trim();
		// Drop single-word scare-quotes / emphasis ("fun", "stuck"); the audit is
		// about sourced claims, and a lone word is almost never the load-bearing one.
		if (frag.split(/\s+/).length < 2) continue;
		spans.push({ start: m.index, end: re.lastIndex, frag });
	}
	// Merge adjacent spans (split quotes) separated by a short interjection.
	const units = [];
	for (const sp of spans) {
		const last = units[units.length - 1];
		if (last && sp.start - last.end <= 50) {
			last.frags.push(sp.frag);
			last.end = sp.end;
		} else {
			units.push({ start: sp.start, end: sp.end, frags: [sp.frag] });
		}
	}
	return units.map((u) => {
		const window = text.slice(Math.max(0, u.start - 120), Math.min(text.length, u.end + 180));
		return { quote: u.frags.join(' … '), window, hasSpeechVerb: hasSpeechVerb(window) };
	});
}

// ---------------------------------------------------------------------------
// Slot extraction
// ---------------------------------------------------------------------------
function extractSlots(body) {
	const slots = {};

	// --- Epigraph: first `>` blockquote before the firstLetter paragraph ---
	const firstLetterIdx = body.search(/<p[^>]*class=["']firstLetter["']/i);
	const preLetter = firstLetterIdx >= 0 ? body.slice(0, firstLetterIdx) : body;
	const epiMatch = preLetter.match(/^>\s?.*(?:\n>.*)*$/m);
	slots.epigraph = epiMatch ? epiMatch[0].replace(/^>\s?/gm, '').trim() : '';

	// --- Cold open: firstLetter paragraph THROUGH paragraphs up to TL;DR / H2 ---
	if (firstLetterIdx >= 0) {
		const rest = body.slice(firstLetterIdx);
		const stopMatch = rest.match(/(<details|^\s*##\s+|<summary)/m);
		const stopIdx = stopMatch ? stopMatch.index : rest.length;
		slots.coldOpen = rest.slice(0, stopIdx);
	} else {
		slots.coldOpen = '';
	}

	// --- Diagnosis: `## What Is/is ... personality type?` -> next `## ` ---
	const diagHeadingRe = /^##\s+What\s+is\s+.*personality\s+type\??\s*$/im;
	const dh = body.match(diagHeadingRe);
	if (dh) {
		const start = dh.index;
		const after = body.slice(start + dh[0].length);
		const nextH2 = after.search(/^##\s+/m);
		slots.diagnosis = body.slice(start, nextH2 >= 0 ? start + dh[0].length + nextH2 : body.length);
	} else {
		slots.diagnosis = '';
	}

	// --- Close: last 1-2 non-empty paragraph blocks of the body ---
	// Drop the rabbit-hole details block from close consideration if it is last.
	let closeSource = body;
	// Ignore trailing whitespace; split into paragraph blocks on blank lines.
	const blocks = closeSource
		.split(/\n\s*\n/)
		.map((b) => b.trim())
		.filter((b) => b.length > 0)
		// keep only prose-ish blocks (skip closing tags / details wrappers)
		.filter(
			(b) =>
				!/^<\/?(details|div|ul|li|summary|p class="inner-thought")/i.test(b) ||
				/[a-z]{4,}/.test(stripInlineMarkup(b))
		);
	const proseBlocks = blocks.filter((b) => {
		const t = stripInlineMarkup(b);
		return t.split(/\s+/).length >= 6 && !/^#{1,6}\s/.test(b) && !/^>/.test(b);
	});
	slots.close = proseBlocks.slice(-2).join('\n\n');

	// --- Empathy turn: negative-parallelism reframe sentence(s) ---
	slots.empathyTurn = findEmpathyTurn(body);

	return slots;
}

const EMPATHY_PATTERNS = [
	/\b(?:is|was|are|were)\s+not\s+[^.,;:]{2,70}[,;.]\s*(?:it|he|she|they|that)\s+(?:is|was|were|are)\b/i,
	/\bwas\s?n[’']?t\b[^.]{2,70}\.\s*[Ii]t\s+was\b/i,
	/\bdoes\s+not\s+(?:make|excuse)\b[^.]{2,60}\.\s*[Ii]t\b/i,
	/\bnot\s+[a-z][^.,;:]{2,50},\s+it\s+(?:is|was)\b/i
];
const REFRAME_VOCAB =
	/\b(armor|wound|fear|protect|proof|reflex|cruelty|vanity|evasion|scar|survival|mask|defen[cs]e|kind|legible|love|shame|hurt|grief|avoidance)\b/i;

function findEmpathyTurn(body) {
	const prose = stripComments(body);
	const sentences = splitSentences(stripInlineMarkup(prose));
	const scored = [];
	for (const s of sentences) {
		if (s.split(/\s+/).length < 5) continue;
		const matched = EMPATHY_PATTERNS.some((re) => re.test(s));
		if (!matched) continue;
		const score = (REFRAME_VOCAB.test(s) ? 2 : 0) + 1;
		scored.push({ s, score });
	}
	scored.sort((a, b) => b.score - a.score);
	return scored
		.slice(0, 2)
		.map((x) => x.s)
		.join(' / ');
}

// ---------------------------------------------------------------------------
// Audit a slot's quotes
// ---------------------------------------------------------------------------
function auditSlot(name, slotText) {
	const units = quoteUnitsInSlot(stripComments(slotText || ''));
	const items = units.map((u) => {
		const { classification, signals } = classifyAttribution(u.window);
		return {
			quote: stripInlineMarkup(u.quote).slice(0, 240),
			classification,
			signals,
			note:
				classification === 'untagged' && u.hasSpeechVerb
					? 'bare speech verb, no outlet/year/venue'
					: classification === 'untagged'
						? 'no attribution found'
						: undefined
		};
	});
	return { slot: name, hasQuotedMaterial: items.length > 0, items };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const raw = fs.readFileSync(filePath, 'utf8');
const { fm, body: bodyRaw } = splitFrontmatter(raw);
const body = stripComments(bodyRaw);
const meta = parseFrontmatter(fm);
const slots = extractSlots(body);

const report = {
	file: filePath,
	person: meta.person || path.basename(filePath, '.md'),
	enneagram: meta.enneagram,
	slots: {
		epigraph: auditSlot('epigraph', slots.epigraph),
		coldOpen: auditSlot('cold open', slots.coldOpen),
		diagnosis: auditSlot('diagnosis', slots.diagnosis),
		empathyTurn: {
			slot: 'empathy turn',
			reframeSentence: slots.empathyTurn || null,
			...auditSlot('empathy turn', slots.empathyTurn)
		},
		close: auditSlot('close', slots.close)
	}
};

// Summary counts + B+/A gate flags (per editorial-report Deliverable #6).
const allItems = Object.values(report.slots).flatMap((s) => s.items || []);
const counts = { inline: 0, vague: 0, untagged: 0 };
for (const it of allItems) counts[it.classification]++;
const epigraphUntagged = (report.slots.epigraph.items || []).some(
	(i) => i.classification === 'untagged'
);
const coldOpenUntagged = (report.slots.coldOpen.items || []).some(
	(i) => i.classification === 'untagged'
);
report.summary = {
	quotes_total: allItems.length,
	...counts,
	untagged_in_epigraph_or_cold_open: epigraphUntagged || coldOpenUntagged,
	any_untagged_load_bearing_slot: counts.untagged > 0
};

if (asJson) {
	process.stdout.write(JSON.stringify(report, null, 2) + '\n');
	process.exit(failOnUntaggedLoadBearing && report.summary.any_untagged_load_bearing_slot ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Human report
// ---------------------------------------------------------------------------
const CLS_LABEL = { inline: 'INLINE  ', vague: 'VAGUE   ', untagged: 'UNTAGGED' };
function line(s = '') {
	process.stdout.write(s + '\n');
}

line('='.repeat(72));
line(`LOAD-BEARING SOURCE AUDIT — ${report.person}  (Type ${report.enneagram || '?'})`);
line(filePath);
line('='.repeat(72));

const order = [
	['epigraph', report.slots.epigraph],
	['cold open', report.slots.coldOpen],
	['diagnosis', report.slots.diagnosis],
	['empathy turn', report.slots.empathyTurn],
	['close', report.slots.close]
];

for (const [label, slot] of order) {
	line('');
	line(`### ${label.toUpperCase()}`);
	if (label === 'empathy turn' && slot.reframeSentence) {
		line(`  reframe: ${slot.reframeSentence.slice(0, 220)}`);
	}
	if (!slot.items || slot.items.length === 0) {
		line('  (no quoted material in slot)');
		continue;
	}
	for (const it of slot.items) {
		const sig = [];
		if (it.signals.outlet) sig.push(`outlet="${it.signals.outlet}"`);
		if (it.signals.year) sig.push(`year=${it.signals.year}`);
		if (it.signals.venue) sig.push(`venue="${it.signals.venue}"`);
		line(`  [${CLS_LABEL[it.classification]}] "${it.quote}"`);
		line(
			`             ${sig.length ? sig.join('  ') : '— no outlet / year / venue —'}${it.note ? '  (' + it.note + ')' : ''}`
		);
	}
}

line('');
line('-'.repeat(72));
line(
	`SUMMARY: ${report.summary.quotes_total} load-bearing quote(s) — ` +
		`${counts.inline} inline, ${counts.vague} vague, ${counts.untagged} untagged`
);
line(
	`  untagged quote in epigraph OR cold open: ${report.summary.untagged_in_epigraph_or_cold_open ? 'YES (blocks A/B+ per source standard)' : 'no'}`
);
line(
	`  any untagged load-bearing quote:         ${report.summary.any_untagged_load_bearing_slot ? 'YES' : 'no'}`
);
line('-'.repeat(72));
process.exit(failOnUntaggedLoadBearing && report.summary.any_untagged_load_bearing_slot ? 1 : 0);
