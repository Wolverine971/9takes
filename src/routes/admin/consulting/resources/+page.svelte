<!-- src/routes/admin/consulting/resources/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const categoryInfo: Record<string, { label: string; description: string; icon: string }> = {
		playbook: {
			label: 'Playbooks',
			description: 'Step-by-step guides for coaching scenarios',
			icon: '📋'
		},
		framework: {
			label: 'Frameworks',
			description: 'Mental models and theoretical foundations',
			icon: '🧠'
		},
		script: {
			label: 'Scripts',
			description: 'Word-for-word conversation templates',
			icon: '💬'
		},
		reference: {
			label: 'Reference',
			description: 'Quick-lookup information and type guides',
			icon: '📚'
		},
		exercise: {
			label: 'Exercises',
			description: 'Client activities and worksheets',
			icon: '✏️'
		}
	};

	// Filter out empty categories
	$: activeCategories = Object.entries(data.groupedResources).filter(
		([_, resources]) => resources.length > 0
	);
</script>

<div class="resources-page">
	<div class="page-header">
		<h1>Coaching Resources</h1>
		<p class="subtitle">Playbooks, frameworks, and reference materials for your practice</p>
	</div>

	<!-- Quick Access (Pinned) -->
	{#if data.resources.some((r) => r.is_pinned)}
		<section class="section-card pinned-section">
			<h2>Quick Access</h2>
			<div class="pinned-grid">
				{#each data.resources.filter((r) => r.is_pinned) as resource}
					<a href="/admin/consulting/resources/{resource.slug}" class="pinned-card">
						<span class="pinned-icon">{categoryInfo[resource.category]?.icon || '📄'}</span>
						<div class="pinned-content">
							<h3>{resource.title}</h3>
							<p>{resource.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Categories -->
	{#each activeCategories as [category, resources]}
		<section class="section-card">
			<div class="category-header">
				<div class="category-icon">{categoryInfo[category]?.icon || '📄'}</div>
				<div class="category-info">
					<h2>{categoryInfo[category]?.label || category}</h2>
					<p>{categoryInfo[category]?.description || ''}</p>
				</div>
			</div>

			<div class="resource-list">
				{#each resources as resource}
					<a href="/admin/consulting/resources/{resource.slug}" class="resource-item">
						<div class="resource-main">
							<h3>{resource.title}</h3>
							{#if resource.description}
								<p>{resource.description}</p>
							{/if}
						</div>
						<span class="resource-arrow">→</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}

	{#if data.resources.length === 0}
		<div class="empty-state">
			<p>No resources found. Resources will appear here after running the database migration.</p>
		</div>
	{/if}

	<!-- External Resources -->
	<section class="section-card">
		<h2>Blog Resources</h2>
		<p class="section-desc">Your published content that supports coaching conversations</p>
		<div class="blog-links">
			<a href="/enneagram-corner/personality-maxing" target="_blank" class="blog-link">
				<span class="link-title">Personality Maxing</span>
				<span class="link-desc">Core philosophy and approach</span>
			</a>
			<a
				href="/enneagram-corner/90-day-personality-maxing-blueprint"
				target="_blank"
				class="blog-link"
			>
				<span class="link-title">90-Day Blueprint</span>
				<span class="link-desc">The full transformation program</span>
			</a>
			<a
				href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
				target="_blank"
				class="blog-link"
			>
				<span class="link-title">Enneagram Typing Guide</span>
				<span class="link-desc">How to determine type</span>
			</a>
			<a
				href="/guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten"
				target="_blank"
				class="blog-link"
			>
				<span class="link-title">Emotions Crash Course</span>
				<span class="link-desc">Emotional vocabulary foundation</span>
			</a>
			<a href="/guides/ultimate-guide-to-active-listening" target="_blank" class="blog-link">
				<span class="link-title">Active Listening Guide</span>
				<span class="link-desc">Deep listening techniques</span>
			</a>
		</div>
	</section>
</div>

<style>
	.resources-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.5rem;
		margin: 0 0 0.25rem;
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0;
		font-size: 0.875rem;
	}

	/* Section Cards */
	.section-card {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1.25rem;
		margin-bottom: 1rem;
	}

	.section-card h2 {
		font-size: 1rem;
		margin: 0 0 0.25rem;
	}

	.section-desc {
		color: var(--text-secondary);
		font-size: 0.8rem;
		margin: 0 0 1rem;
	}

	/* Pinned Section */
	.pinned-section {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
		border-color: rgba(99, 102, 241, 0.2);
	}

	.pinned-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.pinned-card {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		text-decoration: none;
		transition: all 0.2s;
	}

	.pinned-card:hover {
		border-color: var(--primary);
		box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
	}

	.pinned-icon {
		font-size: 1.5rem;
	}

	.pinned-content h3 {
		font-size: 0.9rem;
		margin: 0 0 0.25rem;
		color: var(--text-primary);
	}

	.pinned-content p {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Category Header */
	.category-header {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.category-icon {
		font-size: 1.5rem;
	}

	.category-info h2 {
		margin: 0;
	}

	.category-info p {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Resource List */
	.resource-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.resource-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: var(--hover-background);
		border-radius: 6px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.resource-item:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.resource-main h3 {
		font-size: 0.9rem;
		margin: 0 0 0.125rem;
		color: var(--text-primary);
	}

	.resource-main p {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.resource-arrow {
		color: var(--primary);
		font-size: 1rem;
	}

	/* Blog Links */
	.blog-links {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.blog-link {
		display: block;
		padding: 0.75rem;
		background: var(--hover-background);
		border-radius: 6px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.blog-link:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.link-title {
		display: block;
		font-weight: 500;
		font-size: 0.85rem;
		color: var(--primary);
		margin-bottom: 0.125rem;
	}

	.link-desc {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 2rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		color: var(--text-secondary);
	}

	@media (max-width: 640px) {
		.pinned-grid {
			grid-template-columns: 1fr;
		}

		.blog-links {
			grid-template-columns: 1fr;
		}
	}
</style>
