<!-- src/lib/components/molecules/RelatedPosts.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Pluralize from 'pluralize';
	import { deserialize } from '$app/forms';

	export let slug: string;
	export let postType: string;
	export let enneagramType: string | null = null;

	let loading = true;
	let sameNichePosts: any[] = [];
	let sameEnneagramPosts: any[] = [];
	let error: string | null = null;

	// For responsive layout
	let innerWidth: number;

	// Format niche name (e.g., "movieStar" -> "Movie Stars")
	function formatNiche(niche: string): string {
		const plural = Pluralize(niche);
		return (
			plural.charAt(0).toUpperCase() +
			plural
				.slice(1)
				.split(/(?=[A-Z])/)
				.join(' ')
		);
	}

	// Responsive post count based on screen width
	function slicePosts(posts: any[]) {
		return posts.slice(0, innerWidth > 920 ? 6 : innerWidth > 576 ? 6 : 4);
	}

	// Format the niche type
	$: capitalizedPluralNiche = postType ? formatNiche(postType) : '';

	onMount(async () => {
		try {
			// Create the form data for the request
			const formData = new FormData();
			formData.append('slug', slug);

			if (postType) {
				formData.append('postType', postType);
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
				sameNichePosts = result.data.sameNichePosts || [];
				sameEnneagramPosts = result.data.sameEnneagramPosts || [];
			} else {
				error = result.error;
			}
		} catch (e) {
			error = 'Failed to load related posts';
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:window bind:innerWidth />

{#if loading}
	<section class="suggestions-container" aria-labelledby="loading-suggestions">
		<h2 id="loading-suggestions" class="suggestions-title">Further Analysis</h2>
		<div class="lazy-loading">
			<div class="loading-spinner"></div>
			<p>Loading related content...</p>
		</div>
	</section>
{:else if error}
	<section class="suggestions-container" aria-labelledby="error-suggestions">
		<h2 id="error-suggestions" class="suggestions-title">Further Analysis</h2>
		<div class="error">
			<p>Unable to load related content</p>
		</div>
	</section>
{:else if sameNichePosts.length || sameEnneagramPosts.length}
	<section class="suggestions-container" aria-labelledby="suggestions-title">
		<h2 id="suggestions-title" class="suggestions-title">Further Analysis</h2>
		<div class="suggestions-grid">
			{#if sameNichePosts.length}
				<div class="suggestion-section" aria-labelledby="niche-suggestions">
					<h3 id="niche-suggestions" class="section-title">More {capitalizedPluralNiche}</h3>
					<ul class="people-grid" role="list">
						{#each slicePosts(sameNichePosts) as post}
							<li class="grid-item">
								<a href="/personality-analysis/{post.slug}" class="person-link">
									<div class="image-container">
										<img
											loading="lazy"
											fetchpriority="low"
											class="grid-img"
											height="218"
											width="218"
											title="Personality analysis of {post.slug.split('-').join(' ')}"
											src={`/types/${post.enneagram}s/s-${post.slug}.webp`}
											alt="Portrait of {post.slug.split('-').join(' ')}"
										/>
										<div class="name-overlay">
											<span class="person-name">{post.slug.split('-').join(' ')}</span>
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
						{#each slicePosts(sameEnneagramPosts) as post}
							<li class="grid-item">
								<a href="/personality-analysis/{post.slug}" class="person-link">
									<div class="image-container">
										<img
											loading="lazy"
											fetchpriority="low"
											class="grid-img"
											height="218"
											width="218"
											title="Personality analysis of {post.slug.split('-').join(' ')}"
											src={`/types/${post.enneagram}s/s-${post.slug}.webp`}
											alt="Portrait of {post.slug.split('-').join(' ')}"
										/>
										<div class="name-overlay">
											<span class="person-name">{post.slug.split('-').join(' ')}</span>
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
	a::after {
		content: none;
	}

	.suggestions-container {
		margin: 3rem 0 5rem;
		padding: 0 1rem;
		max-width: 1200px;
	}

	.suggestions-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 2rem;
		color: var(--text-color);
	}

	.suggestions-grid {
		display: grid;
		gap: 3rem;

		@media (min-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.suggestion-section {
		width: 100%;
	}

	.section-title {
		text-align: center;
		padding: 0.5rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		color: var(--text-color);
	}

	.people-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		list-style-type: none;
		padding: 0;
	}

	.grid-item {
		position: relative;
		overflow: hidden;
		border-radius: var(--base-border-radius);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

			.grid-img {
				filter: brightness(0.8);
			}

			.name-overlay {
				opacity: 1;
			}
		}
	}

	.person-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.image-container {
		position: relative;
		width: 100%;
		padding-top: 100%; // 1:1 Aspect ratio
	}

	.grid-img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: filter 0.3s ease;
	}

	.name-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.5rem;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.person-name {
		font-size: 0.9rem;
		font-weight: bold;
		text-align: center;
		display: block;
	}

	.lazy-loading {
		text-align: center;
		padding: 2rem;
		color: var(--text-color-secondary, #666);
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid #eee;
		border-top: 3px solid #666;
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
		color: #c00;
		text-align: center;
	}

	@media (max-width: 576px) {
		.people-grid {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}

		.person-name {
			font-size: 0.8rem;
		}

		.name-overlay {
			opacity: 1;
		}
	}
</style>
