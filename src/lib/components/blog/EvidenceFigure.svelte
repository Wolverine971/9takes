<!-- src/lib/components/blog/EvidenceFigure.svelte -->
<script lang="ts">
	import { getBlogEvidenceMedia } from '$lib/blogEvidenceMedia';

	let { evidenceId }: { evidenceId: string } = $props();
	let evidence = $derived(getBlogEvidenceMedia(evidenceId));
	let portraitSide = $derived(evidence?.presentation?.portrait_side ?? 'left');
	let evidenceVariant = $derived(
		evidence?.presentation?.variant ?? (evidence?.kind === 'moment' ? 'feature' : 'portrait')
	);
	let evidenceClass = $derived(
		[
			'blog-evidence',
			`blog-evidence--${evidenceVariant}`,
			evidenceVariant === 'portrait' && portraitSide === 'right'
				? 'blog-evidence--portrait-right'
				: ''
		]
			.filter(Boolean)
			.join(' ')
	);
	let imageCreditLabel = $derived(
		evidence?.image.rights.status === 'fair-use'
			? `${evidence.image.rights.creator} / ${evidence.image.source.publisher ?? 'source'} · editorial fair use`
			: (evidence?.image.rights.attribution ?? '')
	);
</script>

{#if evidence}
	<figure
		class={evidenceClass}
		data-evidence-id={evidence.id}
		data-rights-status={evidence.image.rights.status}
	>
		<div class="blog-evidence__media">
			<img
				src={evidence.image.src}
				alt={evidence.image.alt}
				width={evidence.image.width}
				height={evidence.image.height}
				loading="lazy"
				decoding="async"
				style:object-position={evidence.image.object_position ?? '50% 50%'}
			/>
		</div>

		<figcaption class="blog-evidence__body">
			{#if evidenceVariant !== 'compact'}
				<p class="blog-evidence__label">{evidence.label}</p>
			{/if}

			{#if evidence.quote}
				{#if evidenceVariant === 'compact'}
					<p class="blog-evidence__speaker blog-evidence__speaker--lead">
						<strong>{evidence.quote.speaker}</strong>
						{#if evidence.quote.speaker_role}
							<span>{evidence.quote.speaker_role}</span>
						{/if}
					</p>
				{/if}
				<blockquote class="blog-evidence__quote">
					<p>“{evidence.quote.text}”</p>
				</blockquote>
				{#if evidenceVariant !== 'compact'}
					<p class="blog-evidence__speaker">
						<strong>{evidence.quote.speaker}</strong>
						{#if evidence.quote.speaker_role}
							<span>{evidence.quote.speaker_role}</span>
						{/if}
					</p>
				{/if}
			{:else if evidence.caption}
				<p class="blog-evidence__caption">{evidence.caption}</p>
			{/if}

			{#if evidence.context}
				<p class="blog-evidence__context">{evidence.context}</p>
			{/if}

			<div class="blog-evidence__sources">
				{#if evidence.quote}
					<!-- External registry URL: SvelteKit resolve() only accepts internal paths. -->
					<a href={evidence.quote.source.url} target="_blank" rel="noopener noreferrer">
						Source: {evidence.quote.source.name}
					</a>
				{/if}
				<span class="blog-evidence__image-credit">
					Photo:
					<!-- External registry URL: SvelteKit resolve() only accepts internal paths. -->
					<a href={evidence.image.source.url} target="_blank" rel="noopener noreferrer">
						{imageCreditLabel}
					</a>
					{#if evidence.image.rights.license && evidence.image.rights.license_url}
						·
						<!-- External registry URL: SvelteKit resolve() only accepts internal paths. -->
						<a href={evidence.image.rights.license_url} target="_blank" rel="license noopener">
							{evidence.image.rights.license}
						</a>
					{/if}
					{#if evidence.image.rights.modifications.length}
						<span>· {evidence.image.rights.modifications.join(', ')}</span>
					{/if}
				</span>
			</div>
		</figcaption>
	</figure>
{/if}
