<!-- src/lib/components/blog/callouts/InsightBox.svelte -->
<script lang="ts">
	type Tone = 'success' | 'info' | 'warning' | 'neutral';

	export let title = '';
	export let tone: Tone = 'success';

	const toneClasses: Record<Tone, { border: string; bg: string; title: string }> = {
		success: {
			border: 'border-semantic-success',
			bg: 'bg-success-50/90',
			title: 'text-semantic-success'
		},
		info: {
			border: 'border-info-500',
			bg: 'bg-info-50/80',
			title: 'text-info-700'
		},
		warning: {
			border: 'border-warning-500',
			bg: 'bg-warning-50/80',
			title: 'text-warning-700'
		},
		neutral: {
			border: 'border-neutral-300',
			bg: 'bg-white',
			title: 'text-neutral-900'
		}
	};

	const currentTone = toneClasses[tone] ?? toneClasses.success;
</script>

<aside
	class={`rounded-lg border-l-4 ${currentTone.border} ${currentTone.bg} px-4 py-3 text-sm leading-snug text-neutral-800 shadow-sm`}
>
	{#if title}
		<h4 class={`mb-1 text-base font-semibold ${currentTone.title}`}>{title}</h4>
	{/if}
	<div class="space-y-3">
		<slot />
	</div>
</aside>
