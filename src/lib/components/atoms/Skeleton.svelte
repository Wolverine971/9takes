<!-- src/lib/components/atoms/Skeleton.svelte -->
<script lang="ts">
	type Dimension = string | number;
	type Variant = 'text' | 'circular' | 'rectangular' | 'card';
	type Animation = 'pulse' | 'wave' | 'none';

	type Props = {
		width?: Dimension;
		height?: Dimension | 'auto';
		borderRadius?: string;
		variant?: Variant;
		animation?: Animation;
		class?: string;
		label?: string;
		decorative?: boolean;
	};

	let {
		width = '100%',
		height = 'auto',
		borderRadius,
		variant = 'rectangular',
		animation = 'pulse',
		class: extraClass = '',
		label = 'Loading',
		decorative = false
	}: Props = $props();

	function toCssDimension(value: Dimension) {
		return typeof value === 'number' ? `${value}px` : value;
	}

	const widthStyle = $derived(toCssDimension(width));
	const heightStyle = $derived.by(() => {
		if (height !== 'auto') return toCssDimension(height);
		if (variant === 'text') return '1em';
		if (variant === 'circular') return widthStyle;
		if (variant === 'card') return '300px';
		return '20px';
	});
	const radiusStyle = $derived(
		borderRadius ?? (variant === 'circular' ? '50%' : variant === 'card' ? '1rem' : '0.25rem')
	);
	const klass = $derived(
		['skeleton', `skeleton--${animation}`, `skeleton--${variant}`, extraClass]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div
	class={klass}
	style:width={widthStyle}
	style:height={heightStyle}
	style:border-radius={radiusStyle}
	role={decorative ? undefined : 'status'}
	aria-label={decorative ? undefined : label}
	aria-hidden={decorative ? 'true' : undefined}
>
	{#if !decorative}
		<span class="visually-hidden">{label}</span>
	{/if}
</div>

<style>
	.skeleton {
		background-color: color-mix(in srgb, var(--stone-mid) 72%, var(--stone-warm));
		position: relative;
		overflow: hidden;
	}

	.skeleton--text {
		transform: scale(1, 0.6);
		transform-origin: left center;
		margin: 0.25em 0;
	}

	.skeleton--pulse {
		animation: pulse 1.5s ease-in-out infinite;
	}

	.skeleton--wave::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transform: translateX(-100%);
		background-image: linear-gradient(
			90deg,
			color-mix(in srgb, var(--lamp-glow) 0%, transparent) 0,
			color-mix(in srgb, var(--lamp-glow) 8%, transparent) 20%,
			color-mix(in srgb, var(--lamp-glow) 16%, transparent) 60%,
			color-mix(in srgb, var(--lamp-glow) 0%, transparent)
		);
		animation: wave 1.5s linear infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes wave {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton--pulse,
		.skeleton--wave::after {
			animation: none;
		}
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
