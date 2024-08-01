<script lang="ts">
	export let title: string;
	export let posts: App.BlogPost[];
</script>

<div>
	<h4 class="section-title">{title}</h4>
	<div class="people-grid-container">
		{#each posts as { slug, enneagram }}
			<a href="/blog/famous-enneagram-types/{slug}" class="grid-item">
				{#if enneagram}
					<img
						loading="lazy"
						fetchpriority="low"
						class="grid-img"
						height="218"
						width="218"
						title={slug.split('-').join(' ')}
						srcset={`/types/${enneagram}s/s-${slug}.webp 218w`}
						src={`/types/${enneagram}s/s-${slug}.webp`}
						alt={slug.split('-').join(' ')}
					/>
				{/if}
				<div class="fit-card txt-white">
					<h3 class="small-h3">
						{slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	.section-title {
		text-align: center;
		padding: 0.5rem;
	}

	.people-grid-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}

	.grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		text-align: center;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		position: relative;
		overflow: hidden;
		max-height: 220px;
	}

	.grid-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--base-border-radius);
		transition: filter 0.3s ease;

		&:hover {
			filter: blur(2px);
		}
	}

	.fit-card {
		filter: none;
		pointer-events: none;
	}

	.small-h3 {
		font-size: 17px;
		line-height: 24px;
		font-weight: 700;
		margin-bottom: 4px;
		text-wrap: balance;
		transition: transform 0.3s ease;
	}

	.grid-item:hover .small-h3 {
		transform: scale(1.1);
	}

	@media (max-width: 550px) {
		.small-h3 {
			font-size: 1rem;
		}
	}

	@media (min-width: 551px) {
		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}
</style>
