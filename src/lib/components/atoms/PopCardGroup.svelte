<!-- src/lib/components/atoms/PopCardGroup.svelte -->
<script lang="ts">
	/**
	 * Movie-poster style group card showing 2-6 people side by side,
	 * overlapping from left to right. Based on PopCard's visual language.
	 *
	 * Usage:
	 *   <PopCardGroup people={[
	 *     { image: '/types/5s/Elon-Musk.webp', text: 'Elon Musk', enneagramType: 5 },
	 *     { image: '/types/8s/Jeff-Bezos.webp', text: 'Jeff Bezos', enneagramType: 8 },
	 *   ]} />
	 */

	interface Person {
		image: string;
		text: string;
		enneagramType?: number;
		subtext?: string;
	}

	export let people: Person[] = [];
	export let aspectRatio = '16 / 9';
	export let lazyLoad = true;

	// Small overlap that scales with count — more people = slightly more overlap
	// 2 people: ~5%, 6 people: ~15%
	function getOverlapPx(total: number): number {
		if (total <= 2) return 5;
		return 5 + (total - 2) * 2.5;
	}

	function getZIndex(index: number, total: number): number {
		// Later people stack on top
		return total - index;
	}

	function getSmallSrc(image: string): string {
		const parts = image.split('/');
		const file = parts.pop();
		return [...parts, `s-${file}`].join('/');
	}
</script>

<div
	class="pop-group"
	style="aspect-ratio: {aspectRatio};"
	role="img"
	aria-label={people.map((p) => p.text).join(', ')}
>
	<div
		class="pop-group__people"
		style="--count: {people.length}; --overlap: {getOverlapPx(people.length)}px;"
	>
		{#each people as person, i}
			<div class="pop-group__person" style="z-index: {getZIndex(i, people.length)};">
				<img
					src={person.image}
					srcset="{getSmallSrc(person.image)} 218w, {person.image} 560w"
					sizes="(max-width: 560px) 150px, 280px"
					loading={lazyLoad ? 'lazy' : 'eager'}
					decoding="async"
					alt={person.text}
					class="pop-group__img"
				/>
				<div class="pop-group__label">
					<span class="pop-group__name">{person.text}</span>
					{#if person.enneagramType}
						<span class="pop-group__type">Type {person.enneagramType}</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.pop-group {
		position: relative;
		width: clamp(300px, 100%, 700px);
		margin: 1.5rem auto;
		overflow: hidden;
		border: 2px solid var(--primary, #2d1b69);
		border-radius: var(--border-radius, 0.75rem);
		background: linear-gradient(135deg, var(--bg-base), var(--bg-deep));
	}

	.pop-group__people {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		height: 100%;
		padding: 0 1rem;
	}

	.pop-group__person {
		position: relative;
		flex: 1 1 0%;
		min-width: 0;
		max-width: 320px;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		transition: transform 0.3s ease;

		// Subtle overlap — first child has no negative margin
		&:not(:first-child) {
			margin-left: calc(var(--overlap, 5px) * -1);
		}

		&:hover {
			transform: translateY(-4px) scale(1.03);
			z-index: 100 !important;
		}
	}

	.pop-group__img {
		width: 100%;
		height: 90%;
		object-fit: cover;
		object-position: top center;
		mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
		filter: grayscale(0.15) contrast(1.05);
		transition: filter 0.3s ease;
	}

	.pop-group__person:hover .pop-group__img {
		filter: grayscale(0) contrast(1.1) brightness(1.05);
	}

	.pop-group__label {
		position: absolute;
		bottom: 0.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		z-index: 5;
		white-space: nowrap;
	}

	.pop-group__name {
		font-family: var(--font-family, sans-serif);
		font-size: clamp(0.6rem, 2vw, 0.85rem);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: rgba(255, 255, 255, 0.95);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
	}

	.pop-group__type {
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: clamp(0.5rem, 1.5vw, 0.65rem);
		letter-spacing: 0.1em;
		color: var(--accent-light);
		text-shadow: 0 0 6px var(--primary-glow);
	}

	// Responsive
	@media (max-width: 500px) {
		.pop-group {
			aspect-ratio: auto !important;
			min-height: 250px;
		}

		.pop-group__name {
			font-size: 0.55rem;
			padding: 0.15rem 0.35rem;
		}

		.pop-group__type {
			font-size: 0.45rem;
		}
	}
</style>
