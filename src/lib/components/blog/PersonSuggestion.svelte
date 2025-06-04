<!-- lib/components/blog/PersonSuggestion.svelte -->
<script lang="ts">
	export let title: string;
	export let posts: App.BlogPost[];
	export let sectionId: string;
</script>

<div class="suggestion-section" aria-labelledby={sectionId}>
	<h3 id={sectionId} class="section-title">{title}</h3>
	<ul class="people-grid" role="list">
		{#each posts as { slug, enneagram }}
			<li class="grid-item">
				<a
					href="/personality-analysis/{slug}"
					class="person-link"
					aria-label="Read personality analysis of {slug.split('-').join(' ')}"
				>
					{#if enneagram}
						<div class="image-container">
							<img
								loading="lazy"
								fetchpriority="low"
								class="grid-img"
								height="218"
								width="218"
								title="Personality analysis of {slug.split('-').join(' ')}"
								srcset={`/types/${enneagram}s/s-${slug}.webp 218w`}
								src={`/types/${enneagram}s/s-${slug}.webp`}
								alt="Portrait of {slug.split('-').join(' ')}"
							/>
							<div class="name-overlay" aria-hidden="true">
								<span class="person-name">{slug.split('-').join(' ')}</span>
							</div>
						</div>
					{/if}
					<div class="content-description">
						<h4 class="person-name">{slug.split('-').join(' ')}</h4>
						<p class="person-description">
							Explore the personality analysis of {slug.split('-').join(' ')}, an Enneagram type {enneagram}.
						</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
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

	.content-description {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
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
