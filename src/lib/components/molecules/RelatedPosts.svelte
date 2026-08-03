<!-- src/lib/components/molecules/RelatedPosts.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	type RelatedPostCard = {
		slug: string;
		enneagram: string | number | null;
	};

	type RelatedPostsPayload = {
		sameNichePosts?: RelatedPostCard[];
		sameEnneagramPosts?: RelatedPostCard[];
	};

	type RelatedPostsProps = {
		slug: string;
		postTypes?: string[];
		enneagramType?: string | null;
		initialSameNichePosts?: RelatedPostCard[];
		initialSameEnneagramPosts?: RelatedPostCard[];
	};

	let {
		slug,
		postTypes = [],
		enneagramType = null,
		initialSameNichePosts = [],
		initialSameEnneagramPosts = []
	}: RelatedPostsProps = $props();

	let fetchedSameNichePosts = $state<RelatedPostCard[] | null>(null);
	let fetchedSameEnneagramPosts = $state<RelatedPostCard[] | null>(null);
	let requestComplete = $state(false);
	let error = $state<string | null>(null);
	let hasInitialPosts = $derived(
		initialSameNichePosts.length > 0 || initialSameEnneagramPosts.length > 0
	);
	let loading = $derived(!hasInitialPosts && !requestComplete);
	let sameNichePosts = $derived(fetchedSameNichePosts ?? initialSameNichePosts);
	let sameEnneagramPosts = $derived(fetchedSameEnneagramPosts ?? initialSameEnneagramPosts);

	const MAX_POSTS_PER_GROUP = 4;

	function selectPosts(posts: RelatedPostCard[]) {
		return posts.slice(0, MAX_POSTS_PER_GROUP);
	}

	onMount(async () => {
		if (!loading) return;

		try {
			// Create the form data for the request
			const formData = new FormData();
			formData.append('slug', slug);

			if (postTypes.length) {
				formData.append('postTypes', JSON.stringify(postTypes));
			}

			if (enneagramType) {
				formData.append('enneagram', enneagramType);
			}

			// Send request to the server action
			const response = await fetch(`?/getRelatedPosts`, {
				method: 'POST',
				body: formData
			});

			const result = await deserialize(await response.text());

			if (result.type === 'success') {
				const payload = (result.data ?? {}) as RelatedPostsPayload;
				fetchedSameNichePosts = Array.isArray(payload.sameNichePosts) ? payload.sameNichePosts : [];
				fetchedSameEnneagramPosts = Array.isArray(payload.sameEnneagramPosts)
					? payload.sameEnneagramPosts
					: [];
			} else {
				error =
					result.type === 'error'
						? result.error?.message || 'Unable to load related content'
						: 'Unable to load related content';
			}
		} catch (e) {
			error = 'Failed to load related posts';
			console.error(e);
		} finally {
			requestComplete = true;
		}
	});
</script>

