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
			? `${evidence.image.rights.creator} / ${evidence.image.source.publisher ?? 'source'}`
			: (evidence?.image.rights.creator ?? '')
	);
	let quoteSourceYear = $derived(evidence?.quote?.source.date_published?.slice(0, 4) ?? '');
	let imageWasEdited = $derived(Boolean(evidence?.image.rights.modifications.length));
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
			{#if !evidence.quote}
				<p class="blog-evidence__label">{evidence.label}</p>
			{/if}

			{#if evidence.quote}
				<blockquote class="blog-evidence__quote">
					<p>“{evidence.quote.text}”</p>
				</blockquote>
				<p class="blog-evidence__speaker">
					<strong>{evidence.quote.speaker}</strong>
					{#if evidence.quote.speaker_role}
						<span>{evidence.quote.speaker_role}</span>
					{/if}
				</p>
			{:else if evidence.caption}
				<p class="blog-evidence__caption">{evidence.caption}</p>
			{/if}

			{#if evidence.context}
				<p class="blog-evidence__context">{evidence.context}</p>
			{/if}

			<div class="blog-evidence__sources" aria-label="Sources and image credits">
				{#if evidence.quote}
					<p class="blog-evidence__source-line">
						<span class="blog-evidence__source-kind">Quote source</span>
						<!-- External registry URL: SvelteKit resolve() only accepts internal paths. -->
						<a href={evidence.quote.source.url} target="_blank" rel="noopener noreferrer">
							{evidence.quote.source.name}
						</a>
						{#if quoteSourceYear}
							<span aria-hidden="true">·</span>
							<span>{quoteSourceYear}</span>
						{/if}
					</p>
				{/if}
				<p class="blog-evidence__source-line blog-evidence__image-credit">
					<span class="blog-evidence__source-kind">Photo</span>
					<!-- External registry URL: SvelteKit resolve() only accepts internal paths. -->
					<a href={evidence.image.source.url} target="_blank" rel="noopener noreferrer">
						{imageCreditLabel}
					</a>
					{#if evidence.image.rights.license && evidence.image.rights.license_url}
						<span aria-hidden="true">·</span>
						<!-- External registry URL: SvelteKit resolve() only accepts internal paths. -->
						<a href={evidence.image.rights.license_url} target="_blank" rel="license noopener">
							{evidence.image.rights.license}
						</a>
					{:else if evidence.image.rights.status === 'fair-use'}
						<span aria-hidden="true">·</span>
						<span>editorial fair use</span>
					{/if}
					{#if imageWasEdited}
						<span aria-hidden="true">·</span>
						<span>edited for web</span>
					{/if}
				</p>
			</div>
		</figcaption>
	</figure>
{/if}
