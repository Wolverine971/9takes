#!/usr/bin/env node

/**
 * Script to generate social media and meta files for all mental health blogs
 * Run with: node generate-mental-health-files.js
 */

import fs from 'fs';
import path from 'path';

// Blog information extracted from file names and content
const blogs = [
	{
		filename: 'enneagram-addiction-recovery-guide',
		title: 'The Enneagram Guide to Addiction Recovery',
		focus: 'addiction recovery',
		audience: 'People in recovery or supporting someone in recovery',
		tags: ['addiction', 'recovery', '12-step', 'sobriety', 'healing'],
		painPoints: [
			'Struggling with recovery',
			'Understanding addiction patterns',
			'Finding personalized recovery approaches'
		]
	},
	{
		filename: 'enneagram-crisis-management-guide',
		title: 'Enneagram Crisis Management: Navigating Mental Health Emergencies',
		focus: 'crisis management',
		audience: 'People experiencing mental health crises or their supporters',
		tags: ['crisis', 'emergency', 'suicide-prevention', 'intervention'],
		painPoints: ['Mental health crisis', 'Feeling suicidal', 'Supporting someone in crisis']
	},
	{
		filename: 'enneagram-medication-mental-health',
		title: 'The Enneagram Guide to Mental Health Medication',
		focus: 'medication and treatment',
		audience: 'People considering or taking mental health medication',
		tags: ['medication', 'psychiatry', 'treatment', 'therapy'],
		painPoints: ['Deciding about medication', 'Medication side effects', 'Treatment resistance']
	},
	{
		filename: 'enneagram-neurodivergence-guide',
		title: 'Understanding Neurodivergence Through the Enneagram Lens',
		focus: 'neurodivergence',
		audience: 'Neurodivergent individuals and their families',
		tags: ['neurodivergence', 'ADHD', 'autism', 'different-abilities'],
		painPoints: ['Feeling misunderstood', 'Masking behaviors', 'Finding accommodations']
	},
	{
		filename: 'enneagram-science-mental-health',
		title: 'The Science Behind Enneagram and Mental Health',
		focus: 'research and science',
		audience: 'People seeking evidence-based information',
		tags: ['research', 'science', 'evidence', 'psychology'],
		painPoints: [
			'Wanting scientific validation',
			'Understanding the research',
			'Evidence-based approaches'
		]
	},
	{
		filename: 'enneagram-therapy-guide',
		title: 'Finding the Right Therapist for Your Enneagram Type',
		focus: 'therapy and treatment',
		audience: 'People seeking therapy or improving their therapy experience',
		tags: ['therapy', 'counseling', 'treatment', 'therapeutic-relationship'],
		painPoints: ['Finding the right therapist', 'Therapy not working', 'Therapy anxiety']
	},
	{
		filename: 'enneagram-trauma-response-guide',
		title: 'Understanding Trauma Responses Through the Enneagram',
		focus: 'trauma and healing',
		audience: 'Trauma survivors and their supporters',
		tags: ['trauma', 'PTSD', 'healing', 'recovery'],
		painPoints: ['Trauma symptoms', 'Feeling stuck in trauma', 'Understanding trauma responses']
	},
	{
		filename: 'enneagram-workplace-mental-health',
		title: 'Enneagram Guide to Workplace Mental Health',
		focus: 'workplace wellbeing',
		audience: 'Working professionals concerned about mental health',
		tags: ['workplace', 'burnout', 'stress', 'work-life-balance'],
		painPoints: ['Work stress', 'Burnout', 'Workplace anxiety', 'Career pressures']
	}
];

const baseDir = './src/blog/enneagram/mental-health/';

// Template for meta.json files
function generateMetaFile(blog) {
	return {
		title: blog.title,
		slug: blog.filename,
		category: 'mental-health',
		primaryAudience: {
			name: blog.audience,
			description: `People interested in ${blog.focus} with Enneagram awareness`,
			demographics: {
				ageRange: '25-55',
				interests: ['enneagram', 'mental health', ...blog.tags],
				psychographics:
					'Self-aware individuals seeking personalized approaches to mental health challenges'
			}
		},
		tags: ['enneagram', 'mental-health', ...blog.tags],
		painPoints: blog.painPoints,
		topicsAddressed: [
			`How each Enneagram type experiences ${blog.focus}`,
			`Type-specific strategies for ${blog.focus}`,
			'Practical tools and resources',
			'When to seek professional help'
		],
		seo: {
			keywords: [`enneagram ${blog.focus}`, `${blog.focus} by personality type`],
			targetQueries: [`how does enneagram affect ${blog.focus}`, `${blog.focus} help for my type`]
		},
		contentGoals: [
			`Provide type-specific guidance for ${blog.focus}`,
			'Build understanding and reduce stigma',
			'Connect people with appropriate resources'
		],
		socialMediaFocus: {
			twitter: `Educational content about ${blog.focus} and type-specific tips`,
			instagram: `Visual guides and supportive content about ${blog.focus}`,
			reddit: `Community support and resource sharing in relevant subreddits`
		}
	};
}

