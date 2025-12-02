<!-- src/routes/admin/blog-diff/[id]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogDiffViewer from '$lib/components/admin/BlogDiffViewer.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let selectedLeftVersion: string = '';
	let selectedRightVersion: string = '';
	let leftContent: string = '';
	let rightContent: string = '';
	let leftTitle: string = '';
	let rightTitle: string = '';
	let viewMode: 'diff' | 'single' = 'diff';

	// Initialize with latest two versions if available, or single view mode
	$: if (
		data.versions &&
		data.versions.length > 0 &&
		!selectedLeftVersion &&
		!selectedRightVersion
	) {
		if (data.versions.length >= 2) {
			selectedLeftVersion = data.versions[1].id.toString();
			selectedRightVersion = data.versions[0].id.toString();
			viewMode = 'diff';
		} else {
			// Only one version - show single view mode
			selectedRightVersion = data.versions[0].id.toString();
			viewMode = 'single';
		}
		updateDiffContent();
	}

	function updateDiffContent() {
		const leftVersion = data.versions.find((v) => v.id.toString() === selectedLeftVersion);
		const rightVersion = data.versions.find((v) => v.id.toString() === selectedRightVersion);

		leftContent = leftVersion?.content || '';
		rightContent = rightVersion?.content || '';

		leftTitle = leftVersion
			? `Version ${leftVersion.version_number} (${new Date(leftVersion.changed_at).toLocaleDateString()}) - ${getVersionLabel(leftVersion)}`
			: 'Select Version';
		rightTitle = rightVersion
			? `Version ${rightVersion.version_number} (${new Date(rightVersion.changed_at).toLocaleDateString()}) - ${getVersionLabel(rightVersion)}${rightVersion.is_current ? ' (Current)' : ''}`
			: 'Select Version';
	}

	$: {
		(selectedLeftVersion, selectedRightVersion);
		updateDiffContent();
		// Update view mode based on selection
		if (selectedLeftVersion && selectedRightVersion) {
			viewMode = 'diff';
		} else if (selectedRightVersion && !selectedLeftVersion) {
			viewMode = 'single';
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}

	function getVersionLabel(version: any): string {
		switch (version.source) {
			case 'draft':
				return 'Draft File';
			case 'database':
				return 'Published';
			case 'history':
				return 'Historical';
			default:
				return 'Unknown';
		}
	}

	function goBack() {
		goto('/admin/content-board');
	}
</script>

<svelte:head>
	<title>Blog Version Diff - {data.blog?.title || 'Unknown Blog'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-6">
	<!-- Header -->
	<div class="mb-6">
		<button
			on:click={goBack}
			class="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
		>
			← Back to Content Board
		</button>

		<h1 class="mb-2 text-3xl font-bold text-gray-900">Blog Version History</h1>

		{#if data.blog}
			<div class="text-gray-600">
				<p class="text-lg font-medium">{data.blog.title}</p>
				<p class="text-sm">Person: {data.blog.person}</p>
			</div>
		{/if}
	</div>

	<!-- Version Selectors -->
	<div class="mb-6 rounded-lg border bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-medium">Compare Versions</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Left Version Selector -->
			<div>
				<label for="leftVersion" class="mb-2 block text-sm font-medium text-gray-700">
					Left Side (Older Version)
				</label>
				<select
					id="leftVersion"
					bind:value={selectedLeftVersion}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select version...</option>
					{#each data.versions as version}
						<option value={version.id}>
							Version {version.version_number} - {formatDate(version.changed_at)} - {getVersionLabel(
								version
							)}
							{version.is_current ? ' (Current)' : ''}
						</option>
					{/each}
				</select>
			</div>

			<!-- Right Version Selector -->
			<div>
				<label for="rightVersion" class="mb-2 block text-sm font-medium text-gray-700">
					Right Side (Newer Version)
				</label>
				<select
					id="rightVersion"
					bind:value={selectedRightVersion}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select version...</option>
					{#each data.versions as version}
						<option value={version.id}>
							Version {version.version_number} - {formatDate(version.changed_at)} - {getVersionLabel(
								version
							)}
							{version.is_current ? ' (Current)' : ''}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Version Summary -->
	{#if data.versions && data.versions.length > 0}
		<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
			<h3 class="mb-2 font-medium text-blue-900">Version History Summary</h3>
			<p class="text-sm text-blue-800">
				{#if data.versions.length === 1}
					This is the first version of this blog. No previous versions to compare.
				{:else}
					Total versions: {data.versions.length} | Latest update: {formatDate(
						data.versions[0].changed_at
					)}
				{/if}
				{#if data.hasDraft}
					<span class="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
						Draft Available
					</span>
				{/if}
			</p>
		</div>
	{/if}

	<!-- Content Viewer -->
	{#if viewMode === 'single' && selectedRightVersion}
		<!-- Single Version View -->
		<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
			<div class="border-b bg-blue-50 px-4 py-3">
				<div class="flex items-center justify-between">
					<h3 class="font-medium text-blue-900">{rightTitle}</h3>
					<span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
						First Version - No Previous History
					</span>
				</div>
			</div>
			<div class="max-h-[70vh] overflow-y-auto bg-white p-4">
				<pre class="whitespace-pre-wrap font-mono text-sm text-gray-700">{rightContent}</pre>
			</div>
		</div>
	{:else if selectedLeftVersion && selectedRightVersion}
		<!-- Diff View -->
		<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
			<BlogDiffViewer {leftContent} {rightContent} {leftTitle} {rightTitle} />
		</div>
	{:else if selectedRightVersion && !selectedLeftVersion}
		<!-- Single version selected from dropdown -->
		<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
			<div class="border-b bg-gray-100 px-4 py-3">
				<h3 class="font-medium text-gray-800">{rightTitle}</h3>
				<p class="mt-1 text-sm text-gray-600">
					Select a version on the left to compare, or view this version's content below.
				</p>
			</div>
			<div class="max-h-[70vh] overflow-y-auto bg-white p-4">
				<pre class="whitespace-pre-wrap font-mono text-sm text-gray-700">{rightContent}</pre>
			</div>
		</div>
	{:else}
		<div class="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
			<div class="text-gray-500">
				<svg
					class="mx-auto mb-4 h-12 w-12 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Select Versions to Compare</h3>
				<p class="text-gray-500">
					Choose at least one version from the dropdowns above to see the differences.
				</p>
			</div>
		</div>
	{/if}

	<!-- Legend (only shown when comparing versions) -->
	{#if viewMode === 'diff' && selectedLeftVersion && selectedRightVersion}
		<div class="mt-6 rounded-lg border bg-white p-4 shadow-sm">
			<h3 class="mb-3 font-medium text-gray-900">Legend</h3>
			<div class="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
				<div class="flex items-center gap-2">
					<div class="h-4 w-4 border-l-4 border-green-500 bg-green-100"></div>
					<span class="text-green-800">Added</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="h-4 w-4 border-l-4 border-red-500 bg-red-100"></div>
					<span class="text-red-800">Removed</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="h-4 w-4 border-l-4 border-yellow-500 bg-yellow-100"></div>
					<span class="text-yellow-800">Modified</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="h-4 w-4 border-l-4 border-gray-200 bg-gray-100"></div>
					<span class="text-gray-700">Unchanged</span>
				</div>
			</div>
		</div>
	{/if}
</div>
