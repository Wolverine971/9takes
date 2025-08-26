<!-- src/routes/enneagram-corner/mental-health/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;

	const contentStore = writable('');

	onMount(() => {
		findObserver();
	});

	const findObserver = () => {
		const node = document.querySelector('#blogA');

		if (!node) {
			setTimeout(findObserver, 500);
		} else {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') {
						const newContent = node.innerHTML;
						contentStore.set(newContent);
						observer.disconnect();
					}
				});
			});

			observer.observe(node, {
				childList: true,
				subtree: true
			});
		}
	};
</script>

<svelte:head>
	<style>
		:global(blockquote) {
			background-color: var(--card-bg-color);
			border-left: 4px solid var(--primary);
			padding: 1rem;
			margin: 1rem 0;
			font-style: italic;
			color: var(--text-color);
			opacity: 0.9;
		}

		:global(blockquote p) {
			margin: 0;
		}
	</style>
</svelte:head>

<BlogPageHead {data} slug={data?.slug} />

<main>
	<nav class="breadcrumb">
		<a href="/enneagram-corner">Enneagram Corner</a>
		<span class="separator">/</span>
		<a href="/enneagram-corner/mental-health">Mental Health</a>
		<span class="separator">/</span>
		<span class="current">{data.frontmatter.title}</span>
	</nav>

	<div class="crisis-notice">
		<strong>Crisis Resources:</strong> If you need immediate help, please call the National Suicide
		Prevention Lifeline at <strong>988</strong> or Crisis Text Line by texting HOME to
		<strong>741741</strong>.
	</div>

	<article class="p-4">
		<ArticleTitle frontmatter={data.frontmatter} />
		<ArticleSubTitle frontmatter={data.frontmatter} />

		<div class="disclaimer-box">
			<p>
				<strong>Important:</strong> This content is for educational purposes only and should not replace
				professional mental health care. If you're struggling, please reach out to a qualified mental
				health professional.
			</p>
		</div>

		<ArticleDescription frontmatter={data.frontmatter} />

		<div class="items-start justify-start md:flex">
			<div class="sticky top-2 hidden w-fit max-w-[270px] md:block">
				<TableOfContents {contentStore} />
			</div>

			<div class="min-w-0">
				<div id="blogA" class="blog-content">
					<svelte:component this={component} data={{ a: 'd' }} />
				</div>

				<div class="blog-footer">
					<div class="share-section">
						<h3>Found this helpful?</h3>
						<p>
							Share this guide with others who might benefit from type-specific mental health
							insights.
						</p>
					</div>

					<div class="resources-section">
						<h3>Additional Mental Health Resources</h3>
						<ul>
							<li>
								<a href="https://www.nami.org" target="_blank" rel="noopener">
									National Alliance on Mental Illness (NAMI)
								</a>
							</li>
							<li>
								<a href="https://www.samhsa.gov/find-help" target="_blank" rel="noopener">
									SAMHSA's National Helpline
								</a>
							</li>
							<li>
								<a
									href="https://www.psychologytoday.com/us/therapists"
									target="_blank"
									rel="noopener"
								>
									Find a Therapist - Psychology Today
								</a>
							</li>
						</ul>
					</div>
				</div>

				<EmailSignup />

				{#if data?.posts?.length > 0}
					<SuggestionsBlog
						posts={data.posts}
						blogType="Mental Health"
						slugPrefix="enneagram-corner/mental-health"
					/>
				{/if}
			</div>
		</div>
	</article>
</main>

<PopCard />

<style lang="scss">
	.breadcrumb {
		padding: 1rem 2rem;
		font-size: 0.875rem;
		color: var(--text-secondary);

		a {
			color: var(--color-primary);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}

		.separator {
			margin: 0 0.5rem;
			color: var(--text-muted);
		}

		.current {
			color: var(--text-primary);
		}
	}

	.crisis-notice {
		background-color: #fee;
		border: 2px solid #f66;
		padding: 1rem;
		margin: 1rem 2rem;
		border-radius: 8px;
		color: #d00;
		text-align: center;

		strong {
			font-weight: 700;
		}
	}

	.disclaimer-box {
		background-color: var(--color-bg-secondary);
		border-left: 4px solid var(--color-warning, #ffa500);
		padding: 1rem;
		margin: 1.5rem 0;
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

	.blog-content {
		:global(h2) {
			margin-top: 2rem;
			margin-bottom: 1rem;
			font-size: 1.75rem;
			font-weight: 700;
			color: var(--text-primary);
		}

		:global(h3) {
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			font-size: 1.25rem;
			font-weight: 600;
			color: var(--text-primary);
		}

		:global(p) {
			margin-bottom: 1rem;
			line-height: 1.7;
			color: var(--text-secondary);
		}

		:global(ul),
		:global(ol) {
			margin: 1rem 0;
			padding-left: 2rem;
		}

		:global(ul li),
		:global(ol li) {
			margin-bottom: 0.5rem;
			line-height: 1.6;
			color: var(--text-secondary);
		}

		:global(strong) {
			font-weight: 600;
			color: var(--text-primary);
		}
	}

	.blog-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border-color);

		.share-section {
			margin-bottom: 2rem;

			h3 {
				font-size: 1.25rem;
				margin-bottom: 0.5rem;
				color: var(--text-primary);
			}

			p {
				color: var(--text-secondary);
			}
		}

		.resources-section {
			background-color: var(--color-bg-secondary);
			padding: 1.5rem;
			border-radius: 8px;
			margin-bottom: 2rem;

			h3 {
				font-size: 1.25rem;
				margin-bottom: 1rem;
				color: var(--text-primary);
			}

			ul {
				list-style: none;
				padding: 0;

				li {
					margin-bottom: 0.75rem;

					a {
						color: var(--color-primary);
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}
				}
			}
		}
	}

	@media (max-width: 768px) {
		.breadcrumb {
			padding: 0.75rem 1rem;
			font-size: 0.75rem;
		}

		.crisis-notice {
			margin: 0.75rem 1rem;
			padding: 0.75rem;
			font-size: 0.875rem;
		}
	}
</style>
