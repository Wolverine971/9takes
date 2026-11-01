<!-- src/lib/components/atoms/Popover.svelte -->
<script module lang="ts">
	let popoverCount = 0;

	function nextPanelId(): string {
		popoverCount += 1;
		return `popover-panel-${popoverCount}`;
	}
</script>

<script lang="ts">
	import { onMount, tick, type Snippet } from 'svelte';

	interface Props {
		position?: 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'bottom-right';
		/** Accessible name for the icon-only trigger, e.g. "Comment options". */
		label?: string;
		/** Content of the icon-only trigger button. */
		icon?: Snippet;
		/** Content of the disclosure panel. */
		popoverValue?: Snippet;
	}

	let { position = 'bottom-right', label = 'More options', icon, popoverValue }: Props = $props();

	// Disclosure pattern (button + panel of ordinary controls), not an ARIA menu:
	// the panel holds plain buttons and static info, so menu/menuitem semantics
	// and arrow-key roving would misdescribe it.
	const panelId = nextPanelId();

	let popupVisible = $state(false);
	let popoverContainer: HTMLElement | undefined;
	let triggerButton: HTMLElement | undefined;
	let panelElement: HTMLElement | undefined = $state();

	const FOCUSABLE_SELECTOR =
		'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	// Fixed position coordinates
	let popoverStyle = $state('');

	function calculatePosition() {
		if (!triggerButton) return;

		const triggerRect = triggerButton.getBoundingClientRect();

		let top: number;
		let right: number;

		// Position below the trigger, aligned to right edge
		top = triggerRect.bottom + 4;
		// Use right positioning instead of left - distance from right edge of viewport
		right = window.innerWidth - triggerRect.right;

		// Handle top positions
		if (position === 'top-right' || position === 'top') {
			// Position above - estimate height as 100px
			top = triggerRect.top - 100 - 4;
			if (top < 8) top = triggerRect.bottom + 4;
		}

		popoverStyle = `top: ${top}px; right: ${right}px;`;
	}

	async function handleClick(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();

		if (popupVisible) {
			close();
		} else {
			await open();
		}
	}

	async function open() {
		// Calculate position first based on trigger
		calculatePosition();
		popupVisible = true;

		await tick();

		document.addEventListener('click', handleOutsideClick);
		document.addEventListener('keydown', handleKeydown);
		window.addEventListener('scroll', handleScroll, true);
		window.addEventListener('resize', handleResize);

		panelElement?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
	}

	function close({ returnFocus = false } = {}) {
		popupVisible = false;
		popoverStyle = '';
		removeListeners();
		if (returnFocus) triggerButton?.focus();
	}

	function handleOutsideClick(e: MouseEvent) {
		if (popoverContainer && !popoverContainer.contains(e.target as Node)) {
			close();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape' || !popupVisible) return;
		// Only when focus is in this popover: a dialog opened from one of its
		// items handles its own Escape and restores focus to that item.
		if (!(e.target instanceof Node) || !popoverContainer?.contains(e.target)) return;
		e.stopPropagation();
		close({ returnFocus: true });
	}

	function handleFocusOut(e: FocusEvent) {
		if (!popupVisible) return;
		const next = e.relatedTarget;
		// null = focus left the document or landed on a non-focusable click
		// target; pointer dismissal is handled by handleOutsideClick.
		if (!(next instanceof Node) || popoverContainer?.contains(next)) return;
		// A dialog opened from an item (Edit/Flag) takes focus; keep the popover
		// so the dialog can return focus to that item when it closes.
		if (next instanceof Element && next.closest('[aria-modal="true"]')) return;
		close();
	}

	function handleScroll() {
		if (popupVisible) {
			calculatePosition();
		}
	}

	function handleResize() {
		if (popupVisible) {
			calculatePosition();
		}
	}

	function removeListeners() {
		document.removeEventListener('click', handleOutsideClick);
		document.removeEventListener('keydown', handleKeydown);
		window.removeEventListener('scroll', handleScroll, true);
		window.removeEventListener('resize', handleResize);
	}

	onMount(() => {
		return () => {
			removeListeners();
		};
	});
</script>

<div class="relative inline-block" bind:this={popoverContainer} onfocusout={handleFocusOut}>
	<button
		type="button"
		class="border-0 bg-transparent p-0"
		onclick={handleClick}
		bind:this={triggerButton}
		aria-label={label}
		aria-expanded={popupVisible}
		aria-controls={popupVisible ? panelId : undefined}
	>
		{@render icon?.()}
	</button>

	{#if popupVisible}
		<!-- Click handler only keeps panel clicks from bubbling to page-level
		     listeners; keyboard access lives on the controls inside. -->
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			id={panelId}
			class="fixed z-[9999] min-w-[180px] rounded-md border border-[var(--stone-edge)] bg-[var(--stone-warm)] p-2 shadow-[var(--shadow-lg)]"
			style={popoverStyle}
			bind:this={panelElement}
			onclick={(e) => e.stopPropagation()}
		>
			{@render popoverValue?.()}
		</div>
	{/if}
</div>
