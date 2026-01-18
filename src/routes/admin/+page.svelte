<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../utils/conversions';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import EnneagramBarChart from '$lib/components/charts/EnneagramBarChart.svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isDemoTime = $state(data.demoTime ?? false);
	let isReindexing = $state(false);

	const changeDemoTime = async () => {
		let body = new FormData();

		await fetch('?/toggleDemo', {
			method: 'POST',
			body
		});

		isDemoTime = !isDemoTime;
	};

	const reindexEverything = async () => {
		isReindexing = true;
		let body = new FormData();

		try {
			const response = await fetch('?/reindexEverything', {
				method: 'POST',
				body
			});

			const result = await response.json();

			if (response.ok && result.data) {
				const parsedData = JSON.parse(result.data);

				if (parsedData.success) {
					notifications.success(
						parsedData.message || `Successfully reindexed ${parsedData.indexed} documents`,
						5000
					);
				} else if (parsedData.failed > 0) {
					const details = parsedData.details;
					let errorMessage = `Reindexing completed with errors: ${parsedData.indexed} succeeded, ${parsedData.failed} failed out of ${parsedData.total} total`;

					if (details) {
						errorMessage += `\n\nQuestions: ${details.questions.indexed}/${details.questions.total} indexed`;
						errorMessage += `\nBlogs: ${details.blogs.indexed}/${details.blogs.total} indexed`;
					}

					notifications.warning(errorMessage, 10000);

					if (details?.questions?.errors?.length > 0) {
						console.error('Failed to reindex questions:', details.questions.errors);
					}
					if (details?.blogs?.errors?.length > 0) {
						console.error('Failed to reindex blogs:', details.blogs.errors);
					}
				} else {
					notifications.success(parsedData.message || 'Reindexing completed', 3000);
				}
			} else {
				const errorData = result.error || {};
				notifications.danger(
					errorData.message || 'Failed to reindex. Check server logs for details.',
					5000
				);
			}
		} catch (err) {
			console.error('Reindexing error:', err);
			notifications.danger(
				'Failed to reindex questions. Please check your Elasticsearch connection.',
				5000
			);
		} finally {
			isReindexing = false;
			getModal('confirmReindex').close();
		}
	};

	// Transform visitor data for chart
	let visitorChartData = $derived(
		data.dailyVisitors
			? data.dailyVisitors
					.map((visitor) => {
						const date = new Date(visitor.days);
						return {
							x: date.getTime(),
							y: visitor.number_of_visitors,
							label: `${date.toLocaleDateString()}: ${visitor.number_of_visitors} visitors`
						};
					})
					.sort((a, b) => a.x - b.x)
			: []
	);

	// Transform comment data for chart
	let commentChartData = $derived(
		data.dailyComments
			? data.dailyComments
					.map((comment) => {
						const date = new Date(comment.days);
						return {
							x: date.getTime(),
							y: comment.number_of_comments,
							label: `${date.toLocaleDateString()}: ${comment.number_of_comments} comments`
						};
					})
					.sort((a, b) => a.x - b.x)
			: []
	);

	// Sparkline data (last 7 days of visitors)
	let visitorSparkline = $derived(visitorChartData.slice(-7).map((d) => d.y));
	let commentSparkline = $derived(commentChartData.slice(-7).map((d) => d.y));

	// Calculate growth percentages
	let userGrowth = $derived(
		data.totalUsers > 0 ? ((data.newUsersMonth / data.totalUsers) * 100).toFixed(1) : '0'
	);

	// Quick action links
	const quickActions = [
		{ href: '/admin/content-board', icon: '📝', label: 'Content', desc: 'Manage blogs' },
		{ href: '/admin/email-dashboard', icon: '📧', label: 'Email', desc: 'Send campaigns' },
		{ href: '/admin/users', icon: '👥', label: 'Users', desc: 'User management' },
		{ href: '/admin/questions', icon: '❓', label: 'Questions', desc: 'Moderate Q&A' },
		{ href: '/admin/consulting', icon: '🎯', label: 'Consulting', desc: 'Clients & sessions' },
		{ href: '/admin/marketing', icon: '📈', label: 'Marketing', desc: 'Campaigns' }
	];
</script>

