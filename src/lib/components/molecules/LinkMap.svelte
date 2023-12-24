<script lang="ts">
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { Map, Geocoder, Marker, controls } from '$lib/components/map/components';

	const { GeolocateControl, NavigationControl } = controls;
	const place = null;
	// export let points: any[] = [];

	interface LinkDrops {
		id: number;
		created_at: string;
		question_id: number;
		address_id: number;
		number_of_drops: number;
		number_of_hits: number;
		external_id: string;
		addresses: Addresses;
		questions: Questions;
	}

	interface Questions {
		id: number;
		question: string;
		created_at: string;
		updated_at: string;
		data?: any;
		name?: any;
		author_id: string;
		context: string;
		url: string;
		img_url: string;
		es_id: string;
		comment_count: number;
		tagged: boolean;
		flagged: boolean;
		question_formatted: string;
		removed: boolean;
	}

	interface Addresses {
		id: number;
		created_at: string;
		updated_at?: any;
		address_line_1: string;
		address_line_2?: any;
		city: string;
		state: string;
		postal_code: string;
		latitude: number;
		longitude: number;
		name: string;
		extra_details: Extradetail[];
		country: string;
	}

	interface Extradetail {
		types: string[];
		long_name: string;
		short_name: string;
	}

	export let linkDrops: LinkDrops[] = [];
	// 40.911552736237624, -73.9934208
	let center = { lat: 40.91155273, lng: -73.9934208 };
	let zoom = 11.15;
	let mapComponent;
	let innerWidth = 0;

	$: linkDrops && updateCenter();

	const updateCenter = () => {
		if (linkDrops?.length) {
			center = {
				lat: linkDrops[0].addresses.latitude,
				lng: linkDrops[0].addresses.longitude
			};
		}
	};

	function placeChanged(e) {
		const { result } = e.detail;
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

	function recentre({ detail }) {
		center = detail.center;
	}

	function drag({ detail }) {
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
						<dd>lat: {place.geometry.lat}, lng: {place.geometry.lng}</dd>
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
							<Marker
								popupHtml={`
								<div class="popup">
									<h3>${point.addresses.name}</h3>
									<a href="/questions/${point.questions.url}"" >${point.questions.question}</a>
									<p>Number of hits: ${point.number_of_hits}</p>
									</div>`}
								lat={point.addresses.latitude}
								lng={point.addresses.longitude}
								label={point.addresses.name}
							/>
						{/each}
					{/if}
				</Map>
			</div>
			{#if center}
				<dt>Geolocation:</dt>
				<dd>lat: {center.lat}, lng: {center.lng}</dd>
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
