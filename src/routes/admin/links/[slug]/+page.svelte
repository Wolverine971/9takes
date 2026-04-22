<!-- src/routes/admin/links/[slug]/+page.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { QuestionItem } from '$lib/components/molecules';
	import { notifications } from '$lib/components/molecules/notifications';
	import LinkMap from '$lib/components/molecules/LinkMap.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import QuestionSearch from '$lib/components/molecules/QuestionSearch.svelte'; // Adjust path as needed

	// ADMIN only page
	import type { PageData } from './$types';

	export let data: PageData;

	type SelectedQuestion = {
		id: number;
		url: string;
		question: string;
		comment_count: number;
		question_formatted?: string;
		created_at?: string;
	};

	type SearchOption = {
		text: string;
		value: SelectedQuestion;
	};

	type SearchResult = {
		id: number;
		url: string;
		question: string;
		comment_count: number;
	};

	type SharedLocation = Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;

	let selectedQuestion: SelectedQuestion | null = null;
	let location: SharedLocation | null = null; // Will be set once user explicitly shares location
	let isSearching = false;
	let searchOptions: SearchOption[] = [];
	let isSubmitting = false;

	// Remove the existing onMount geolocation code so it's no longer automatic
	/*
	onMount(() => {
		if (browser) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					location = position?.coords;
				},
				(error) => {
					console.error('Geolocation error:', error);
					notifications.warning(
						'Location access failed. Some features may not work properly.',
						5000
					);
				},
				{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
			);
		}
	});
	*/

	// New function for explicitly requesting location
	function requestLocation() {
		if (browser && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					location = position.coords;
				},
				(error) => {
					console.error('Geolocation error:', error);
					notifications.warning(
						'Location access failed. Some features may not work properly.',
						5000
					);
				},
				{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
			);
		} else {
			notifications.warning('Geolocation is not available in this environment.', 5000);
		}
	}

	async function handleSearch(event: CustomEvent<{ text: string }>) {
		const { text } = event.detail;
		if (!text || text.length < 2) return;

		isSearching = true;
		try {
			const response = await fetch(`/api/questions/typeahead?q=${encodeURIComponent(text)}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Search failed');
			}

			const data = await response.json();
			const elasticOptions = (data.results || []) as SearchResult[];

			searchOptions = elasticOptions.map((o) => ({
				text: o?.question,
				value: {
					question: o?.question,
					url: o?.url,
					id: o?.id,
					comment_count: o?.comment_count
				}
			}));
		} catch (error) {
			console.error('Search error:', error);
			notifications.danger('Failed to search questions', 3000);
			searchOptions = [];
		} finally {
			isSearching = false;
		}
	}

	function handleQuestionSelected(event: CustomEvent<SelectedQuestion>) {
		selectedQuestion = event.detail;
	}

	function getActionFailureMessage(
		result: ReturnType<typeof deserialize>,
		fallbackMessage: string
	): string | null {
		if (result.type === 'error') {
			return result.error.message || fallbackMessage;
		}

		if (result.type === 'failure') {
			const data = result.data as { error?: string; message?: string } | undefined;
			return data?.error ?? data?.message ?? fallbackMessage;
		}

		return null;
	}

	async function saveLinkDrop() {
		if (!selectedQuestion) {
			notifications.warning('Please select a question first', 3000);
			return;
		}

		if (!location) {
			notifications.warning('Location data is not available yet', 3000);
			return;
		}

		isSubmitting = true;
		try {
			const formData = new FormData();
			formData.append('lat', location.latitude.toString());
			formData.append('lng', location.longitude.toString());
			formData.append('selectedQuestionURL', selectedQuestion.url);

			const response = await fetch('?/submitLinkDrop', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			const failureMessage = getActionFailureMessage(result, 'Failed to drop link');

			if (failureMessage) {
				notifications.danger('Error dropping link: ' + failureMessage, 3000);
			} else {
				notifications.success('Link dropped successfully', 3000);
				// Refresh the page to show the new link
				window.location.reload();
			}
		} catch (error) {
			console.error('Save error:', error);
			notifications.danger('An unexpected error occurred', 3000);
		} finally {
			isSubmitting = false;
		}
	}

	async function updateLinkDrop() {
		if (!selectedQuestion) {
			notifications.warning('Please select a question first', 3000);
			return;
		}

		isSubmitting = true;
		try {
			const linkDropExternalId = data.linkDrop?.external_id;
			if (!linkDropExternalId) {
				notifications.warning('Link drop data is unavailable', 3000);
				return;
			}

			const formData = new FormData();
			formData.append('selectedQuestionURL', selectedQuestion.url);
			formData.append('linkDropExternalId', linkDropExternalId);

			const response = await fetch('?/updateLinkDrop', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			const failureMessage = getActionFailureMessage(result, 'Failed to update link');

			if (failureMessage) {
				notifications.danger('Error updating link: ' + failureMessage, 3000);
			} else {
				notifications.success('Link updated successfully', 3000);
				getModal('edit-link').close();
				// Refresh the page to show the updates
				window.location.reload();
			}
		} catch (error) {
			console.error('Update error:', error);
			notifications.danger('An unexpected error occurred', 3000);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="container">
	<header>
		<h1>Link Drop</h1>
		{#if data.linkDrop}
			<h2>Link ID: {data.linkDrop?.external_id}</h2>
		{/if}
	</header>

	<main>
		{#if !data.linkDrop}
			<section class="create-section">
				<h2>Create New Link Drop</h2>

				<!-- LOCATION REQUEST BUTTON -->
				<div class="location-request">
					<button type="button" class="btn btn-secondary" on:click={requestLocation}>
						Share My Location
					</button>
					{#if location}
						<p class="info-message">Location shared: {location.latitude}, {location.longitude}</p>
					{:else}
						<p class="info-message">Location has not been shared yet.</p>
					{/if}
				</div>

				<div class="search-container">
					<QuestionSearch
						placeholder="Search for a question..."
						loading={isSearching}
						options={searchOptions}
						on:search={handleSearch}
						on:selection={handleQuestionSelected}
					/>
				</div>

				{#if selectedQuestion}
					<div class="selected-question">
						<h3>Selected Question:</h3>
						<p>{selectedQuestion.question}</p>
					</div>
				{/if}

				<div class="action-buttons">
					<button
						type="button"
						class="btn btn-primary"
						on:click={saveLinkDrop}
						disabled={!selectedQuestion || !location || isSubmitting}
					>
						{#if isSubmitting}
							Saving...
						{:else}
							Save Link Drop
						{/if}
					</button>
				</div>
			</section>
		{:else}
			<section class="view-section">
				<div class="question-details">
					<h2>Question Details</h2>
					{#if data.question}
						<QuestionItem questionData={data.question} />
					{/if}
				</div>

				<div class="statistics">
					<h2>Link Statistics</h2>
					<div class="stat-grid">
						<div class="stat-item">
							<span class="stat-label">Drops:</span>
							<span class="stat-value">{data.linkDrop?.number_of_drops || 0}</span>
						</div>
						<div class="stat-item">
							<span class="stat-label">Hits:</span>
							<span class="stat-value">{data.linkDrop?.number_of_hits || 0}</span>
						</div>
					</div>
				</div>

				<div class="action-buttons">
					<button
						type="button"
						class="btn btn-primary"
						on:click={() => getModal('edit-link').open()}
					>
						Change Question
					</button>
				</div>

				<div class="map-container">
					<h2>Location</h2>
					<LinkMap linkDrops={[data.linkDrop]} />
				</div>
			</section>
		{/if}
	</main>
</div>

<Modal2 id="edit-link">
	<div class="modal-content">
		<h2>Change Question</h2>

		<div class="search-container">
			<QuestionSearch
				placeholder="Search for a question..."
				loading={isSearching}
				options={searchOptions}
				on:search={handleSearch}
				on:selection={handleQuestionSelected}
			/>
		</div>

		{#if selectedQuestion}
			<div class="selected-question">
				<h3>Selected Question:</h3>
				<p>{selectedQuestion.question}</p>
			</div>
		{/if}

		<div class="modal-actions">
			<button
				type="button"
				class="btn btn-secondary"
				on:click={() => getModal('edit-link').close()}
			>
				Cancel
			</button>
			<button
				type="button"
				class="btn btn-primary"
				on:click={updateLinkDrop}
				disabled={!selectedQuestion || isSubmitting}
			>
				{#if isSubmitting}
					Saving...
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</div>
</Modal2>

<style lang="scss">
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		margin-bottom: 2rem;

		h1 {
			margin-bottom: 0.5rem;
			font-size: 1.75rem;
		}

		h2 {
			font-size: 1.25rem;
			color: var(--neutral-600);
		}
	}

	section {
		margin-bottom: 2rem;

		h2 {
			margin-bottom: 1rem;
			font-size: 1.25rem;
		}
	}

	.location-request {
		margin-bottom: 1.5rem;
	}

	.search-container {
		margin-bottom: 1.5rem;
	}

	.selected-question {
		background: var(--neutral-50);
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid var(--neutral-200);
		margin-bottom: 1.5rem;

		h3 {
			margin-bottom: 0.5rem;
			font-size: 1rem;
			color: var(--neutral-600);
		}

		p {
			margin: 0;
			font-weight: 500;
		}
	}

	.action-buttons {
		margin-bottom: 1.5rem;
	}

	.statistics {
		background: var(--neutral-50);
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid var(--neutral-200);
		margin-bottom: 1.5rem;

		h2 {
			margin-bottom: 1rem;
			font-size: 1.25rem;
		}

		.stat-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1rem;
		}

		.stat-item {
			display: flex;
			flex-direction: column;

			.stat-label {
				font-weight: 500;
				color: var(--neutral-600);
				margin-bottom: 0.25rem;
			}

			.stat-value {
				font-size: 1.5rem;
				font-weight: 600;
			}
		}
	}

	.question-details {
		margin-bottom: 1.5rem;
	}

	.map-container {
		margin-top: 2rem;
	}

	.info-message {
		color: var(--neutral-600);
		font-style: italic;
		margin: 0.5rem 0 0;
	}

	.modal-content {
		padding: 1.5rem;
		min-width: 400px;
		max-width: 600px;

		h2 {
			margin-bottom: 1rem;
			font-size: 1.25rem;
		}
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition:
			background-color 0.2s,
			opacity 0.2s;

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.btn-primary {
		background: var(--primary-700);
		color: white;
		border: none;

		&:hover:not(:disabled) {
			background: var(--primary-800);
		}
	}

	.btn-secondary {
		background: var(--neutral-100);
		color: var(--neutral-800);
		border: 1px solid var(--neutral-300);

		&:hover:not(:disabled) {
			background: var(--neutral-200);
		}
	}

	@media (max-width: 768px) {
		.modal-content {
			min-width: unset;
			max-width: 100%;
			width: 100%;
		}

		.statistics .stat-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
