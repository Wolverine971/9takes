<!-- TWITTER_CARD_OPTIMIZATION.md -->

# Twitter/X Card Optimization Guide for 9takes

## Overview

This document outlines the Twitter/X Card implementation and optimization strategy for 9takes - the personality-based Q&A platform that shows "9 ways to see it" through the lens of Enneagram personality types.

## Current Implementation Status

### Active Twitter Handles

- **Brand Account**: `@9takesdotcom` (primary for twitter:site)
- **Creator Account**: `@djwayne3` (for twitter:creator)
- **URLs**:
  - Twitter: https://twitter.com/9takesdotcom
  - Instagram: https://www.instagram.com/9takesdotcom/

### Meta Tags Structure

We use the `name` attribute (not `property`) for Twitter tags as per X's latest documentation:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@9takesdotcom" />
<meta name="twitter:creator" content="@djwayne3" />
<meta name="twitter:title" content="9takes - See the emotions behind every take" />
<meta
	name="twitter:description"
	content="One situation, 9 ways to see it. Anonymous Q&A platform exploring perspectives through personality types."
/>
<meta name="twitter:image" content="https://9takes.com/twitter-card-9takes.webp" />
<meta
	name="twitter:image:alt"
	content="9takes - Personality-based Q&A platform showing 9 perspectives"
/>
```

## Image Requirements & Strategy

### Recommended Dimensions

- **Primary**: 1200 x 628 pixels (1.91:1 aspect ratio)
- **Alternative**: 1200 x 675 pixels (16:9 aspect ratio)
- **File Size**: Maximum 5MB
- **Formats**: WEBP (preferred), JPG, PNG

### Card Type Strategy

#### Use `summary_large_image` for:

- Homepage
- Landing pages
- Marketing/promotional pages
- Book session/coaching pages
- Feature announcements

#### Use `summary` for:

- Blog posts (personality analyses, Enneagram content)
- Individual questions
- User-generated content pages
- Educational content

### Image Files Needed

1. **twitter-card-9takes.webp** - Main brand Twitter card
   - Dimensions: 1200x628px
   - Content: 9takes logo, tagline "See the emotions behind every take"
   - Visual representation of 9 personality types
   - High contrast for readability

2. **enneagram-types/** - Type-specific cards
   - One for each Enneagram type (1-9)
   - Consistent branding with type-specific colors/imagery
   - Format: `twitter-card-type-{1-9}.webp`

3. **personality-analysis/** - Celebrity analysis cards
   - Dynamic generation based on celebrity images
   - Overlay with 9takes branding and Enneagram type
   - Stored in: `/types/{type}s/{person}.webp`

4. **questions/** - Question-specific cards
   - Default fallback card for questions
   - Optional: Auto-generated cards with question text

## SEOHead Component Implementation

### Creating the Centralized Component

Location: `src/lib/components/SEOHead.svelte`

```svelte
<script lang="ts">
	export let title = '9takes - See the emotions behind every take';
	export let description =
		'One situation, 9 ways to see it. Anonymous Q&A platform exploring perspectives through personality types.';
	export let canonical: string;
	export let ogImage = 'https://9takes.com/twitter-card-9takes.webp';
	export let twitterImage = ogImage;
	export let twitterCardType: 'summary' | 'summary_large_image' = 'summary_large_image';
	export let twitterCreator = '@djwayne3';
	export let ogType = 'website';
	export let jsonLd: any = null;
	export let additionalMeta: Array<{ name?: string; property?: string; content: string }> = [];
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<!-- OpenGraph -->
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content={twitterCardType} />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:creator" content={twitterCreator} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={twitterImage} />
	<meta name="twitter:image:alt" content="9takes - {title}" />

	<!-- Additional Meta Tags -->
	{#each additionalMeta as meta}
		{#if meta.name}
			<meta name={meta.name} content={meta.content} />
		{:else if meta.property}
			<meta property={meta.property} content={meta.content} />
		{/if}
	{/each}

	<!-- JSON-LD Structured Data -->
	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>
```

### Usage Examples

#### Homepage

```svelte
<script>
	import SEOHead from '$lib/components/SEOHead.svelte';
</script>

<SEOHead
	title="9takes - See the emotions behind every take"
	description="One situation, 9 ways to see it. Discover how different personality types respond to the same questions. Anonymous, give-first Q&A platform."
	canonical="https://9takes.com"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/twitter-card-9takes.webp"
/>
```

#### Blog Post (Personality Analysis)

```svelte
<SEOHead
	title="{celebrityName}'s Enneagram Type {enneagramType} Analysis - 9takes"
	description="Discover {celebrityName}'s personality through the lens of Enneagram Type {enneagramType}. Deep dive into their motivations, fears, and behavioral patterns."
	canonical="https://9takes.com/personality-analysis/{slug}"
	twitterCardType="summary"
	ogImage="https://9takes.com/types/{enneagramType}s/{slug}.webp"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		author: {
			'@type': 'Person',
			name: 'DJ Wayne',
			url: 'https://9takes.com'
		}
	}}
/>
```

#### Questions Page

```svelte
<SEOHead
	title="{question.question} - 9takes"
	description="See how all 9 Enneagram types answer: {question.question}. Discover diverse perspectives through personality."
	canonical="https://9takes.com/questions/{question.slug}"
	twitterCardType="summary"
	ogImage={question.imageUrl || 'https://9takes.com/questions-default.webp'}
	additionalMeta={[
		{ name: 'twitter:label1', content: 'Responses' },
		{ name: 'twitter:data1', content: `${responseCount}` },
		{ name: 'twitter:label2', content: 'Personality Types' },
		{ name: 'twitter:data2', content: '9 perspectives' }
	]}
