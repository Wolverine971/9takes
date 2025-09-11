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

	// Initialize with latest two versions if available
	$: if (data.versions && data.versions.length > 0 && !selectedLeftVersion && !selectedRightVersion) {
		if (data.versions.length >= 2) {
			selectedLeftVersion = data.versions[1].id.toString();
			selectedRightVersion = data.versions[0].id.toString();
		} else {
			selectedRightVersion = data.versions[0].id.toString();
		}
		updateDiffContent();
	}

	function updateDiffContent() {
		const leftVersion = data.versions.find(v => v.id.toString() === selectedLeftVersion);
		const rightVersion = data.versions.find(v => v.id.toString() === selectedRightVersion);

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
		selectedLeftVersion, selectedRightVersion;
		updateDiffContent();
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
			class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
		>
			← Back to Content Board
		</button>
		
		<h1 class="text-3xl font-bold text-gray-900 mb-2">
			Blog Version History
		</h1>
		
		{#if data.blog}
			<div class="text-gray-600">
				<p class="text-lg font-medium">{data.blog.title}</p>
				<p class="text-sm">Person: {data.blog.person}</p>
			</div>
		{/if}
	</div>

	<!-- Version Selectors -->
	<div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
		<h2 class="text-lg font-medium mb-4">Compare Versions</h2>
		
		<div class="grid md:grid-cols-2 gap-6">
			<!-- Left Version Selector -->
			<div>
				<label for="leftVersion" class="block text-sm font-medium text-gray-700 mb-2">
					Left Side (Older Version)
				</label>
				<select 
					id="leftVersion"
					bind:value={selectedLeftVersion}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select version...</option>
					{#each data.versions as version}
						<option value={version.id}>
							Version {version.version_number} - {formatDate(version.changed_at)} - {getVersionLabel(version)}
							{version.is_current ? ' (Current)' : ''}
						</option>
					{/each}
				</select>
			</div>

			<!-- Right Version Selector -->
			<div>
				<label for="rightVersion" class="block text-sm font-medium text-gray-700 mb-2">
					Right Side (Newer Version)
				</label>
				<select 
					id="rightVersion"
					bind:value={selectedRightVersion}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select version...</option>
					{#each data.versions as version}
						<option value={version.id}>
							Version {version.version_number} - {formatDate(version.changed_at)} - {getVersionLabel(version)}
							{version.is_current ? ' (Current)' : ''}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Version Summary -->
	{#if data.versions && data.versions.length > 0}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<h3 class="font-medium text-blue-900 mb-2">Version History Summary</h3>
			<p class="text-blue-800 text-sm">
				Total versions: {data.versions.length} | 
				Latest update: {formatDate(data.versions[0].changed_at)}
				{#if data.hasDraft}
					<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
						Draft Available
					</span>
				{/if}
			</p>
		</div>
	{/if}

	<!-- Diff Viewer -->
	{#if selectedLeftVersion || selectedRightVersion}
		<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
			<BlogDiffViewer 
				{leftContent}
				{rightContent}
				{leftTitle}
				{rightTitle}
			/>
		</div>
	{:else}
		<div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
			<div class="text-gray-500">
				<svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Select Versions to Compare</h3>
				<p class="text-gray-500">Choose at least one version from the dropdowns above to see the differences.</p>
			</div>
		</div>
	{/if}

	<!-- Legend -->
	<div class="mt-6 bg-white rounded-lg shadow-sm border p-4">
		<h3 class="font-medium text-gray-900 mb-3">Legend</h3>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 bg-green-100 border-l-4 border-green-500"></div>
				<span class="text-green-800">Added</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 bg-red-100 border-l-4 border-red-500"></div>
				<span class="text-red-800">Removed</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500"></div>
				<span class="text-yellow-800">Modified</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-4 h-4 bg-gray-100 border-l-4 border-gray-200"></div>
				<span class="text-gray-700">Unchanged</span>
			</div>
		</div>
	</div>
</div>