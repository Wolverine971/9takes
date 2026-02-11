<!-- src/lib/components/map/geocoder/Geocoder.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import action from '$lib/components/map/geocoder/geocoder-action';

	type GeocoderReadyDetail = { geocoder: unknown };

	export let accessToken = '';
	export let options: Record<string, unknown> = {};
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
	export let value: string | null = null;
	export let customStylesheetUrl: string | false = false;
	export let geocoder: unknown = null;

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

	function init({ detail }: CustomEvent<unknown>) {
		geocoder = (detail as GeocoderReadyDetail).geocoder;
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
></div>

<style>
	div {
		padding: 0;
	}
</style>
