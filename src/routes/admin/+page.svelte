<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../utils/conversions';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import EnneagramBarChart from '$lib/components/charts/EnneagramBarChart.svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let isDemoTime: boolean = data.demoTime ?? false;

	const changeDemoTime = async () => {
		let body = new FormData();

		await fetch('?/toggleDemo', {
			method: 'POST',
			body
		});

		isDemoTime = !isDemoTime;
	};

	let isReindexing = false;

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
				const data = JSON.parse(result.data);

				if (data.success) {
					notifications.success(
						data.message || `Successfully reindexed ${data.indexed} documents`,
						5000
					);
				} else if (data.failed > 0) {
					const details = data.details;
					let errorMessage = `Reindexing completed with errors: ${data.indexed} succeeded, ${data.failed} failed out of ${data.total} total`;

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
					notifications.success(data.message || 'Reindexing completed', 3000);
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
	$: visitorChartData = data.dailyVisitors
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
		: [];

	// Transform comment data for chart
	$: commentChartData = data.dailyComments
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
		: [];

	// Sparkline data (last 7 days of visitors)
	$: visitorSparkline = visitorChartData.slice(-7).map((d) => d.y);
	$: commentSparkline = commentChartData.slice(-7).map((d) => d.y);

	// Calculate growth percentages
	$: userGrowth =
		data.totalUsers > 0 ? ((data.newUsersMonth / data.totalUsers) * 100).toFixed(1) : '0';
</script>

<div class="admin-dashboard">
	<header class="dashboard-header">
		<h1 class="page-title">Dashboard</h1>
		<div class="header-actions">
			<button type="button" class="action-btn" class:active={isDemoTime} on:click={changeDemoTime}>
				Demo: {isDemoTime ? 'ON' : 'OFF'}
			</button>
			<button
				type="button"
				class="action-btn secondary"
				on:click={() => getModal('confirmReindex').open()}
				disabled={isReindexing}
			>
				{isReindexing ? 'Reindexing...' : 'Reindex ES'}
			</button>
		</div>
	</header>

	<!-- Key Metrics Grid -->
	<section class="metrics-section">
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
				on:click={() => getModal('confirmReindex').close()}
				disabled={isReindexing}
			>
				Cancel
			</button>
			<button
				type="button"
				class="btn btn-primary"
				on:click={reindexEverything}
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

	/* Header */
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
	}

	.page-title {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--text-primary, #1e293b);
		margin: 0;
	}

	.header-actions {
		display: flex;
		gap: 8px;
	}

	.action-btn {
		padding: 8px 14px;
		font-size: 0.75rem;
		font-weight: 500;
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover:not(:disabled) {
		border-color: var(--primary, #3b82f6);
		color: var(--primary, #3b82f6);
	}

	.action-btn.active {
		background: rgba(16, 185, 129, 0.1);
		border-color: #10b981;
		color: #059669;
	}

	.action-btn.secondary {
		background: var(--primary, #3b82f6);
		color: white;
		border-color: var(--primary, #3b82f6);
	}

	.action-btn.secondary:hover:not(:disabled) {
		background: #2563eb;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Metrics Section */
	.metrics-section {
		margin-bottom: 20px;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 12px;
	}

	/* Charts Section */
	.charts-section {
		margin-bottom: 20px;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.chart-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 10px;
		overflow: hidden;
	}

	/* Distribution Section */
	.distribution-section {
		margin-bottom: 20px;
	}

	.distribution-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 10px;
		overflow: hidden;
	}

	/* Tables Section */
	.tables-section {
		margin-bottom: 20px;
	}

	.tables-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.table-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 10px;
		overflow: hidden;
	}

	.table-card.full-width {
		grid-column: 1 / -1;
	}

	.table-header {
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		background: var(--hover-background, #f8fafc);
	}

	.table-title {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.title-icon {
		font-size: 0.9375rem;
	}

	.count-badge {
		padding: 2px 8px;
		background: var(--primary, #3b82f6);
		color: white;
		border-radius: 10px;
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.table-content {
		overflow-x: auto;
		max-height: 360px;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.75rem;
	}

	.data-table thead {
		position: sticky;
		top: 0;
		background: var(--card-background, #fff);
		z-index: 1;
	}

	.data-table th {
		padding: 10px 12px;
		text-align: left;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		white-space: nowrap;
	}

	.data-table td {
		padding: 10px 12px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		color: var(--text-primary, #1e293b);
	}

	.data-table tbody tr:hover {
		background: var(--hover-background, #f8fafc);
	}

	.data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.num-col {
		text-align: center;
		width: 60px;
	}

	.email-link,
	.author-link {
		color: var(--text-primary, #1e293b);
		text-decoration: none;
	}

	.email-link:hover,
	.author-link:hover {
		color: var(--primary, #3b82f6);
	}

	.email-cell {
		max-width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goal-cell {
		max-width: 200px;
	}

	.goal-text {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		color: var(--text-secondary, #64748b);
		font-size: 0.6875rem;
		line-height: 1.4;
	}

	.question-cell {
		max-width: 240px;
	}

	.question-text {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.date-cell {
		white-space: nowrap;
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
	}

	.empty-state {
		color: var(--text-secondary, #94a3b8);
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 5px;
		font-size: 0.6875rem;
		font-weight: 700;
		color: white;
	}

	.type-badge.pending {
		background: var(--border-color, #cbd5e1);
		color: var(--text-secondary, #64748b);
	}

	.type-badge.type-1 {
		background: #6366f1;
	}
	.type-badge.type-2 {
		background: #ec4899;
	}
	.type-badge.type-3 {
		background: #f59e0b;
	}
	.type-badge.type-4 {
		background: #8b5cf6;
	}
	.type-badge.type-5 {
		background: #3b82f6;
	}
	.type-badge.type-6 {
		background: #14b8a6;
	}
	.type-badge.type-7 {
		background: #f97316;
	}
	.type-badge.type-8 {
		background: #ef4444;
	}
	.type-badge.type-9 {
		background: #22c55e;
	}

	.activity-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 22px;
		padding: 2px 6px;
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
		border-radius: 10px;
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.view-link {
		color: var(--primary, #3b82f6);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.6875rem;
	}

	.view-link:hover {
		text-decoration: underline;
	}

	/* Questions Section */
	.questions-section {
		margin-bottom: 20px;
	}

	/* Modal Styles */
	.modal-content {
		max-width: 480px;
	}

	.modal-title {
		margin: 0 0 16px 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.modal-text {
		margin: 0 0 16px 0;
		color: var(--text-secondary, #64748b);
		font-size: 0.875rem;
	}

	.modal-details {
		margin: 0 0 16px 0;
		padding: 12px;
		background: var(--hover-background, #f8fafc);
		border-radius: 8px;
	}

	.modal-details p {
		margin: 0 0 8px 0;
		font-weight: 500;
		color: var(--text-primary, #1e293b);
		font-size: 0.875rem;
	}

	.modal-details ul {
		margin: 0;
		padding-left: 20px;
		color: var(--text-secondary, #64748b);
		font-size: 0.8125rem;
	}

	.modal-details li {
		margin-bottom: 4px;
	}

	.modal-warning {
		margin: 0 0 16px 0;
		padding: 12px;
		background: rgba(245, 158, 11, 0.1);
		border-radius: 8px;
		color: #d97706;
		font-size: 0.8125rem;
	}

	.modal-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	.btn {
		padding: 10px 18px;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-secondary {
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--hover-background, #f8fafc);
	}

	.btn-primary {
		background: var(--primary, #3b82f6);
		color: white;
		border: none;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
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
	}

	/* Mobile */
	@media (max-width: 768px) {
		.dashboard-header {
			flex-direction: column;
			align-items: stretch;
			gap: 12px;
			margin-bottom: 16px;
			padding-bottom: 12px;
		}

		.page-title {
			font-size: 1.125rem;
		}

		.header-actions {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;
		}

		.action-btn {
			text-align: center;
			padding: 10px 12px;
		}

		.metrics-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;
		}

		.metrics-section,
		.charts-section,
		.distribution-section,
		.tables-section,
		.questions-section {
			margin-bottom: 16px;
		}

		.charts-grid,
		.tables-grid {
			gap: 8px;
		}

		.chart-card,
		.distribution-card,
		.table-card {
			border-radius: 8px;
		}

		.table-header {
			padding: 10px 12px;
		}

		.table-title {
			font-size: 0.75rem;
		}

		.data-table th,
		.data-table td {
			padding: 8px 10px;
		}

		.data-table th {
			font-size: 0.5625rem;
		}

		.data-table {
			font-size: 0.6875rem;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.metrics-grid {
			grid-template-columns: 1fr 1fr;
			gap: 6px;
		}

		.header-actions {
			grid-template-columns: 1fr 1fr;
		}

		.action-btn {
			font-size: 0.6875rem;
			padding: 8px 10px;
		}

		.data-table th,
		.data-table td {
			padding: 6px 8px;
		}

		.table-content {
			max-height: 300px;
		}
	}
</style>
