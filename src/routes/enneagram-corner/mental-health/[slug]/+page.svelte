<!-- src/routes/enneagram-corner/mental-health/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;

	const contentStore = writable('');
	let observer: MutationObserver | null = null;

	onMount(() => {
		findObserver();

		return () => {
			// Cleanup observer on unmount
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		};
	});

	// Watch for slug changes and reinitialize observer
	$: if (data?.slug) {
		// Reset content store when slug changes
		contentStore.set('');

		// Clean up existing observer
		if (observer) {
			observer.disconnect();
			observer = null;
		}

		// Set up new observer after a short delay to ensure DOM is updated
		setTimeout(() => {
			findObserver();
		}, 100);
	}

	const findObserver = () => {
		if (!browser) return;
		const node = document.querySelector('#blogA');

		if (!node) {
			setTimeout(findObserver, 500);
		} else {
			// Disconnect existing observer if any
			if (observer) {
				observer.disconnect();
			}

			observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') {
						contentStore.set(node.innerHTML);
					}
				});
			});

			observer.observe(node, { childList: true, subtree: true });

			// Also set initial content
			contentStore.set(node.innerHTML);
		}
	};
</script>

<!-- Crisis Notice Banner -->
<div class="crisis-notice">
	<strong>Crisis Resources:</strong> If you need immediate help, please call the National Suicide
	Prevention Lifeline at <strong>988</strong> or Crisis Text Line by texting HOME to
	<strong>741741</strong>.
</div>

<article itemscope itemtype="https://schema.org/BlogPosting" class="blog" id="blogA">
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
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText=""
				subtext=""
			/>
		</div>
	{/if}

	<TableOfContents
		{contentStore}
	/>

	<svelte:component this={component} />
</article>

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
	blogType={'Mental Health'}
	slugPrefix={'enneagram-corner/mental-health'}
/>

{#if !data?.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<style lang="scss">
	.crisis-notice {
		background-color: #fee;
		border: 2px solid #f66;
		padding: 1rem;
		margin: 1rem auto 2rem;
		border-radius: 8px;
		color: #d00;
		text-align: center;
		max-width: 800px;

		strong {
			font-weight: 700;
		}
	}

	.article-header {
		margin-bottom: 2rem;
	}

	.disclaimer-box {
		background-color: var(--color-bg-secondary);
		border-left: 4px solid var(--color-warning, #ffa500);
		padding: 1rem;
		margin: 1.5rem auto;
		max-width: 800px;
		border-radius: 4px;

		p {
			margin: 0;
			color: var(--text-primary);
			line-height: 1.6;
		}

		strong {
			color: var(--color-warning, #ffa500);
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
		border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
	}

	.resources-section {
		padding: 2rem 0;

		h2 {
			text-align: center;
			margin-bottom: 2rem;
			font-size: 2rem;
			color: var(--text-primary);
		}

		.resources-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;
			max-width: 900px;
			margin: 0 auto;

			.resource-card {
				background: var(--color-bg-secondary);
				padding: 1.5rem;
				border-radius: 8px;
				text-align: center;
				transition:
					transform 0.3s ease,
					box-shadow 0.3s ease;

				&:hover {
					transform: translateY(-4px);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				}

				h3 {
					margin-bottom: 0.5rem;
					color: var(--text-primary);
					font-size: 1.25rem;
				}

				p {
					margin-bottom: 1rem;
					color: var(--text-secondary);
					line-height: 1.5;
				}

				a {
					color: var(--color-primary);
					text-decoration: none;
					font-weight: 500;

					&:hover {
						text-decoration: underline;
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
			font-size: 0.875rem;
		}

		.resources-grid {
			grid-template-columns: 1fr !important;
		}
	}
</style>