{#if loading}
	<section class="suggestions-container" aria-labelledby="loading-suggestions">
		<h2 id="loading-suggestions" class="suggestions-title">Related Case Files</h2>
		<div class="lazy-loading">
			<div class="loading-spinner"></div>
			<p>Loading related content...</p>
		</div>
	</section>
{:else if error}
	<section class="suggestions-container" aria-labelledby="error-suggestions">
		<h2 id="error-suggestions" class="suggestions-title">Related Case Files</h2>
		<div class="error">
			<p>Unable to load related content</p>
		</div>
	</section>
{:else if sameNichePosts.length || sameEnneagramPosts.length}
	<section class="suggestions-container" aria-labelledby="suggestions-title">
		<h2 id="suggestions-title" class="suggestions-title">Related Case Files</h2>
		<div class="suggestions-grid">
			{#if sameNichePosts.length}
				<div class="suggestion-section" aria-labelledby="niche-suggestions">
					<h3 id="niche-suggestions" class="section-title">Similar Profiles</h3>
					<ul class="people-grid" role="list">
						{#each selectPosts(sameNichePosts) as post (post.slug)}
							{@const personName = formatPersonalityDisplayName(post.slug)}
							{@const imagePath = buildPersonalityImagePath(post.enneagram, post.slug, 'thumbnail')}
							<li class="grid-item">
								<a
									href={buildPersonalityAnalysisPath(post.slug)}
									class="person-link"
									aria-label={`Read the personality analysis of ${personName}`}
								>
									<div class="image-container personality-portrait-well">
										<img
											loading="lazy"
											fetchpriority="low"
											class="grid-img personality-portrait-image"
											height="218"
											width="218"
											title="Personality analysis of {personName}"
											src={imagePath}
											alt="Portrait of {personName}"
										/>
										<div class="name-overlay">
											<span class="person-name">{personName}</span>
										</div>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if sameEnneagramPosts.length}
				<div class="suggestion-section" aria-labelledby="enneagram-suggestions">
					<h3 id="enneagram-suggestions" class="section-title">
						Other Enneagram {enneagramType}s
					</h3>
					<ul class="people-grid" role="list">
						{#each selectPosts(sameEnneagramPosts) as post (post.slug)}
							{@const personName = formatPersonalityDisplayName(post.slug)}
							{@const imagePath = buildPersonalityImagePath(post.enneagram, post.slug, 'thumbnail')}
							<li class="grid-item">
								<a
									href={buildPersonalityAnalysisPath(post.slug)}
									class="person-link"
									aria-label={`Read the personality analysis of ${personName}`}
								>
									<div class="image-container personality-portrait-well">
										<img
											loading="lazy"
											fetchpriority="low"
											class="grid-img personality-portrait-image"
											height="218"
											width="218"
											title="Personality analysis of {personName}"
											src={imagePath}
											alt="Portrait of {personName}"
										/>
										<div class="name-overlay">
											<span class="person-name">{personName}</span>
										</div>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style lang="scss">
	.suggestions-container {
		margin: 0;
		max-width: 100%;
	}

	.suggestions-title {
		text-align: center;
		margin: 0 0 1.5rem;
		font-size: clamp(1.5rem, 3vw, 2rem);
		line-height: 1.1;
		color: var(--ink-bright);
	}

	.suggestions-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;

		@media (max-width: 720px) {
			grid-template-columns: 1fr;
		}
	}

	.suggestion-section {
		width: 100%;
	}

	.section-title {
		margin: 0 0 0.75rem;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		line-height: 1.4;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.people-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.grid-item {
		position: relative;
		overflow: hidden;
		border-radius: 1rem;
		border: 1px solid var(--stone-edge);
		background: var(--stone-warm);
		padding: 0.45rem;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;

		&:hover {
			border-color: color-mix(in srgb, var(--lamp-glow) 48%, var(--stone-edge));
			background: var(--stone-mid);

			.grid-img {
				transform: scale(1.025);
			}
		}
	}

	.person-link {
		text-decoration: none;
		color: inherit;
		display: block;
		border-radius: 0.625rem;
	}

	.image-container {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 0.625rem;
	}

	.grid-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: var(--personality-portrait-filter);
		mix-blend-mode: normal;
		transition: transform 0.25s ease;
	}

	.name-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(
			to top,
			rgba(10, 8, 7, 0.94) 0%,
			rgba(10, 8, 7, 0.64) 58%,
			transparent 100%
		);
		color: var(--text-on-dark);
		padding: 2.5rem 0.65rem 0.65rem;
		pointer-events: none;
	}

	.person-name {
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.25;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-transform: capitalize;
	}

	.lazy-loading {
		text-align: center;
		padding: 2rem;
		color: var(--ink-mid);
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid var(--stone-warm);
		border-top: 3px solid var(--lamp-glow);
		border-radius: 50%;
		margin: 0 auto 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error {
		padding: 1rem;
		color: var(--error-text);
		text-align: center;
	}

	@media (max-width: 420px) {
		.person-name {
			font-size: 0.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grid-img,
		.grid-item {
			transition: none;
		}

		.grid-item:hover .grid-img {
			transform: none;
		}

		.loading-spinner {
			animation: none;
		}
	}
</style>
