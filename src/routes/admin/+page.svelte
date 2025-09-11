<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../utils/conversions';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let isDemoTime: boolean = data.demoTime;

	const changeDemoTime = async () => {
		let body = new FormData();

		await fetch('?/toggleDemo', {
			method: 'POST',
			body
		});

		isDemoTime = !isDemoTime;
	};

	const reindexEverything = async () => {
		let body = new FormData();

		await fetch('?/reindexEverything', {
			method: 'POST',
			body
		});
		notifications.info('Reindexed Questions', 3000);
		getModal('confirmReindex').close();
	};

	// Transform visitor data for chart
	$: visitorChartData = data.dailyVisitors
		? data.dailyVisitors
				.map((visitor) => {
					// Parse the date string directly
					const date = new Date(visitor.days);
					return {
						x: date.getTime(), // Use timestamp for x value
						y: visitor.number_of_visitors,
						label: `${date.toLocaleDateString()}: ${visitor.number_of_visitors} visitors`
					};
				})
				.sort((a, b) => a.x - b.x)
		: []; // Sort by date ascending

	// Transform comment data for chart
	$: commentChartData = data.dailyComments
		? data.dailyComments
				.map((comment) => {
					// Parse the date string directly
					const date = new Date(comment.days);
					return {
						x: date.getTime(), // Use timestamp for x value
						y: comment.number_of_comments,
						label: `${date.toLocaleDateString()}: ${comment.number_of_comments} comments`
					};
				})
				.sort((a, b) => a.x - b.x)
		: []; // Sort by date ascending
</script>

