<!-- lib/components/map/geocoder/Geocoder.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import action from '$lib/components/map/geocoder/geocoder-action';

	export let accessToken;
	export let options = {};
	export let version = 'v4.5.1';
	export let types = [
		'country',
		'region',
		'postcode',
		'district',
		'place',
		'locality',
		'neighborhood',
		'address'
	];
	export let placeholder = 'Search';
	export let value = null;
	export let customStylesheetUrl = false;
	export let geocoder;

	const dispatch = createEventDispatcher();
	const fieldId = 'bsm-' + Math.random().toString(36).substring(6);

	const optionsWithDefaults = Object.assign(
		{
			version,
			accessToken,
			types: types.join(','),
			placeholder,
			customStylesheetUrl,
			value
		},
		options
	);

	function init({ detail }) {
		geocoder = detail.geocoder;
		dispatch('ready');
	}
</script>

<div
	id={fieldId}
	use:action={optionsWithDefaults}
	on:ready={init}
	on:results
	on:result
	on:loading
	on:error
	on:clear
	on:load
/>

<style>
	div {
		padding: 0;
	}
</style>
