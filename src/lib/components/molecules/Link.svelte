<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../atoms/card.svelte';

	export let data: any;
	export let user: any;
	export let questionId: number;
	export let link: any;
	let linkData: any = false;

	let innerWidth: number = 0;
	let loading: boolean = false;

	const uuid = crypto.randomUUID();

	const saveLinkClick = async (link: any) => {
		let body = new FormData();
		body.append('linkId', link.id);

		const resp = await fetch('?/saveLinkClick', {
			method: 'POST',
			body
		});
	};
	onMount(async () => {
		await fetchLink();
	});

	let title = '';
	let description = '';
	let imageSrc = '';

	const fetchLink = async () => {
		try {
			loading = true;

			const resp = await fetch(link.url);
			const data = await resp.text();

			if (data) {
				// Initialize the DOM parser
				var parser = new DOMParser();
				// Parse the text
				var doc = parser.parseFromString(data, 'text/html');

				const parsedTitle = doc.querySelector('title').textContent;
				const parsedDescription = doc.querySelector('meta[name="description"]').content;
				const parsedImage = doc.querySelector('meta[property="og:image"]').content;

				title = parsedTitle ? parsedTitle : '';
				description = parsedDescription ? parsedDescription.slice(0, 70) : '';
				imageSrc = parsedImage ? parsedImage : '';
			}

			loading = false;
			linkData = data ? true : false;
		} catch (e) {
			console.log(e);
			loading = false;
		}
	};
</script>

<svelte:window bind:innerWidth />

<Card>
	{#if loading}
		<div class="loader" />
	{:else if linkData}
		<a href={link.url} class="item">
			<img src={imageSrc} alt="" />
			<h3>{title}</h3>
			<p>{description}</p>
		</a>
	{:else}
		<a href={link.url} on:click={() => saveLinkClick(link)}>{link.url}</a>
	{/if}
</Card>

<style lang="scss">
	h3,
	p {
		margin: 0.5rem;
		padding: 0.5rem;
		color: white;
		z-index: 1234;
	}
	img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.item {
		margin: 1rem 0;
		width: 100%;
		height: 300px;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		-webkit-align-items: flex-end;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		transition: all 0.4s ease-in-out;
		-webkit-transition: all 0.4s ease-in-out;
		cursor: pointer;
	}
</style>