<div class="admin-dashboard">
	<div class="page-header">
		<h1>Admin Dashboard</h1>
		<p class="subtitle">System overview and controls</p>
	</div>

	<!-- Stats Grid -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">👥</div>
			<div class="stat-content">
				<h3>Total Users</h3>
				<p class="stat-value">{data.totalUsers.toLocaleString()}</p>
				<p class="stat-change">+{data.newUsersToday} today</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">📈</div>
			<div class="stat-content">
				<h3>New Users (30d)</h3>
				<p class="stat-value">{data.newUsersMonth.toLocaleString()}</p>
				<p class="stat-change">
					{((data.newUsersMonth / data.totalUsers) * 100).toFixed(1)}% of total
				</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🎯</div>
			<div class="stat-content">
				<h3>Coaching Waitlist</h3>
				<p class="stat-value">{data.coachingWaitlist.toLocaleString()}</p>
				<p class="stat-change">signups</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🔥</div>
			<div class="stat-content">
				<h3>Active Users (7d)</h3>
				<p class="stat-value">{data.activeUsers.toLocaleString()}</p>
				<p class="stat-change">commented recently</p>
			</div>
		</div>
	</div>

	<!-- Secondary Stats Grid -->
	<div class="stats-grid secondary-stats">
		<div class="stat-card">
			<div class="stat-icon">👁️</div>
			<div class="stat-content">
				<h3>Visitors (30d)</h3>
				<p class="stat-value">
					{data.dailyVisitors.reduce((sum, v) => sum + v.number_of_visitors, 0).toLocaleString()}
				</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">❓</div>
			<div class="stat-content">
				<h3>Total Questions</h3>
				<p class="stat-value">{data.totalQuestions.toLocaleString()}</p>
				<p class="stat-change">+{data.questionsToday} today</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">💬</div>
			<div class="stat-content">
				<h3>Total Comments</h3>
				<p class="stat-value">{data.totalComments.toLocaleString()}</p>
				<p class="stat-change">+{data.commentsToday} today</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🎮</div>
			<div class="stat-content">
				<h3>Demo Mode</h3>
				<p class="stat-value">{isDemoTime ? 'ON' : 'OFF'}</p>
			</div>
		</div>
	</div>
	<!-- Enneagram Distribution -->
	<div class="enneagram-section">
		<h2 class="section-title">📊 User Enneagram Type Distribution</h2>
		<div class="enneagram-grid">
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
				<div class="enneagram-card">
					<div class="enneagram-type">Type {type}</div>
					<div class="enneagram-count">{data.enneagramDistribution[type] || 0}</div>
					<div class="enneagram-bar">
						<div
							class="enneagram-bar-fill"
							style="width: {(
								((data.enneagramDistribution[type] || 0) / data.totalUsers) *
								100
							).toFixed(1)}%"
						></div>
					</div>
					<div class="enneagram-percent">
						{(((data.enneagramDistribution[type] || 0) / data.totalUsers) * 100).toFixed(1)}%
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Recent Signups -->
	<div class="section-card">
		<details>
			<summary class="section-header">
				<span class="section-title">🆕 Recent Signups</span>
				<span class="chevron">▼</span>
			</summary>
			<div class="table-wrapper">
				<table class="data-table">
					<thead>
						<tr>
							<th>Email</th>
							<th>Type</th>
							<th>Joined</th>
							<th>Profile</th>
						</tr>
					</thead>
					<tbody>
						{#each data.recentSignups as signup}
							<tr>
								<td>{signup.email || 'Anonymous'}</td>
								<td>
									{#if signup.enneagram}
										<span class="type-badge">Type {signup.enneagram}</span>
									{:else}
										<span class="type-badge pending">Pending</span>
									{/if}
								</td>
								<td>{convertDateToReadable(signup.created_at)}</td>
								<td>
									<a href="/users/{signup.external_id}" class="table-link">View</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</details>
	</div>

	<!-- Data Visualization Section -->
	<div class="data-section">
		<div class="section-card">
			<details open>
				<summary class="section-header">
					<span class="section-title">📊 Visitor Analytics</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="chart-wrapper">
					<LineChart
						data={visitorChartData}
						title="Daily Visitors (Last 30 Days)"
						xLabel="Date"
						yLabel="Number of Visitors"
						height={350}
						color="#3b82f6"
						showPoints={true}
						showGrid={true}
					/>
				</div>
			</details>
		</div>

		<div class="section-card">
			<details>
				<summary class="section-header">
					<span class="section-title">💬 Comment Analytics</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="chart-wrapper">
					<LineChart
						data={commentChartData}
						title="Daily Comments (Last 30 Days)"
						xLabel="Date"
						yLabel="Number of Comments"
						height={350}
						color="#10b981"
						showPoints={true}
						showGrid={true}
					/>
				</div>
			</details>
		</div>

		<div class="section-card">
			<details>
				<summary class="section-header">
					<span class="section-title">❓ Daily Question Stats</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="table-wrapper">
					<table class="data-table">
						<thead>
							<tr>
								<th>Question</th>
								<th>Created</th>
								<th>Today</th>
								<th>Total</th>
								<th>Modified</th>
								<th>User</th>
								<th>Link</th>
							</tr>
						</thead>
						<tbody>
							{#each data.dailyQuestions as question}
								<tr>
									<td class="question-cell">{question.question}</td>
									<td>{convertDateToReadable(question.created_at)}</td>
									<td>{question.number_of_comments_today}</td>
									<td>{question.number_of_comments}</td>
									<td>{question.number_modified}</td>
									<td>
										<a href="/users/{question.user_external_id}" class="table-link">
											{question.user_email}
										</a>
									</td>
									<td>
										<a href="/questions/{question.url}" class="table-link"> View </a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</details>
		</div>
	</div>

	<!-- Actions Section -->
	<div class="actions-section">
		<div class="action-card">
			<h3>Demo Mode Control</h3>
			<p>
				Current Status: <span class="status-badge" class:active={isDemoTime}
					>{isDemoTime ? 'ON' : 'OFF'}</span
				>
			</p>
			<button type="button" class="btn btn-primary" on:click={changeDemoTime}>
				Toggle Demo Mode
			</button>
		</div>

		<div class="action-card">
			<h3>Search Index</h3>
			<p>Rebuild the Elasticsearch index for questions</p>
			<button
				type="button"
				class="btn btn-secondary"
				on:click={() => getModal('confirmReindex').open()}
			>
				Reindex Elastic Search
			</button>
		</div>
	</div>
</div>

<Modal2 id="confirmReindex">
	<h1>Reindex elastic</h1>
	Are you sure?
	<button type="button" class="btn btn-primary" on:click={reindexEverything}>yes</button>
</Modal2>

<style>
	.admin-dashboard {
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
		color: theme('colors.neutral.800');
	}

	.subtitle {
		color: theme('colors.neutral.600');
		margin: 0;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		background-color: white;
		border: 1px solid theme('colors.neutral.200');
		border-radius: theme('borderRadius.lg');
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: theme('boxShadow.md');
	}

	.stat-icon {
		font-size: 2.5rem;
		opacity: 0.8;
	}

	.stat-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		color: theme('colors.neutral.600');
		font-weight: 500;
	}

	.stat-value {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 600;
		color: theme('colors.primary.700');
	}

	.stat-change {
		margin: 0.25rem 0 0 0;
		font-size: 0.75rem;
		color: theme('colors.neutral.600');
	}

	.secondary-stats {
		margin-bottom: 2rem;
	}

	/* Enneagram Section */
	.enneagram-section {
		margin-bottom: 2rem;
	}

	.enneagram-section .section-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	.enneagram-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		background-color: var(--card-background);
		padding: 1.5rem;
		border-radius: var(--border-radius);
		border: 1px solid var(--border-color);
	}

	.enneagram-card {
		text-align: center;
		padding: 0.75rem;
		background-color: var(--hover-background);
		border-radius: var(--border-radius);
		transition: transform 0.2s ease;
	}

	.enneagram-card:hover {
		transform: translateY(-2px);
	}

	.enneagram-type {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}

	.enneagram-count {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--primary);
		margin-bottom: 0.5rem;
	}

	.enneagram-bar {
		height: 4px;
		background-color: var(--border-color);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 0.25rem;
	}

	.enneagram-bar-fill {
		height: 100%;
		background-color: var(--primary);
		transition: width 0.3s ease;
	}

	.enneagram-percent {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.type-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		background-color: var(--primary-light);
		color: var(--primary);
	}

	.type-badge.pending {
		background-color: var(--warning-light);
		color: var(--warning);
	}

	/* Data Section */
	.data-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	details {
		cursor: pointer;
	}

	.section-header {
		padding: 1.25rem;
		background-color: var(--hover-background);
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: background-color 0.2s ease;
		list-style: none;
	}

	.section-header:hover {
		background-color: var(--primary-light);
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.chevron {
		transition: transform 0.3s ease;
		color: var(--text-secondary);
	}

	details[open] .chevron {
		transform: rotate(180deg);
	}

	.table-wrapper {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.chart-wrapper {
		padding: 1.5rem;
		background-color: var(--card-background);
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table thead {
		background-color: var(--hover-background);
	}

	.data-table th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		color: var(--text-primary);
		font-size: 0.875rem;
		white-space: nowrap;
	}

	.data-table td {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.data-table tbody tr:hover {
		background-color: var(--hover-background);
	}

	.question-cell {
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.table-link {
		color: var(--primary);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.table-link:hover {
		color: var(--primary-dark);
		text-decoration: underline;
	}

	/* Actions Section */
	.actions-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.action-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1.5rem;
	}

	.action-card h3 {
		margin: 0 0 0.5rem 0;
		color: var(--text-primary);
	}

	.action-card p {
		color: var(--text-secondary);
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
		background-color: var(--error-light);
		color: var(--error);
	}

	.status-badge.active {
		background-color: var(--success-light);
		color: var(--success);
	}

	.btn-secondary {
		background-color: var(--secondary);
		color: var(--text-on-secondary);
		padding: 0.75rem 1.25rem;
		border: none;
		border-radius: var(--border-radius);
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.btn-secondary:hover {
		background-color: var(--secondary-dark);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-header h1 {
			font-size: 1.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.stat-card {
			padding: 1rem;
		}

		.stat-icon {
			font-size: 2rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}

		.data-table {
			font-size: 0.875rem;
		}

		.data-table th,
		.data-table td {
			padding: 0.5rem;
		}

		.question-cell {
			max-width: 150px;
		}

		.actions-section {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.data-table {
			font-size: 0.75rem;
		}

		.data-table th,
		.data-table td {
			padding: 0.375rem;
		}

		/* Hide less important columns on very small screens */
		.data-table th:nth-child(n + 5),
		.data-table td:nth-child(n + 5) {
			display: none;
		}
	}
</style>
