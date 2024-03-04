<script lang="ts">
	import Enneagram from '$lib/components/icons/enneagram.svelte';
	import { createEventDispatcher } from 'svelte';
	import Context, { onClickOutside } from './Context.svelte';
	const dispatch = createEventDispatcher();
	export let selectedEnneagram: number | string | null = null;

	$: selectedEnneagram;

	const selected = async (numb: number) => {
		dispatch('enneagramSelected', numb);
		let checkbox: any | null = document.getElementById('menu-open');
		if (checkbox) {
			checkbox.checked = false;
		}
	};
</script>

<Context>
	<nav
		class="menu"
		use:onClickOutside={() => {
			let checkbox = document.getElementById('menu-open');
			if (checkbox) {
				checkbox.checked = false;
			}
		}}
	>
		<input type="checkbox" class="menu-open menu-open-button" name="menu-open" id="menu-open" />
		<label class="menu-open-button enneagram-btn" for="menu-open">
			<!-- <span class="hamburger hamburger-1" />
		<span class="hamburger hamburger-2" />
		<span class="hamburger hamburger-3" /> -->
			<!-- <enneagram /> -->

			{#if selectedEnneagram}
				{selectedEnneagram}
			{:else}
				<Enneagram height={'3rem'} fill={''} />
			{/if}
			<!-- Enneagram {selectedEnneagram ? selectedEnneagram : ''} -->
		</label>

		<button
			class="menu-item"
			on:click={() => {
				selected(2);
			}}
			>2
		</button>
		<button
			class="menu-item"
			on:click={() => {
				selected(3);
			}}>3</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(4);
			}}>4</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(5);
			}}>5</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(6);
			}}>6</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(7);
			}}>7</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(8);
			}}>8</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(9);
			}}>9</button
		>
		<button
			class="menu-item"
			on:click={() => {
				selected(1);
			}}>1</button
		>
	</nav>
</Context>

<!-- filters -->

<!-- <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
	<defs>
		<filter id="shadowed-goo">
			<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
			<feColorMatrix
				in="blur"
				mode="matrix"
				values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
				result="goo"
			/>
			<feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
			<feColorMatrix
				in="shadow"
				mode="matrix"
				values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
				result="shadow"
			/>
			<feOffset in="shadow" dx="1" dy="1" result="shadow" />
			<feBlend in2="shadow" in="goo" result="goo" />
			<feBlend in2="goo" in="SourceGraphic" result="mix" />
		</filter>
		<filter id="goo">
			<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
			<feColorMatrix
				in="blur"
				mode="matrix"
				values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
				result="goo"
			/>
			<feBlend in2="goo" in="SourceGraphic" result="mix" />
		</filter>
	</defs>
</svg> -->
<style lang="scss">
	.enneagram-btn {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.menu {
		filter: url('#shadowed-goo');
		z-index: 2;
		display: flex;
		justify-content: center;
		height: 80px;
	}

	.menu-item,
	.menu-open-button {
		background-color: var(--black);
		border-radius: 100%;
		cursor: pointer;
		width: 80px;
		height: 80px;
		position: absolute;
		color: rgb(190, 38, 215);
		border: 1px solid rgb(190, 38, 215);
		text-align: center;
		line-height: 80px;
		transform: translate3d(0, 0, 0);
		transition: transform ease-out 200ms;
	}

	.menu-open {
		display: none;
	}

	.hamburger {
		width: 25px;
		height: 3px;
		background-color: var(--color-paladin-1, var(--white));
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -12.5px;
		margin-top: -1.5px;
		transition: transform 200ms;
	}

	.hamburger-1 {
		transform: translate3d(0, -8px, 0);
	}

	.hamburger-2 {
		transform: translate3d(0, 0, 0);
	}

	.hamburger-3 {
		transform: translate3d(0, 8px, 0);
	}

	.menu-open:checked + .menu-open-button .hamburger-1 {
		transform: translate3d(0, 0, 0) rotate(45deg);
	}

	.menu-open:checked + .menu-open-button .hamburger-2 {
		transform: translate3d(0, 0, 0) scale(0.1, 1);
	}

	.menu-open:checked + .menu-open-button .hamburger-3 {
		transform: translate3d(0, 0, 0) rotate(-45deg);
	}

	.menu {
		position: relative;
		width: 80px;
		height: 80px;
		box-sizing: border-box;
		text-align: left;
	}

	.menu-item:hover {
		background-color: rgb(190, 38, 215);
		color: var(--black);
		border: 1px solid var(--black);
	}

	.menu-open-button {
		z-index: 2;
		transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
		transition-duration: 400ms;
		transform: scale(1.1, 1.1) translate3d(0, 0, 0);
		cursor: pointer;
	}

	.menu-open-button:hover {
		transform: scale(1.2, 1.2) translate3d(0, 0, 0);
	}

	.menu-open:checked + .menu-open-button {
		transition-timing-function: linear;
		transition-duration: 200ms;
		transform: scale(0.8, 0.8) translate3d(0, 0, 0);
	}

	.menu-open:checked ~ .menu-item {
		transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
		font-size: 2rem;
	}

	.menu-open:checked ~ .menu-item:nth-child(3) {
		transition-duration: 160ms;
		transform: rotate(80deg) translate3d(0, -140px, 0) rotate(-80deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(4) {
		transition-duration: 200ms;
		transform: rotate(120deg) translate3d(0, -140px, 0) rotate(-120deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(5) {
		transition-duration: 240ms;
		transform: rotate(160deg) translate3d(0, -140px, 0) rotate(-160deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(6) {
		transition-duration: 280ms;
		transform: rotate(200deg) translate3d(0, -140px, 0) rotate(-200deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(7) {
		transition-duration: 320ms;
		transform: rotate(240deg) translate3d(0, -140px, 0) rotate(-240deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(8) {
		transition-duration: 360ms;
		transform: rotate(280deg) translate3d(0, -140px, 0) rotate(-280deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(9) {
		transition-duration: 400ms;
		transform: rotate(320deg) translate3d(0, -140px, 0) rotate(-320deg);
	}
	.menu-open:checked ~ .menu-item:nth-child(10) {
		transition-duration: 80ms;
		transform: rotate(0deg) translate3d(0, -140px, 0) rotate(0deg);
	}

	.menu-open:checked ~ .menu-item:nth-child(11) {
		transition-duration: 120ms;
		transform: rotate(40deg) translate3d(0, -140px, 0) rotate(-40deg);
	}
</style>
