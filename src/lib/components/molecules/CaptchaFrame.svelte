<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		label?: string;
		class?: string;
	};

	let { children, label = 'Security verification', class: extraClass = '' }: Props = $props();
</script>

<div
	class={['captcha-frame', extraClass].filter(Boolean).join(' ')}
	role="group"
	aria-label={label}
>
	<div class="captcha-frame__content">
		{@render children()}
	</div>
</div>

<style>
	.captcha-frame {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		overflow-x: auto;
		overscroll-behavior-inline: contain;
		padding-block: 0.125rem 0.25rem;
	}

	.captcha-frame__content {
		width: max-content;
		margin-inline: auto;
	}
</style>
