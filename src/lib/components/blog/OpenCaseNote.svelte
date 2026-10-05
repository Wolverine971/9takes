<!-- src/lib/components/blog/OpenCaseNote.svelte -->
<!--
  Closing note for "open case" personality profiles: young, early-career
  subjects whose public record is too thin to settle a type. The pipeline sets
  content_quality.profile_format = 'open_case'; the profile page renders this
  before the author bio and links to it from the case-file header marker
  (href="#open-case").

  Shell is the shared <Callout> (lamp tone) so it reads as one of the article's
  own callouts, not a warning banner.
-->
<script lang="ts">
	import Callout from './callouts/Callout.svelte';

	let {
		personName,
		id = 'open-case',
		discussionHref = '#comments-section'
	}: {
		personName: string;
		/** Anchor target for the header marker. */
		id?: string;
		/** The page's discussion section ("Add your read on {name}"). */
		discussionHref?: string;
	} = $props();

	let headingId = $derived(`${id}-title`);
</script>

<Callout tone="lamp" label="Open case" class="open-case-note" {id} aria-labelledby={headingId}>
	<h2 id={headingId} class="open-case-note__title">Why this case is still open</h2>
	<p>
		{personName}’s public life is just getting started, so the record is still thin. Instead of
		forcing a verdict, this profile gives you the leading read, the types still in play, and what
		would settle it.
	</p>
	<p>
		A confident label on someone this early is a guess dressed up as a finding. We reopen the file
		as new interviews and choices come in.
	</p>
	<p class="open-case-note__ask">
		Think the leading read is wrong? Answer before the crowd:
		<a href={discussionHref}>add your read on {personName}</a>.
	</p>
</Callout>

<style lang="scss">
	/* Callout owns the shell, label, and paragraph rhythm. Only the heading and
	   the closing ask are local. */
	.open-case-note__title {
		margin: 0 0 0.6rem;
		padding: 0;
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 2vw, 1.3rem);
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: 0;
		color: var(--ink-bright);
	}

	.open-case-note__ask {
		a {
			font-weight: 600;
			text-decoration: underline;
			text-decoration-thickness: 1px;
			text-underline-offset: 3px;

			&:hover {
				color: var(--lamp-light);
			}
		}
	}
</style>
