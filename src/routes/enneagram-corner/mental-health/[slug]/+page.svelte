<!-- src/routes/enneagram-corner/mental-health/[slug]/+page.svelte -->
<script lang="ts">
	import TableOfContents, { trackArticleHtml } from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import TestNudge from '$lib/components/blog/TestNudge.svelte';
	import TestYourTypeCTA from '$lib/components/blog/TestYourTypeCTA.svelte';
	import { getAuthShell } from '$lib/authShell.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const authShell = getAuthShell();
	type C = Component;
	const Article = $derived(data.component as unknown as C);

	// The article's live HTML, for the TOC's client-side fallback.
	let tocContent = $state('');
</script>

<!-- Crisis Notice Banner -->
<div class="crisis-notice">
	<strong>Crisis Resources:</strong> If you need immediate help, please call the National Suicide
	Prevention Lifeline at <strong>988</strong> or Crisis Text Line by texting HOME to
	<strong>741741</strong>.
</div>

<article class="blog" id="blogA" {@attach trackArticleHtml((html) => (tocContent = html))}>
	<div class="article-header">
		<BlogPageHead data={data.frontmatter} slug={`enneagram-corner/mental-health/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
		<ArticleSubTitle metaData={data.frontmatter} />
	</div>

	<!-- Disclaimer Box -->
	<div class="disclaimer-box">
		<p>
			<strong>Important:</strong> This content is for educational purposes only and should not replace
			professional mental health care. If you're struggling, please reach out to a qualified mental health
			professional.
		</p>
	</div>

	{#if data?.frontmatter?.pic}
		<div class="featured-image">
			<PopCard
				priority
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText={data?.frontmatter?.title || 'Mental health guide illustration'}
				subtext=""
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents content={tocContent} headings={data.frontmatter.headings} />

	<TestNudge placement="mental_health_top" />

	<Article />
</article>

<TestYourTypeCTA compact />

<hr class="section-divider" />

<!-- Additional Mental Health Resources -->
<section class="resources-section">
	<h2>Additional Mental Health Resources</h2>
	<div class="resources-grid">
		<div class="resource-card">
			<h3>National Alliance on Mental Illness</h3>
			<p>Support, education, and advocacy for mental health</p>
			<a href="https://www.nami.org" target="_blank" rel="noopener">Visit NAMI →</a>
		</div>
		<div class="resource-card">
			<h3>SAMHSA National Helpline</h3>
			<p>Treatment referral and information service</p>
			<a href="https://www.samhsa.gov/find-help" target="_blank" rel="noopener">Get Help →</a>
		</div>
		<div class="resource-card">
			<h3>Find a Therapist</h3>
			<p>Psychology Today's therapist directory</p>
			<a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener">
				Search Therapists →
			</a>
		</div>
	</div>
</section>

<hr class="section-divider" />

<SuggestionsBlog
	posts={data?.posts}
	blogType="Mental Health"
	slugPrefix="enneagram-corner/mental-health"
/>

{#if !authShell.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<style lang="scss">
	.crisis-notice {
		background-color: var(--error-light);
		border: 2px solid var(--error);
		padding: 1rem;
		margin: 1rem auto 2rem;
		border-radius: 1rem;
		color: var(--error-text);
		text-align: center;
		max-width: 800px;

		strong {
			font-weight: 700;
		}
	}

	.article-header {
		margin-bottom: 2rem;
	}

	/* Cold Light: no yellow. The disclaimer is a quiet indigo-barred note. */
	.disclaimer-box {
		background-color: var(--surface);
		border-left: 3px solid var(--accent);
		padding: 1rem;
		margin: 1.5rem auto;
		max-width: 800px;
		border-radius: 4px;

		p {
			margin: 0;
			color: var(--text-muted);
			line-height: 1.6;
		}

		strong {
			color: var(--text);
		}
	}

	.featured-image {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid var(--rule);
	}

	.resources-section {
		padding: 2rem 0;

		h2 {
			text-align: center;
			margin-bottom: 2rem;
			font-size: 2rem;
			color: var(--text);
		}

		.resources-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;
			max-width: 900px;
			margin: 0 auto;

			.resource-card {
				background: var(--surface);
				border: 1px solid var(--rule);
				padding: 1.5rem;
				border-radius: 1rem;
				text-align: center;
				transition:
					transform 0.3s ease,
					box-shadow 0.3s ease;

				&:hover {
					transform: translateY(-4px);
					box-shadow: var(--shadow-md);
				}

				h3 {
					margin-bottom: 0.5rem;
					color: var(--text);
					font-size: var(--font-size-xl);
				}

				p {
					margin-bottom: 1rem;
					color: var(--text-muted);
					line-height: 1.5;
				}

				/* Links are lavender and always underlined; the padding gives the
				   phone a 44px tap target. */
				a {
					display: inline-block;
					padding-block: 0.6rem;
					color: var(--highlight);
					text-decoration: underline;
					text-decoration-thickness: 1px;
					text-underline-offset: 3px;
					font-weight: 500;

					&:hover {
						color: var(--text);
					}
				}
			}
		}
	}

	.join {
		margin-top: 2rem;
	}

	@media (max-width: 768px) {
		.crisis-notice {
			margin: 0.75rem 1rem;
			padding: 0.75rem;
			font-size: var(--font-size-sm);
		}

		.resources-section .resources-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
