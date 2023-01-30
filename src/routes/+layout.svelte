<script lang="ts">
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import './styles.css';
	

	import instagram from '$lib/images/instagram.svg';
	import twitter from '$lib/images/twitter.svg';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import Toast from '$lib/components/molecules/Toast.svelte';

	export let data: PageData;
</script>

<div class="app">
	<Header {data} />
	<Toast />
	<main>
		<slot />
	</main>

	<footer style="display: flex; flex-direction: row; justify-content:center;">
		
		<a href="https://www.instagram.com/9takesdotcom/">
			<img src={instagram} alt="Instagram" class="icon" />
		</a>
		<a href="https://twitter.com/9takesdotcom">
			<img src={twitter} alt="Twitter" class="icon" />
		</a>

	</footer>
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;

		& .icon {
			width: 2em;
			height: 2em;
			object-fit: contain;
		}
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
