<!-- src/lib/components/molecules/LinkMap.svelte -->
<script lang="ts">
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { Map, Geocoder, Marker, controls } from '$lib/components/map/components';

	const { GeolocateControl, NavigationControl } = controls;

	interface GeocoderPlace {
		label?: string;
		center: unknown;
		geometry?: {
			lat?: number;
			lng?: number;
		};
	}

	let place: GeocoderPlace | null = null;
	// export let points: any[] = [];

	interface LinkDrops {
		id: number;
		created_at: string;
		question_id: number | null;
		address_id: number | null;
		number_of_drops: number | null;
		number_of_hits: number | null;
		external_id: string;
		addresses: Addresses | null;
		questions: Questions | null;
	}

	interface Questions {
		id: number;
		question: string | null;
		created_at: string;
		updated_at?: string | null;
		data?: unknown;
		name?: unknown;
		author_id: string | null;
		context: string | null;
		url: string | null;
		img_url: string | null;
		es_id: string | null;
		comment_count: number;
		tagged: boolean | null;
		flagged: boolean | null;
		question_formatted: string | null;
		removed: boolean | null;
	}

	interface Addresses {
		id: number;
		created_at: string;
		updated_at?: string | null;
		address_line_1: string | null;
		address_line_2?: string | null;
		city: string | null;
		state: string | null;
		postal_code: string | null;
		latitude: number | null;
		longitude: number | null;
		name: string | null;
		extra_details: Extradetail[] | unknown;
		country: string | null;
	}

	interface Extradetail {
		types: string[];
		long_name: string;
		short_name: string;
	}

	export let linkDrops: LinkDrops[] | undefined = [];
	// 40.911552736237624, -73.9934208
	let center: [number, number] = [-73.9934208, 40.91155273];
	let zoom = 11.15;
	let mapComponent: any;
	let innerWidth = 0;

	$: linkDrops && updateCenter();

	const updateCenter = () => {
		const address = linkDrops?.[0]?.addresses;
		if (address?.latitude != null && address.longitude != null) {
			center = [address.longitude, address.latitude];
		}
	};

	function placeChanged(e: Event) {
		const { result } = (e as CustomEvent<{ result: GeocoderPlace }>).detail;
		place = result;
		mapComponent.setCenter(result.center, 14);
	}

	function randomLng() {
		return 77 + (Math.random() - 0.5) * 30;
	}

	function randomLat() {
		return 13 + (Math.random() - 0.5) * 30;
	}

	function flyToRandomPlace() {
		mapComponent.flyTo({
			center: [randomLng(), randomLat()],
			essential: true
		});
	}

	function toCenterTuple(value: unknown): [number, number] {
		if (Array.isArray(value) && value.length >= 2) {
			return [Number(value[0]), Number(value[1])];
		}

		const centerValue = value as { lng?: number; lat?: number };
		return [Number(centerValue.lng ?? center[0]), Number(centerValue.lat ?? center[1])];
	}

	function recentre(e: Event) {
		const detail = (e as CustomEvent<{ center: unknown }>).detail;
		center = toCenterTuple(detail.center);
	}

	function drag(_event: Event) {
		// marker = detail.center;
	}
</script>

<svelte:window bind:innerWidth />

<div class="row">
	<div class="content-info">
		<div class="section-txt" id="geocoder">
			<form>
				<Geocoder
					value=""
					accessToken={PUBLIC_MAPBOX_TOKEN}
					on:result={placeChanged}
					on:clear={() => mapComponent.setCenter({ lng: 0, lat: 0 })}
				/>
				<!-- [26.46488727752, 46.425649305]; -->
				{#if place}
					<dl>
						<dt>Name:</dt>
						<dd>{place.label}</dd>
						<dt>Geolocation:</dt>
						<dd>lat: {place.geometry?.lat}, lng: {place.geometry?.lng}</dd>
					</dl>
				{/if}
			</form>
		</div>
		<div class="section-txt" id="map">
			<div class="map-wrap" style="width: {innerWidth}px;">
				<Map
					bind:this={mapComponent}
					accessToken={PUBLIC_MAPBOX_TOKEN}
					on:recentre={recentre}
					on:drag={drag}
					{center}
					bind:zoom
				>
					<NavigationControl />
					<GeolocateControl on:geolocate={(e) => console.log('geolocated', e.detail)} />
					{#if linkDrops?.length}
						{#each linkDrops as point}
							{#if point.addresses?.latitude != null && point.addresses.longitude != null && point.questions}
								<Marker
									popupHtml={`
								<div class="popup">
									<h3>${point.addresses.name ?? ''}</h3>
									<a href="/questions/${point.questions.url ?? ''}"" >${point.questions.question ?? ''}</a>
									<p>Number of hits: ${point.number_of_hits}</p>
									</div>`}
									lat={point.addresses.latitude}
									lng={point.addresses.longitude}
									label={point.addresses.name ?? 'Marker'}
								/>
							{/if}
						{/each}
					{/if}
				</Map>
			</div>
			{#if center}
				<dt>Geolocation:</dt>
				<dd>lat: {center[1]}, lng: {center[0]}</dd>
				<dd>zoom: {zoom}</dd>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.map-wrap {
		width: 500px;
		height: 500px;
		max-width: 1000px;
	}

	.action-buttons {
		display: flex;
		justify-content: space-between;
	}

	#fly-to,
	#change-zoom {
		display: block;
		position: relative;
		margin: 0px auto;
		height: 40px;
		padding: 10px;
		border: none;
		border-radius: 3px;
		font-size: 12px;
		text-align: center;
		color: #fff;
		background: #ee8a65;
	}
</style>
