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
	<h1 class="page-title">Admin Dashboard</h1>

	<!-- Stats Grid - Compact -->
	<div class="stats-row">
		<div class="stat-chip">
			<span class="stat-label">Users</span>
			<span class="stat-num">{data.totalUsers.toLocaleString()}</span>
			<span class="stat-sub">+{data.newUsersToday} today</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">New (30d)</span>
			<span class="stat-num">{data.newUsersMonth.toLocaleString()}</span>
			<span class="stat-sub">{((data.newUsersMonth / data.totalUsers) * 100).toFixed(1)}%</span>
		</div>
		<div class="stat-chip highlight">
			<span class="stat-label">Coaching</span>
			<span class="stat-num">{data.coachingWaitlist.toLocaleString()}</span>
			<span class="stat-sub">waitlist</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Active (7d)</span>
			<span class="stat-num">{data.activeUsers.toLocaleString()}</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Visitors</span>
			<span class="stat-num"
				>{data.dailyVisitors
					.reduce((sum, v) => sum + v.number_of_visitors, 0)
					.toLocaleString()}</span
			>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Questions</span>
			<span class="stat-num">{data.totalQuestions.toLocaleString()}</span>
			<span class="stat-sub">+{data.questionsToday}</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Comments</span>
			<span class="stat-num">{data.totalComments.toLocaleString()}</span>
			<span class="stat-sub">+{data.commentsToday}</span>
		</div>
		<div class="stat-chip" class:demo-on={isDemoTime}>
			<span class="stat-label">Demo</span>
			<span class="stat-num">{isDemoTime ? 'ON' : 'OFF'}</span>
		</div>
	</div>
	<!-- Enneagram Distribution - Compact -->
	<div class="enneagram-row">
		<span class="row-label">Types:</span>
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
			<div class="enn-chip">
				<span class="enn-type">{type}</span>
				<span class="enn-count">{data.enneagramDistribution[type] || 0}</span>
			</div>
		{/each}
	</div>

	<!-- Two-column layout for tables -->
	<div class="tables-grid">
		<!-- Coaching Waitlist -->
		<div class="section-card compact">
			<details open>
				<summary class="section-header compact">
					<span class="section-title">🎯 Coaching Waitlist ({data.coachingWaitlist})</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="table-wrapper">
					<table class="data-table compact">
						<thead>
							<tr>
								<th>Email</th>
								<th>Intent</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{#each data.coachingWaitlistUsers as user}
								<tr>
									<td><a href="mailto:{user.email}" class="table-link">{user.email}</a></td>
									<td class="intent-cell">{user.session_goal || '—'}</td>
									<td class="date-cell">{convertDateToReadable(user.created_at)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</details>
		</div>

		<!-- Recent Signups -->
		<div class="section-card compact">
			<details>
				<summary class="section-header compact">
					<span class="section-title">🆕 Recent Signups</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="table-wrapper">
					<table class="data-table compact">
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
											<span class="type-badge">T{signup.enneagram}</span>
										{:else}
											<span class="type-badge pending">—</span>
										{/if}
									</td>
									<td class="date-cell">{convertDateToReadable(signup.created_at)}</td>
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
	</div>

	<!-- Charts - Side by Side -->
	<div class="charts-grid">
		<div class="section-card compact">
			<details open>
				<summary class="section-header compact">
					<span class="section-title">📊 Visitors (30d)</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="chart-wrapper compact">
					<LineChart
						data={visitorChartData}
						title=""
						xLabel=""
						yLabel=""
						height={200}
						color="#3b82f6"
						showPoints={true}
						showGrid={true}
					/>
				</div>
			</details>
		</div>

		<div class="section-card compact">
			<details>
				<summary class="section-header compact">
					<span class="section-title">💬 Comments (30d)</span>
					<span class="chevron">▼</span>
				</summary>
				<div class="chart-wrapper compact">
					<LineChart
						data={commentChartData}
						title=""
						xLabel=""
						yLabel=""
						height={200}
						color="#10b981"
						showPoints={true}
						showGrid={true}
					/>
				</div>
			</details>
		</div>
	</div>

	<!-- Daily Questions Stats -->
	<div class="section-card compact">
		<details>
			<summary class="section-header compact">
				<span class="section-title">❓ Daily Question Stats</span>
				<span class="chevron">▼</span>
			</summary>
			<div class="table-wrapper">
				<table class="data-table compact">
					<thead>
						<tr>
							<th>Question</th>
							<th>Created</th>
							<th>Today</th>
							<th>Total</th>
							<th>User</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>
						{#each data.dailyQuestions as question}
							<tr>
								<td class="question-cell">{question.question}</td>
								<td class="date-cell">{convertDateToReadable(question.created_at)}</td>
								<td>{question.number_of_comments_today}</td>
								<td>{question.number_of_comments}</td>
								<td>
									<a href="/users/{question.user_external_id}" class="table-link">
										{question.user_email}
									</a>
								</td>
								<td>
									<a href="/questions/{question.url}" class="table-link">View</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</details>
	</div>

	<!-- Actions - Compact Inline -->
	<div class="actions-row">
		<div class="action-inline">
			<span>Demo: <strong class:demo-active={isDemoTime}>{isDemoTime ? 'ON' : 'OFF'}</strong></span>
			<button type="button" class="btn-sm" on:click={changeDemoTime}>Toggle</button>
		</div>
		<div class="action-inline">
			<span>Search Index</span>
			<button
				type="button"
				class="btn-sm"
				on:click={() => getModal('confirmReindex').open()}
				disabled={isReindexing}
			>
				{isReindexing ? 'Reindexing...' : 'Reindex ES'}
			</button>
		</div>
	</div>
</div>

<Modal2 id="confirmReindex">
	<h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">Reindex Elasticsearch</h2>
	<p style="margin-bottom: 1.5rem;">
		This will completely rebuild the Elasticsearch indices for all questions and blog posts. The
		existing indices will be deleted and recreated with fresh data from the database.
	</p>
	<p style="margin-bottom: 1rem;">This process will:</p>
	<ul style="margin-bottom: 1.5rem; padding-left: 1.5rem;">
		<li>Delete the current 'question' and 'blog' indices</li>
		<li>Recreate them with proper mappings</li>
		<li>Re-import all questions and published blog posts from Supabase</li>
	</ul>
	<p style="margin-bottom: 1.5rem; color: var(--warning);">
		<strong>Warning:</strong> This process may take several minutes depending on the amount of data.
		Make sure Elasticsearch is running and accessible before proceeding.
	</p>
	<div style="display: flex; gap: 1rem; justify-content: flex-end;">
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
</Modal2>

<style>
	.admin-dashboard {
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-title {
		font-size: 1.25rem;
		margin: 0 0 0.75rem 0;
		color: var(--text-primary);
	}

	/* Compact Stats Row */
	.stats-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.stat-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 0.75rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		min-width: 80px;
	}

	.stat-chip.highlight {
		background: var(--primary-light);
		border-color: var(--primary);
	}

	.stat-chip.demo-on {
		background: var(--success-light);
		border-color: var(--success);
	}

	.stat-label {
		font-size: 0.65rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-num {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--primary);
		line-height: 1.2;
	}

	.stat-sub {
		font-size: 0.6rem;
		color: var(--text-secondary);
	}

	/* Compact Enneagram Row */
	.enneagram-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
		margin-bottom: 0.75rem;
		padding: 0.5rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
	}

	.row-label {
		font-size: 0.7rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.enn-chip {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: var(--hover-background);
		border-radius: 4px;
	}

	.enn-type {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.enn-count {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--primary);
	}

	/* Tables Grid */
	.tables-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	/* Section Cards - Compact */
	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		overflow: hidden;
	}

	.section-card.compact {
		margin-bottom: 0.75rem;
	}

	details {
		cursor: pointer;
	}

	.section-header {
		padding: 0.75rem;
		background-color: var(--hover-background);
		display: flex;
		justify-content: space-between;
		align-items: center;
		list-style: none;
	}

	.section-header.compact {
		padding: 0.5rem 0.75rem;
	}

	.section-header:hover {
		background-color: var(--primary-light);
	}

	.section-title {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.chevron {
		font-size: 0.7rem;
		color: var(--text-secondary);
		transition: transform 0.2s ease;
	}

	details[open] .chevron {
		transform: rotate(180deg);
	}

	/* Tables - Compact */
	.table-wrapper {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.75rem;
	}

	.data-table.compact {
		font-size: 0.7rem;
	}

	.data-table thead {
		background-color: var(--hover-background);
	}

	.data-table th {
		padding: 0.375rem 0.5rem;
		text-align: left;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
	}

	.data-table td {
		padding: 0.375rem 0.5rem;
		border-top: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.data-table tbody tr:hover {
		background-color: var(--hover-background);
	}

	.question-cell {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.intent-cell {
		max-width: 320px;
		white-space: pre-line;
		word-break: break-word;
		color: var(--text-secondary);
		line-height: 1.3;
	}

	.date-cell {
		white-space: nowrap;
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	.table-link {
		color: var(--primary);
		text-decoration: none;
		font-weight: 500;
	}

	.table-link:hover {
		text-decoration: underline;
	}

	.type-badge {
		display: inline-block;
		padding: 0.125rem 0.375rem;
		border-radius: 9999px;
		font-size: 0.65rem;
		font-weight: 500;
		background-color: var(--primary-light);
		color: var(--primary);
	}

	.type-badge.pending {
		background-color: var(--warning-light);
		color: var(--warning);
	}

	/* Chart Wrapper - Compact */
	.chart-wrapper {
		padding: 0.5rem;
		background-color: var(--card-background);
	}

	.chart-wrapper.compact {
		padding: 0.375rem;
	}

	/* Actions Row - Compact */
	.actions-row {
		display: flex;
		gap: 1rem;
		padding: 0.5rem 0;
	}

	.action-inline {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-primary);
	}

	.demo-active {
		color: var(--success);
	}

	.btn-sm {
		padding: 0.25rem 0.5rem;
		font-size: 0.7rem;
		font-weight: 500;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.btn-sm:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-sm:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.tables-grid,
		.charts-grid {
			grid-template-columns: 1fr;
		}

		.stats-row {
			gap: 0.375rem;
		}

		.stat-chip {
			padding: 0.375rem 0.5rem;
			min-width: 60px;
		}

		.stat-num {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.data-table th:nth-child(n + 4),
		.data-table td:nth-child(n + 4) {
			display: none;
		}
	}
</style>
