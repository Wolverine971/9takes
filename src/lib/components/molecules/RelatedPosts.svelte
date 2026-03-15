<!-- src/lib/components/molecules/RelatedPosts.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';

	type RelatedPostCard = {
		slug: string;
		enneagram: string | number | null;
	};

	type RelatedPostsPayload = {
		sameNichePosts?: RelatedPostCard[];
		sameEnneagramPosts?: RelatedPostCard[];
	};

	export let slug: string;
	export let postTypes: string[] = [];
	export let enneagramType: string | null = null;

	let loading = true;
	let sameNichePosts: RelatedPostCard[] = [];
	let sameEnneagramPosts: RelatedPostCard[] = [];
	let error: string | null = null;

	// For responsive layout
	let innerWidth: number;

	// Responsive post count based on screen width
	function slicePosts(posts: RelatedPostCard[]) {
		return posts.slice(0, innerWidth > 920 ? 6 : innerWidth > 576 ? 6 : 4);
	}

	onMount(async () => {
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
				sameNichePosts = Array.isArray(payload.sameNichePosts) ? payload.sameNichePosts : [];
				sameEnneagramPosts = Array.isArray(payload.sameEnneagramPosts)
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
					<h3 id="niche-suggestions" class="section-title">Similar Profiles</h3>
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
	.suggestions-container {
		margin: 3rem 0 5rem;
		padding: 0 1rem;
		max-width: 1200px;
	}

	.suggestions-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 2rem;
		color: #f1f5f9;
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
		color: #cbd5e1;
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
		border-radius: 12px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(100, 116, 139, 0.2);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			border-color 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 0 25px rgba(124, 58, 237, 0.3);
			border-color: rgba(124, 58, 237, 0.5);

			.grid-img {
				filter: brightness(0.9);
			}

			.name-overlay {
				opacity: 1;
				background: linear-gradient(to top, rgba(124, 58, 237, 0.9), rgba(0, 0, 0, 0.7));
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
		background: linear-gradient(to top, rgba(10, 10, 15, 0.9), rgba(0, 0, 0, 0.5));
		color: #f1f5f9;
		padding: 0.5rem;
		opacity: 0;
		transition: all 0.3s ease;
	}

	.person-name {
		font-size: 0.9rem;
		font-weight: bold;
		text-align: center;
		display: block;
		text-transform: capitalize;
	}

	.lazy-loading {
		text-align: center;
		padding: 2rem;
		color: #94a3b8;
	}

	.loading-spinner {
		width: 30px;
		height: 30px;
		border: 3px solid #252538;
		border-top: 3px solid #7c3aed;
		border-radius: 50%;
		margin: 0 auto 1rem;
		animation: spin 1s linear infinite;
		box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
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
		color: #ef4444;
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
