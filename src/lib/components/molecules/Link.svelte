<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/atoms/card.svelte';

	// export let data: any;
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
	let hasContent = false;
	onMount(async () => {
		await fetchLink();
		await checkIframeLoaded();
	});

	const checkIframeLoaded = () => {
		const iframe = <HTMLIFrameElement>document.getElementById(`frame${link.id}`);
		var iframeDoc = iframe?.contentDocument; //|| iframe?.contentWindow?.document;

		// Check if loading is complete
		if (iframeDoc?.readyState === 'complete') {
			if (iframeDoc.URL !== 'about:blank') {
				hasContent = true;
			}

			return;
		}

		// If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
		window.setTimeout(checkIframeLoaded, 100);
	};

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

				const parsedTitle = doc.querySelector('title')?.textContent;
				const parsedDescription = doc.querySelector('meta[name="description"]')?.content;
				const parsedImage = doc.querySelector('meta[property="og:image"]')?.content;

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
	{:else if hasContent}
		<div class="card">
			<a href={link.url} on:click={() => saveLinkClick(link)}>
				{link.url}
				<iframe
					id={`frame${link.id}`}
					src={link.url}
					title="External Page"
					width="100%"
					height="300px"
				/>
			</a>
		</div>
	{:else}
		<div class="card">
			{#if link?.summary}
				<p style="white-space: pre-line">{link.summary}</p>
			{/if}
			<a href={link.url} on:click={() => saveLinkClick(link)}>{link.url}</a>
		</div>
	{/if}
</Card>

<style lang="scss">
	h3,
	p {
		margin: 0.5rem 0;
		padding: 0.5rem 0;
		// color: white;
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