<div class="admin-dashboard">
	<header class="dashboard-header">
		<div class="header-left">
			<h1 class="page-title">Dashboard</h1>
			<p class="page-subtitle">System overview and analytics</p>
		</div>
		<div class="header-actions">
			<button type="button" class="action-btn" class:active={isDemoTime} onclick={changeDemoTime}>
				<span class="btn-icon">🎭</span>
				Demo: {isDemoTime ? 'ON' : 'OFF'}
			</button>
			<button
				type="button"
				class="action-btn secondary"
				onclick={() => getModal('confirmReindex').open()}
				disabled={isReindexing}
			>
				<span class="btn-icon">🔄</span>
				{isReindexing ? 'Reindexing...' : 'Reindex ES'}
			</button>
		</div>
	</header>

	<!-- Quick Actions Grid -->
	<section class="quick-actions-section">
		<h2 class="section-title">Quick Actions</h2>
		<div class="quick-actions-grid">
			{#each quickActions as action}
				<a href={action.href} class="quick-action-card">
					<span class="action-icon">{action.icon}</span>
					<div class="action-info">
						<span class="action-label">{action.label}</span>
						<span class="action-desc">{action.desc}</span>
					</div>
					<span class="action-arrow">→</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- Key Metrics Grid -->
	<section class="metrics-section">
		<h2 class="section-title">Key Metrics</h2>
		<div class="metrics-grid">
			<StatCard
				icon="👥"
				label="Total Users"
				value={data.totalUsers}
				subValue="+{data.newUsersToday} today"
				color="primary"
			/>
			<StatCard
				icon="📈"
				label="New Users (30d)"
				value={data.newUsersMonth}
				subValue="{userGrowth}% of total"
				trend={Number(userGrowth) > 5 ? 'up' : 'neutral'}
				trendValue="{userGrowth}%"
			/>
			<StatCard icon="🎯" label="Coaching Waitlist" value={data.coachingWaitlist} color="success" />
			<StatCard
				icon="⚡"
				label="Active (7d)"
				value={data.activeUsers}
				subValue="unique commenters"
			/>
			<StatCard
				icon="👀"
				label="Visitors (30d)"
				value={(data.dailyVisitors ?? []).reduce((sum, v) => sum + v.number_of_visitors, 0)}
				sparklineData={visitorSparkline}
			/>
			<StatCard
				icon="❓"
				label="Questions"
				value={data.totalQuestions}
				subValue="+{data.questionsToday} today"
			/>
			<StatCard
				icon="💬"
				label="Comments"
				value={data.totalComments}
				subValue="+{data.commentsToday} today"
				sparklineData={commentSparkline}
				color="success"
			/>
		</div>
	</section>

	<!-- Charts Section -->
	<section class="charts-section">
		<div class="charts-grid">
			<div class="chart-card">
				<LineChart
					data={visitorChartData}
					title="Visitors"
					height={280}
					color="#3b82f6"
					showPoints={true}
					showGrid={true}
					showSummary={true}
					showTrend={true}
				/>
			</div>
			<div class="chart-card">
				<LineChart
					data={commentChartData}
					title="Comments"
					height={280}
					color="#10b981"
					showPoints={true}
					showGrid={true}
					showSummary={true}
					showTrend={true}
				/>
			</div>
		</div>
	</section>

	<!-- Enneagram Distribution -->
	<section class="distribution-section">
		<div class="distribution-card">
			<EnneagramBarChart
				distribution={data.enneagramDistribution}
				title="User Type Distribution"
				showPercentages={true}
				compact={false}
			/>
		</div>
	</section>

	<!-- Data Tables Grid -->
	<section class="tables-section">
		<div class="tables-grid">
			<!-- Coaching Waitlist -->
			<div class="table-card">
				<div class="table-header">
					<h3 class="table-title">
						<span class="title-icon">🎯</span>
						Coaching Waitlist
						<span class="count-badge">{data.coachingWaitlist}</span>
					</h3>
				</div>
				<div class="table-content">
					<table class="data-table">
						<thead>
							<tr>
								<th>Email</th>
								<th>Goal</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{#each data.coachingWaitlistUsers ?? [] as user}
								<tr>
									<td>
										<a href="mailto:{user.email}" class="email-link">{user.email}</a>
									</td>
									<td class="goal-cell">
										{#if user.session_goal}
											<span class="goal-text">{user.session_goal}</span>
										{:else}
											<span class="empty-state">—</span>
										{/if}
									</td>
									<td class="date-cell">{convertDateToReadable(user.created_at ?? '')}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Recent Signups -->
			<div class="table-card">
				<div class="table-header">
					<h3 class="table-title">
						<span class="title-icon">🆕</span>
						Recent Signups
					</h3>
				</div>
				<div class="table-content">
					<table class="data-table">
						<thead>
							<tr>
								<th>Email</th>
								<th>Type</th>
								<th>Joined</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{#each data.recentSignups ?? [] as signup}
								<tr>
									<td class="email-cell">{signup.email || 'Anonymous'}</td>
									<td>
										{#if signup.enneagram}
											<span class="type-badge type-{signup.enneagram}">{signup.enneagram}</span>
										{:else}
											<span class="type-badge pending">?</span>
										{/if}
									</td>
									<td class="date-cell">{convertDateToReadable(signup.created_at ?? '')}</td>
									<td>
										<a href="/users/{signup.external_id}" class="view-link">View</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</section>

	<!-- Daily Questions Stats -->
	<section class="questions-section">
		<div class="table-card full-width">
			<div class="table-header">
				<h3 class="table-title">
					<span class="title-icon">❓</span>
					Daily Question Activity
				</h3>
			</div>
			<div class="table-content">
				<table class="data-table">
					<thead>
						<tr>
							<th>Question</th>
							<th>Created</th>
							<th class="num-col">Today</th>
							<th class="num-col">Total</th>
							<th>Author</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each data.dailyQuestions ?? [] as question}
							<tr>
								<td class="question-cell">
									<span class="question-text">{question.question}</span>
								</td>
								<td class="date-cell">{convertDateToReadable(question.created_at)}</td>
								<td class="num-col">
									{#if question.number_of_comments_today > 0}
										<span class="activity-badge">{question.number_of_comments_today}</span>
									{:else}
										<span class="empty-state">0</span>
									{/if}
								</td>
								<td class="num-col">{question.number_of_comments}</td>
								<td>
									<a href="/users/{question.user_external_id}" class="author-link">
										{question.user_email}
									</a>
								</td>
								<td>
									<a href="/questions/{question.url}" class="view-link">View</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>
</div>

<Modal2 id="confirmReindex">
	<div class="modal-content">
		<div class="modal-icon">🔄</div>
		<h2 class="modal-title">Reindex Elasticsearch</h2>
		<p class="modal-text">
			This will completely rebuild the Elasticsearch indices for all questions and blog posts.
		</p>
		<div class="modal-details">
			<p>This process will:</p>
			<ul>
				<li>Delete the current 'question' and 'blog' indices</li>
				<li>Recreate them with proper mappings</li>
				<li>Re-import all questions and published blog posts</li>
			</ul>
		</div>
		<p class="modal-warning">
			<strong>Warning:</strong> This may take several minutes.
		</p>
		<div class="modal-actions">
			<button
				type="button"
				class="btn btn-secondary"
				onclick={() => getModal('confirmReindex').close()}
				disabled={isReindexing}
			>
				Cancel
			</button>
			<button
				type="button"
				class="btn btn-primary"
				onclick={reindexEverything}
				disabled={isReindexing}
			>
				{isReindexing ? 'Reindexing...' : 'Start Reindexing'}
			</button>
		</div>
	</div>
</Modal2>

<style>
	.admin-dashboard {
		width: 100%;
	}

	/* Section Titles */
	.section-title {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--text-secondary);
		margin: 0 0 12px 0;
		padding: 0;
	}

	/* Header */
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--void-elevated);
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		background: linear-gradient(135deg, var(--shadow-monarch-light), var(--awakening-cyan));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.page-subtitle {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: 10px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		font-size: 0.8125rem;
		font-weight: 500;
		background: var(--void-surface);
		color: var(--text-primary);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-icon {
		font-size: 0.875rem;
	}

	.action-btn:hover:not(:disabled) {
		border-color: var(--shadow-monarch);
		background: var(--shadow-monarch-subtle);
		box-shadow: var(--glow-sm);
	}

	.action-btn.active {
		background: var(--success-light);
		border-color: var(--success);
		color: var(--success-text);
	}

	.action-btn.secondary {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: white;
		border-color: var(--shadow-monarch);
		box-shadow: var(--glow-sm);
	}

	.action-btn.secondary:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--shadow-monarch-light) 0%, var(--shadow-monarch) 100%);
		box-shadow: var(--glow-md);
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Quick Actions Section */
	.quick-actions-section {
		margin-bottom: 24px;
	}

	.quick-actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 12px;
	}

	.quick-action-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s ease;
	}

	.quick-action-card:hover {
		border-color: var(--shadow-monarch);
		background: var(--shadow-monarch-subtle);
		box-shadow: var(--glow-sm);
		transform: translateY(-2px);
	}

	.action-icon {
		font-size: 1.5rem;
		line-height: 1;
	}

	.action-info {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}

	.action-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.action-desc {
		font-size: 0.6875rem;
		color: var(--text-secondary);
	}

	.action-arrow {
		font-size: 1rem;
		color: var(--shadow-monarch-light);
		opacity: 0;
		transform: translateX(-4px);
		transition: all 0.2s ease;
	}

	.quick-action-card:hover .action-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	/* Metrics Section */
	.metrics-section {
		margin-bottom: 24px;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 12px;
	}

	/* Charts Section */
	.charts-section {
		margin-bottom: 24px;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.chart-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.chart-card:hover {
		border-color: var(--shadow-monarch-glow);
		box-shadow: var(--glow-sm);
	}

	/* Distribution Section */
	.distribution-section {
		margin-bottom: 24px;
	}

	.distribution-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	/* Tables Section */
	.tables-section {
		margin-bottom: 24px;
	}

	.tables-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.table-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.table-card:hover {
		border-color: var(--void-highlight);
	}

	.table-card.full-width {
		grid-column: 1 / -1;
	}

	.table-header {
		padding: 14px 18px;
		border-bottom: 1px solid var(--void-elevated);
		background: var(--void-deep);
	}

	.table-title {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.title-icon {
		font-size: 1rem;
	}

	.count-badge {
		padding: 3px 10px;
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: white;
		border-radius: 12px;
		font-size: 0.6875rem;
		font-weight: 600;
		box-shadow: var(--glow-sm);
	}

	.table-content {
		overflow-x: auto;
		max-height: 400px;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}

	.data-table thead {
		position: sticky;
		top: 0;
		background: var(--void-surface);
		z-index: 1;
	}

	.data-table th {
		padding: 12px 14px;
		text-align: left;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--void-elevated);
		white-space: nowrap;
	}

	.data-table td {
		padding: 12px 14px;
		border-bottom: 1px solid var(--void-elevated);
		color: var(--text-primary);
	}

	.data-table tbody tr {
		transition: background 0.15s ease;
	}

	.data-table tbody tr:hover {
		background: var(--void-elevated);
	}

	.data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.num-col {
		text-align: center;
		width: 70px;
	}

	.email-link,
	.author-link {
		color: var(--text-primary);
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.email-link:hover,
	.author-link:hover {
		color: var(--shadow-monarch-light);
		text-shadow: var(--glow-sm);
	}

	.email-cell {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goal-cell {
		max-width: 220px;
	}

	.goal-text {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		color: var(--text-secondary);
		font-size: 0.75rem;
		line-height: 1.4;
	}

	.question-cell {
		max-width: 280px;
	}

	.question-text {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.date-cell {
		white-space: nowrap;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.empty-state {
		color: var(--text-muted);
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.type-badge.pending {
		background: var(--void-elevated);
		color: var(--text-secondary);
	}

	.type-badge.type-1 {
		background: var(--type-1-color);
	}
	.type-badge.type-2 {
		background: var(--type-2-color);
	}
	.type-badge.type-3 {
		background: var(--type-3-color);
	}
	.type-badge.type-4 {
		background: var(--type-4-color);
	}
	.type-badge.type-5 {
		background: var(--type-5-color);
	}
	.type-badge.type-6 {
		background: var(--type-6-color);
	}
	.type-badge.type-7 {
		background: var(--type-7-color);
	}
	.type-badge.type-8 {
		background: var(--type-8-color);
	}
	.type-badge.type-9 {
		background: var(--type-9-color);
	}

	.activity-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 26px;
		padding: 4px 8px;
		background: var(--success-light);
		color: var(--success-text);
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.view-link {
		color: var(--shadow-monarch-light);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.75rem;
		transition: all 0.15s ease;
	}

	.view-link:hover {
		color: var(--awakening-cyan-light);
		text-shadow: var(--glow-cyan);
	}

	/* Questions Section */
	.questions-section {
		margin-bottom: 24px;
	}

	/* Modal Styles */
	.modal-content {
		max-width: 480px;
	}

	.modal-icon {
		font-size: 2.5rem;
		text-align: center;
		margin-bottom: 16px;
	}

	.modal-title {
		margin: 0 0 16px 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
	}

	.modal-text {
		margin: 0 0 16px 0;
		color: var(--text-secondary);
		font-size: 0.875rem;
		text-align: center;
	}

	.modal-details {
		margin: 0 0 16px 0;
		padding: 16px;
		background: var(--void-elevated);
		border-radius: 10px;
		border: 1px solid var(--void-highlight);
	}

	.modal-details p {
		margin: 0 0 10px 0;
		font-weight: 500;
		color: var(--text-primary);
		font-size: 0.875rem;
	}

	.modal-details ul {
		margin: 0;
		padding-left: 20px;
		color: var(--text-secondary);
		font-size: 0.8125rem;
	}

	.modal-details li {
		margin-bottom: 6px;
	}

	.modal-warning {
		margin: 0 0 20px 0;
		padding: 14px;
		background: var(--warning-light);
		border: 1px solid var(--warning);
		border-radius: 10px;
		color: var(--warning);
		font-size: 0.8125rem;
	}

	.modal-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	.btn {
		padding: 12px 20px;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-secondary {
		background: var(--void-surface);
		color: var(--text-primary);
		border: 1px solid var(--void-elevated);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--void-elevated);
		border-color: var(--void-highlight);
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: white;
		border: 1px solid var(--shadow-monarch);
		box-shadow: var(--glow-sm);
	}

	.btn-primary:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--shadow-monarch-light) 0%, var(--shadow-monarch) 100%);
		box-shadow: var(--glow-md);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Tablet */
	@media (max-width: 1024px) {
		.charts-grid,
		.tables-grid {
			grid-template-columns: 1fr;
		}

		.quick-actions-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Mobile */
	@media (max-width: 768px) {
		.dashboard-header {
			flex-direction: column;
			align-items: stretch;
			gap: 16px;
			margin-bottom: 20px;
			padding-bottom: 16px;
		}

		.page-title {
			font-size: 1.25rem;
		}

		.header-actions {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}

		.action-btn {
			justify-content: center;
			padding: 12px 14px;
		}

		.quick-actions-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}

		.quick-action-card {
			padding: 12px;
		}

		.action-icon {
			font-size: 1.25rem;
		}

		.action-label {
			font-size: 0.8125rem;
		}

		.action-arrow {
			display: none;
		}

		.metrics-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 10px;
		}

		.metrics-section,
		.charts-section,
		.distribution-section,
		.tables-section,
		.questions-section,
		.quick-actions-section {
			margin-bottom: 20px;
		}

		.charts-grid,
		.tables-grid {
			gap: 12px;
		}

		.chart-card,
		.distribution-card,
		.table-card {
			border-radius: 10px;
		}

		.table-header {
			padding: 12px 14px;
		}

		.table-title {
			font-size: 0.8125rem;
		}

		.data-table th,
		.data-table td {
			padding: 10px 12px;
		}

		.data-table th {
			font-size: 0.625rem;
		}

		.data-table {
			font-size: 0.75rem;
		}

		.section-title {
			font-size: 0.6875rem;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.metrics-grid {
			grid-template-columns: 1fr 1fr;
			gap: 8px;
		}

		.quick-actions-grid {
			grid-template-columns: 1fr 1fr;
			gap: 8px;
		}

		.quick-action-card {
			padding: 10px;
			gap: 8px;
		}

		.action-icon {
			font-size: 1.125rem;
		}

		.action-desc {
			display: none;
		}

		.header-actions {
			grid-template-columns: 1fr 1fr;
		}

		.action-btn {
			font-size: 0.75rem;
			padding: 10px 12px;
		}

		.btn-icon {
			display: none;
		}

		.data-table th,
		.data-table td {
			padding: 8px 10px;
		}

		.table-content {
			max-height: 320px;
		}
	}
</style>
