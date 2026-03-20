// scripts/add-faq-schema.js
// #!/usr/bin/env node

// scripts/add-faq-schema.js
/**
 * Extracts FAQ Q&A pairs from blog markdown files and appends FAQPage JSON-LD schema.
 * Handles two patterns:
 *   1. ### Question heading with paragraph answer
 *   2. **Question** bold with paragraph answer
 *
 * Only processes files that have FAQ sections but no existing FAQPage JSON-LD.
 */

import fs from 'fs';
import path from 'path';

const FILES = [
	'src/blog/community/inspiration-for-9takes.md',
	'src/blog/community/memetic-comments.md',
	'src/blog/community/why-im-selective-sharing-enneagram.md',
	'src/blog/community/why-the-greek-vibe.md',
	'src/blog/enneagram/enneagram-books-websites-podcasts.md',
	'src/blog/enneagram/enneagram-coach-toolkit.md',
	'src/blog/enneagram/love-languages-and-enneagram-types.md',
	'src/blog/enneagram/mental-health/enneagram-medication-mental-health.md',
	'src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md',
	'src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md',
	'src/blog/enneagram/shadow-work-by-enneagram-type.md',
	'src/blog/pop-culture/aoc-and-the-squad-enneagram-types.md',
	'src/blog/pop-culture/cancel-culture-enneagram-type.md',
	'src/blog/pop-culture/influencer-enneagram-types-instagram.md',
	'src/blog/pop-culture/kardashian-family-enneagram-analysis.md',
	'src/blog/pop-culture/onlyfans-creators-enneagram-digital-intimacy.md',
	'src/blog/pop-culture/parasocial-relationships-enneagram-type.md',
	'src/blog/pop-culture/reddit-moderators-type-1-internet.md',
	'src/blog/pop-culture/trump-type-8-vs-biden-type-2.md',
	'src/blog/pop-culture/twitter-x-personality-types-toxic.md',
	'src/blog/pop-culture/world-leaders-enneagram-personality-dynamics.md'
];

function extractFAQs(content) {
	const faqs = [];

	// Find the FAQ section start
	const faqHeaderMatch = content.match(/^##\s+(FAQ|FAQs|Frequently Asked Questions)[^\n]*/im);
	if (!faqHeaderMatch) return faqs;

	const faqStart = faqHeaderMatch.index + faqHeaderMatch[0].length;

	// Find the next ## heading or end of file to bound the FAQ section
	const afterFaqSection = content.slice(faqStart);
	const nextH2Match = afterFaqSection.match(/\n## [^#]/);
	const faqSection = nextH2Match ? afterFaqSection.slice(0, nextH2Match.index) : afterFaqSection;

	// Pattern 1: ### Question heading
	const h3Pattern = /###\s+(.+?)(?:\n)+(.+?)(?=\n###|\n## |$)/gs;
	let match;
	while ((match = h3Pattern.exec(faqSection)) !== null) {
		const question = match[1].trim();
		// Grab paragraphs after the heading until next heading
		const answerBlock = match[2].trim();
		const answer = cleanAnswer(answerBlock);
		if (question && answer) {
			faqs.push({ question, answer });
		}
	}

	// Pattern 2: **Question** bold (only if no h3 pattern found)
	if (faqs.length === 0) {
		const boldPattern = /\*\*(.+?)\*\*\s*\n\n([\s\S]+?)(?=\n\*\*[^*]|\n## |$)/g;
		while ((match = boldPattern.exec(faqSection)) !== null) {
			const question = match[1].trim();
			const answer = cleanAnswer(match[2].trim());
			if (question && answer) {
				faqs.push({ question, answer });
			}
		}
	}

	return faqs;
}

function cleanAnswer(text) {
	// Remove markdown formatting, collapse to plain text for JSON-LD
	return text
		.replace(/\*\*(.+?)\*\*/g, '$1') // bold
		.replace(/\*(.+?)\*/g, '$1') // italic
		.replace(/_(.+?)_/g, '$1') // italic underscore
		.replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
		.replace(/^[-*]\s+/gm, '• ') // list items
		.replace(/\n\n+/g, ' ') // collapse paragraphs
		.replace(/\n/g, ' ') // collapse newlines
		.replace(/\s+/g, ' ') // collapse whitespace
		.trim();
}

function buildFAQJsonLd(faqs) {
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
	return JSON.stringify(schema, null, 2);
}

let processed = 0;
let skipped = 0;

for (const filePath of FILES) {
	const fullPath = path.resolve(filePath);
	if (!fs.existsSync(fullPath)) {
		console.log(`SKIP (not found): ${filePath}`);
		skipped++;
		continue;
	}

	const content = fs.readFileSync(fullPath, 'utf-8');

	// Safety check: don't add if already has FAQPage
	if (content.includes('"FAQPage"')) {
		console.log(`SKIP (already has FAQ schema): ${filePath}`);
		skipped++;
		continue;
	}

	const faqs = extractFAQs(content);
	if (faqs.length === 0) {
		console.log(`SKIP (no FAQs extracted): ${filePath}`);
		skipped++;
		continue;
	}

	const jsonLd = buildFAQJsonLd(faqs);
	const scriptTag = `\n<script type="application/ld+json">\n${jsonLd}\n</script>\n`;

	// Append to end of file
	fs.writeFileSync(fullPath, content.trimEnd() + '\n' + scriptTag, 'utf-8');

	console.log(`DONE (${faqs.length} FAQs): ${filePath}`);
	faqs.forEach((f) => console.log(`  Q: ${f.question}`));
	processed++;
}

console.log(`\nProcessed: ${processed}, Skipped: ${skipped}`);
