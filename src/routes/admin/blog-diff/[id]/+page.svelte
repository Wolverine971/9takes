<!-- src/routes/admin/blog-diff/[id]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogDiffViewer from '$lib/components/admin/BlogDiffViewer.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let selectedLeftVersion: string = '';
	let selectedRightVersion: string = '';
	let leftContent: string = '';
	let rightContent: string = '';
	let leftTitle: string = '';
	let rightTitle: string = '';
	let viewMode: 'diff' | 'single' = 'diff';
	let activeTab: 'diff' | 'preview' = 'diff';

	// Get source type for the selected version
	$: selectedRightSource = data.versions?.find(
		(v) => v.id.toString() === selectedRightVersion
	)?.source;

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

	<!-- View Mode Tabs -->
	{#if selectedRightVersion}
		<div class="mb-4">
			<div class="flex border-b border-gray-200">
				<button
					on:click={() => (activeTab = 'diff')}
					class="px-6 py-3 text-sm font-medium transition-colors {activeTab === 'diff'
						? 'border-b-2 border-blue-500 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					{viewMode === 'diff' ? 'Diff View' : 'Source View'}
				</button>
				<button
					on:click={() => (activeTab = 'preview')}
					class="px-6 py-3 text-sm font-medium transition-colors {activeTab === 'preview'
						? 'border-b-2 border-blue-500 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Preview
				</button>
			</div>
		</div>
	{/if}

	<!-- Content Viewer -->
	{#if activeTab === 'diff'}
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
	{:else if activeTab === 'preview' && selectedRightVersion}
		<!-- Preview View - Matches /personality-analysis/[slug] layout -->
		<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
			<div class="border-b bg-purple-50 px-4 py-3">
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<h3 class="font-medium text-purple-900">Preview: {rightTitle}</h3>
						{#if selectedRightSource === 'draft'}
							<span
								class="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800"
							>
								Draft (Markdown)
							</span>
						{:else}
							<span class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
								Published HTML
							</span>
						{/if}
					</div>
					<p class="text-xs text-purple-700">
						This preview shows how the content will appear on the actual page. The PopCard image and
						BlogPurpose component are added automatically by the page template.
					</p>
				</div>
			</div>
			<div class="blog-preview max-h-[80vh] overflow-y-auto bg-white p-6">
				<article class="article-body prose prose-lg mx-auto max-w-4xl">
					<!-- Featured Image PopCard - Added automatically by page template -->
					<div class="featured-image mb-6 flex justify-center">
						<div class="relative">
							<div
								class="absolute -top-2 right-0 z-10 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700"
							>
								Auto-added by template
							</div>
							<PopCard
								image={`/types/${data.blog?.enneagram}s/${data.blog?.person}.webp`}
								showIcon={false}
								enneagramType={data.blog?.enneagram}
								displayText={data.blog?.person?.split('-').join(' ') || ''}
								subtext=""
							/>
						</div>
					</div>

					<!-- Blog Content -->
					{@html rightContent}

					<!-- BlogPurpose placeholder - Added automatically before last H2 -->
					<div
						class="blog-purpose-placeholder my-6 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-center"
					>
						<p class="text-sm text-blue-600">
							<strong>BlogPurpose Component</strong> - Automatically inserted here (before the last H2)
						</p>
					</div>
				</article>
			</div>
		</div>
	{/if}

	<!-- Legend (only shown when comparing versions in diff tab) -->
	{#if activeTab === 'diff' && viewMode === 'diff' && selectedLeftVersion && selectedRightVersion}
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

<style lang="scss">
	/* Blog preview styles to match the actual blog appearance */
	.blog-preview {
		font-family: 'Noticia Text', serif;
		line-height: 1.8;
		color: #2d3436;

		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			font-weight: 700;
			line-height: 1.3;
			margin-top: 2rem;
			margin-bottom: 1rem;
			color: #18191a;
		}

		:global(h1) {
			font-size: 2.25rem;
		}

		:global(h2) {
			font-size: 1.875rem;
		}

		:global(h3) {
			font-size: 1.5rem;
		}

		:global(h4) {
			font-size: 1.25rem;
		}

		:global(p) {
			margin-bottom: 1.25rem;
		}

		:global(a) {
			color: #6c5ce7;
			text-decoration: underline;

			&:hover {
				color: #4834d4;
			}
		}

		:global(ul),
		:global(ol) {
			margin-bottom: 1.25rem;
			padding-left: 1.5rem;
		}

		:global(li) {
			margin-bottom: 0.5rem;
		}

		:global(blockquote) {
			border-left: 4px solid #6c5ce7;
			padding-left: 1rem;
			margin: 1.5rem 0;
			font-style: italic;
			color: #636e72;
			background-color: #f7f7ff;
			padding: 1rem;
			border-radius: 0 0.5rem 0.5rem 0;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
			border-radius: 0.5rem;
			margin: 1.5rem 0;
		}

		:global(pre),
		:global(code) {
			font-family: var(--font-mono);
			background-color: #f0f2f5;
			border-radius: 0.25rem;
		}

		:global(code) {
			padding: 0.125rem 0.375rem;
			font-size: 0.875em;
		}

		:global(pre) {
			padding: 1rem;
			overflow-x: auto;
			margin: 1.5rem 0;

			:global(code) {
				padding: 0;
				background: none;
			}
		}

		:global(hr) {
			border: none;
			border-top: 1px solid #e3e1f0;
			margin: 2rem 0;
		}

		:global(table) {
			width: 100%;
			border-collapse: collapse;
			margin: 1.5rem 0;

			:global(th),
			:global(td) {
				border: 1px solid #e3e1f0;
				padding: 0.75rem;
				text-align: left;
			}

			:global(th) {
				background-color: #f7f7ff;
				font-weight: 600;
			}

			:global(tr:nth-child(even)) {
				background-color: #fafafa;
			}
		}

		:global(strong) {
			font-weight: 700;
		}

		:global(em) {
			font-style: italic;
		}

		/* Handle any embedded components/cards that might be in the HTML */
		:global(.pop-card),
		:global([class*='card']) {
			margin: 1.5rem 0;
		}
	}

	/* Featured image container */
	.featured-image {
		position: relative;

		:global(.pop-card) {
			margin: 0;
		}
	}

	/* Blog purpose placeholder styling */
	.blog-purpose-placeholder {
		background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
	}
</style>