// Template for Twitter content
function generateTwitterContent(blog) {
	return `# Twitter Content for "${blog.title}"

## Main Thread: Understanding ${blog.focus.charAt(0).toUpperCase() + blog.focus.slice(1)} by Type

🧵 THREAD: How your Enneagram type affects your experience with ${blog.focus}

Understanding your type can help you find strategies that actually work for YOU 👇

1/10 Your Enneagram type influences how you experience ${blog.focus}.

This isn't about stereotypes—it's about understanding your unique patterns so you can get the support that actually helps.

Here's what each type might experience:

[Continue with type-specific insights...]

## Standalone Tweets

💡 ${blog.focus.charAt(0).toUpperCase() + blog.focus.slice(1)} tip: Your Enneagram type affects what strategies work best for you.

What works for others might not work for you—and that's okay. Find YOUR approach. 🎯

## Resource Tweets

📚 Resources for ${blog.focus}:
- [List relevant resources]
- [Professional organizations]
- [Helplines or support]

Your type matters, but support is available for everyone. 💙

## Hashtags to Use
${blog.tags.map((tag) => `#${tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', '')}`).join(' ')} #EnneagramMentalHealth #9takes
`;
}

// Template for Instagram content
function generateInstagramContent(blog) {
	return `# Instagram Content for "${blog.title}"

## Main Feed Post: Carousel Guide

**Slide 1 (Cover):**
"${blog.focus.charAt(0).toUpperCase() + blog.focus.slice(1)} & Your Enneagram Type 🧠
How your personality affects your experience
Swipe for insights ➡️"

**Slides 2-10:** Each type with:
- How this type might experience ${blog.focus}
- Common challenges for this type
- One specific tip or strategy

**Caption:**
Your Enneagram type influences how you experience ${blog.focus}, and understanding this can be life-changing.

This isn't about putting yourself in a box—it's about understanding your unique patterns so you can find strategies that actually work for YOU.

[Continue with detailed caption...]

**Hashtags:**
${blog.tags.map((tag) => `#${tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', '')}`).join(' ')} #EnneagramMentalHealth #9takes

## Story Ideas

### Educational Series: "${blog.focus.charAt(0).toUpperCase() + blog.focus.slice(1)} by Type"
- Quick tips for each type
- Myth vs reality content
- Resource sharing

### Community Engagement
- Polls about experiences
- Question stickers for support
- Behind-the-scenes content about the topic
`;
}

// Template for Reddit content
function generateRedditContent(blog) {
	return `# Reddit Strategy for "${blog.title}"

## Target Subreddits

### Primary Communities
- r/Enneagram - Type-specific discussions about ${blog.focus}
- r/MentalHealth - General support and resource sharing
- [Add specific subreddits related to ${blog.focus}]

## Sample Posts

### Educational Post
**Title:** "How I learned my Enneagram type affects my experience with ${blog.focus}"

**Content:**
I've been dealing with ${blog.focus} for [time period] and recently learned about how personality types can influence our experiences.

As a Type [X], I noticed these patterns:
- [Pattern 1]
- [Pattern 2]  
- [Pattern 3]

What helped me:
- [Strategy 1]
- [Strategy 2]
- [Strategy 3]

Has anyone else noticed how their type affects their experience with ${blog.focus}?

### Support Post
**Title:** "Resources for ${blog.focus} that consider personality differences"

**Content:**
Sharing some resources I've found helpful that recognize that different people need different approaches to ${blog.focus}:

[List of resources...]

What resources have been most helpful for your type?

## Community Engagement Strategy
- Share personal experiences respectfully
- Offer support and resources
- Ask thoughtful questions
- Build relationships over time
`;
}

// Generate files for each blog
blogs.forEach((blog) => {
	const metaPath = path.join(baseDir, `${blog.filename}.meta.json`);
	const twitterPath = path.join(baseDir, `${blog.filename}.twitter.md`);
	const instagramPath = path.join(baseDir, `${blog.filename}.instagram.md`);
	const redditPath = path.join(baseDir, `${blog.filename}.reddit.md`);

	// Generate meta file
	if (!fs.existsSync(metaPath)) {
		fs.writeFileSync(metaPath, JSON.stringify(generateMetaFile(blog), null, 2));
		console.log(`✅ Created ${blog.filename}.meta.json`);
	}

	// Generate Twitter content
	if (!fs.existsSync(twitterPath)) {
		fs.writeFileSync(twitterPath, generateTwitterContent(blog));
		console.log(`✅ Created ${blog.filename}.twitter.md`);
	}

	// Generate Instagram content
	if (!fs.existsSync(instagramPath)) {
		fs.writeFileSync(instagramPath, generateInstagramContent(blog));
		console.log(`✅ Created ${blog.filename}.instagram.md`);
	}

	// Generate Reddit content
	if (!fs.existsSync(redditPath)) {
		fs.writeFileSync(redditPath, generateRedditContent(blog));
		console.log(`✅ Created ${blog.filename}.reddit.md`);
	}
});

console.log('\n🎉 Mental health blog social media files generated!');
console.log('📝 Next steps:');
console.log('1. Review and customize each file for specific content');
console.log('2. Add platform-specific details and insights');
console.log('3. Research additional subreddits for each topic');
console.log('4. Create content calendar for publishing');