/>
```

## Validation & Testing

### Twitter Card Validator Tools

- Official (may be deprecated): https://cards-dev.twitter.com/validator
- Typefully: https://typefully.com/tools/twitter-card-validator
- ThreadCreator: https://threadcreator.com/tools/twitter-card-validator
- OpenGraph.xyz: https://www.opengraph.xyz/

### Testing Checklist

- [ ] Image loads quickly (under 2 seconds)
- [ ] Title is under 70 characters
- [ ] Description is under 200 characters
- [ ] Image displays correctly at 1200x628
- [ ] Alt text is descriptive
- [ ] @9takesdotcom handle is correct for twitter:site
- [ ] Appropriate card type for page type
- [ ] Images are accessible without authentication
- [ ] HTTPS URLs for all assets

## Best Practices for 9takes

### Content Guidelines

1. **Title Format**:
   - Homepage: "9takes - See the emotions behind every take"
   - Questions: "{Question} - 9takes"
   - Blog: "{Topic} and Enneagram Type {X} - 9takes"
   - Celebrity: "{Name}'s Enneagram Type {X} - 9takes"

2. **Description Strategy**:
   - Emphasize the "9 perspectives" concept
   - Mention Enneagram when relevant
   - Include "anonymous" for questions
   - Highlight the "give-first" mechanic where appropriate

3. **Image Design**:
   - Include 9takes logo consistently
   - Use Enneagram symbol where relevant
   - Ensure text is readable on mobile
   - Consider using type-specific colors
   - High contrast for accessibility

### Technical Implementation

1. **Caching Strategy**:
   - Add version query parameters for updates: `?v=1`
   - Set proper cache headers on images
   - Consider CDN for image delivery

2. **Robots.txt Configuration**:

   ```
   User-agent: Twitterbot
   Disallow:

   User-agent: facebookexternalhit
   Disallow:
   ```

3. **Performance Optimization**:
   - Use WEBP format for smaller file sizes
   - Implement lazy loading for non-critical images
   - Preload critical Twitter card images

## Implementation Roadmap

### Phase 1: Foundation (Immediate)

- [x] Audit current implementation
- [ ] Create SEOHead.svelte component
- [ ] Fix homepage Twitter handle (@9takesdotcom not @djwayne3)
- [ ] Standardize meta tag implementation

### Phase 2: Optimization (Week 1)

- [ ] Create optimized 1200x628 brand Twitter card
- [ ] Design type-specific Twitter cards (9 variants)
- [ ] Implement SEOHead across all public pages
- [ ] Test with Twitter Card validators

### Phase 3: Enhancement (Week 2)

- [ ] Add Twitter Analytics tracking
- [ ] Create question-specific card generator
- [ ] Implement A/B testing for card types
- [ ] Add social sharing buttons with proper meta tags

### Phase 4: Advanced (Month 1)

- [ ] Dynamic card generation for user content
- [ ] Personalized cards based on user's Enneagram type
- [ ] Rich media cards for interactive content
- [ ] Twitter Spaces integration metadata

## Common Issues & Solutions

### Image Not Showing

- Verify image URL is absolute (https://9takes.com/...)
- Check Supabase storage permissions if using storage
- Ensure image size is under 5MB
- Clear Twitter cache with version parameter

### Wrong Information Displayed

- Twitter caches for ~7 days
- Use cache-busting query parameters
- Check for duplicate meta tags
- Verify SEOHead component is only used once per page

### Card Type Not Rendering

- Ensure all required tags are present
- Check page is publicly accessible
- Verify no JavaScript-only rendering
- Test with curl to see raw HTML

## Monitoring & Analytics

### Key Metrics to Track

- Twitter card click-through rate
- Engagement by card type
- Performance by Enneagram type imagery
- A/B test results for descriptions

### Tools for Monitoring

- Twitter Analytics
- Google Analytics UTM parameters
- Vercel Analytics
- Custom event tracking for shares

## Content-Specific Optimizations

### Enneagram Corner

- Emphasize educational value
- Use type-specific imagery
- Include "Learn about Type X" in descriptions

### Personality Analysis

- Feature celebrity image prominently
- Include Enneagram type in title
- Mention key personality traits

### Questions

- Show question preview in description
- Highlight number of responses
- Emphasize anonymity and diversity

### Community Interactions

- Use engaging action words
- Show community size/activity
- Highlight give-first mechanic

## Compliance & Best Practices

### Privacy Considerations

- Don't expose user data in meta tags
- Use generic images for private content
- Respect user privacy settings

### Accessibility

- Always include alt text
- Ensure color contrast in images
- Provide text alternatives

### International Considerations

- Consider localized descriptions
- Use appropriate character encoding
- Test with international characters

## Resources

### Documentation

- [X (Twitter) Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [OpenGraph Protocol](https://ogp.me/)
- [Schema.org for SEO](https://schema.org/)

### Design Resources

- [Twitter Card Image Templates](https://www.canva.com/templates/?query=twitter-card)
- [Enneagram Color Palettes](https://www.enneagraminstitute.com/)

### Testing Tools

- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
