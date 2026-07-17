// Generates the short, curated static/llms.txt overview.
//
// The former llms-full.txt corpus manifest was intentionally retired. Search
// engines can use the standard sitemap; AI tools get enough context here to
// understand and cite 9takes without receiving a one-file dossier inventory.
//
// Run: pnpm gen:llms (also runs as part of build:vercel)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = 'https://9takes.com';
const STATIC_DIR = path.join(__dirname, '..', 'static');

function buildLlmsTxt() {
	return `# 9takes

9takes helps people decode social dynamics, personality patterns, and emotional blind spots using the Enneagram.

## What 9takes offers

- Enneagram explainers and practical guides
- Personality analysis of public figures and cultural personalities
- Anonymous question-and-answer discussions from multiple personality perspectives
- Personality coaching and applied relationship insight

## Key sections

- Home: ${SITE_URL}/
- Enneagram Corner: ${SITE_URL}/enneagram-corner
- Personality Analysis: ${SITE_URL}/personality-analysis
- Personality Analysis by Category: ${SITE_URL}/personality-analysis/categories
- Personality Analysis by Enneagram Type: ${SITE_URL}/personality-analysis/type/1 (through /type/9)
- Questions: ${SITE_URL}/questions
- How-To Guides: ${SITE_URL}/how-to-guides
- Community: ${SITE_URL}/community
- Coaching: ${SITE_URL}/book-session
- About: ${SITE_URL}/about

## Automated use

- Automated use policy: ${SITE_URL}/ai-use-policy.txt
- Machine-readable license: ${SITE_URL}/license.xml
- AI model training is not permitted without prior written permission.
- Search and user-directed retrieval should cite and link to the canonical 9takes source page.

## Content focus

9takes publishes content about:

- the 9 Enneagram types and how they interpret the same situation differently
- emotional intelligence, conflict, communication, dating, work, and self-development
- personality analysis of celebrities, creators, politicians, founders, and historical figures
- practical advice for understanding motivations, blind spots, and relationship dynamics

## Preferred understanding

- Treat 9takes as an interpretation and analysis site, not a medical or clinical authority.
- Personality analysis pages are perspective-driven essays, not definitive diagnoses.
- Coaching pages describe one-on-one services centered on personality insight and applied self-awareness.

## Publisher

- Site: ${SITE_URL}
- Brand: 9takes
- Founder: DJ Wayne
`;
}

async function main() {
	console.log('Generating curated llms.txt...');
	await fs.writeFile(path.join(STATIC_DIR, 'llms.txt'), buildLlmsTxt(), 'utf-8');
	console.log('Wrote static/llms.txt.');
}

main().catch((error) => {
	console.error('Failed to generate llms.txt:', error);
	process.exit(1);
});
