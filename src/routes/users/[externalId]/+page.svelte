<!-- src/routes/users/[externalId]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	interface QuestionInfo {
		id: number;
		question: string;
		question_formatted: string | null;
		url: string;
	}

	interface Subscription {
		id: number;
		user_id: string;
		question_id: number;
		questions: QuestionInfo;
	}

	interface UserComment {
		id: number;
		comment: string;
		url: string;
		question: string;
		question_formatted: string | null;
	}

	const enneagramNames: Record<string, string> = {
		'1': 'Reformer',
		'2': 'Helper',
		'3': 'Achiever',
		'4': 'Individualist',
		'5': 'Investigator',
		'6': 'Loyalist',
		'7': 'Enthusiast',
		'8': 'Challenger',
		'9': 'Peacemaker'
	};

	const subscriptions = $derived((data.subscriptions || []) as Subscription[]);
	const comments = $derived((data.comments || []) as UserComment[]);

	const enneagramType = $derived(String(data?.user?.enneagram ?? '').trim());
	const typeName = $derived(enneagramNames[enneagramType] || '');
	const hasKnownType = $derived(Boolean(typeName));
	const displayType = $derived(hasKnownType ? enneagramType : '?');
	const profileHeading = $derived(
		data.user?.first_name?.trim() || (hasKnownType ? `Type ${enneagramType} User` : 'User Profile')
	);

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function timeAgo(dateStr: string | null): string {
		if (!dateStr) return 'Never';
		const now = new Date();
		const then = new Date(dateStr);
		const diffMs = now.getTime() - then.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 30) return `${diffDays}d ago`;
		return formatDate(dateStr);
	}
</script>

<svelte:head>
	<title>
		User Profile{hasKnownType ? ` — Type ${enneagramType}` : ''} | 9takes
	</title>
</svelte:head>

<div class="page">
	<div class="container">
		<!-- Header Card -->
		<div class="card header-card">
			<div class="header-content">
				<div class="avatar">
					{displayType}
				</div>
				<div class="user-details">
					<h1>{profileHeading}</h1>
					{#if hasKnownType}
						<span class="type-badge">
							Type {enneagramType} — The {typeName}
						</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Stats Row -->
		<div class="stats-row">
			<div class="stat-card">
				<span class="stat-value">{comments.length}</span>
				<span class="stat-label">Comments</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{subscriptions.length}</span>
				<span class="stat-label">Subscriptions</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{formatDate(data.user?.created_at)}</span>
				<span class="stat-label">Joined</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{timeAgo(data.lastSignIn)}</span>
				<span class="stat-label">Last Active</span>
			</div>
		</div>

		<!-- Comments Card -->
		<div class="card">
			<div class="card-header">
				<div class="card-header-row">
					<h2>Comments</h2>
					{#if comments.length}
						<span class="badge">{comments.length}</span>
					{/if}
				</div>
				<p class="card-subtitle">Contributions to questions</p>
			</div>

			{#if !comments.length}
				<div class="empty-state">
					<div class="empty-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path
								d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<p>No comments yet</p>
					<span class="empty-hint">This user hasn't commented on any questions</span>
				</div>
			{:else}
				<ul class="item-list">
					{#each comments as comment}
						<li>
							<a href="/questions/{comment.url}" class="item-link">
								<div class="item-content">
									<span class="item-question">
										{comment.question_formatted || comment.question}
									</span>
									<p class="item-answer">{comment.comment}</p>
								</div>
								<svg
									class="chevron"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Subscriptions Card -->
		<div class="card">
			<div class="card-header">
				<div class="card-header-row">
					<h2>Subscribed Questions</h2>
					{#if subscriptions.length}
						<span class="badge">{subscriptions.length}</span>
					{/if}
				</div>
				<p class="card-subtitle">Questions this user is following</p>
			</div>

			{#if !subscriptions.length}
				<div class="empty-state">
					<div class="empty-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path
								d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<p>No subscriptions yet</p>
					<span class="empty-hint">This user hasn't subscribed to any questions</span>
				</div>
			{:else}
				<ul class="item-list">
					{#each subscriptions as subscription}
						<li>
							<a href="/questions/{subscription.questions.url}" class="item-link">
								<span class="item-question">
									{subscription.questions.question_formatted || subscription.questions.question}
								</span>
								<svg
									class="chevron"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.page {
		--profile-card-bg: color-mix(in srgb, var(--bg-surface) 88%, var(--bg-base));
		--profile-card-border: color-mix(in srgb, var(--primary) 12%, var(--bg-elevated));
		--profile-card-shadow: 0 24px 48px color-mix(in srgb, var(--shadow-color) 24%, transparent);
		--profile-stat-bg: color-mix(in srgb, var(--bg-surface) 76%, var(--bg-deep));
		--profile-stat-border: color-mix(in srgb, var(--text-tertiary) 18%, transparent);
		--profile-chip-bg: color-mix(in srgb, var(--primary) 12%, transparent);
		--profile-chip-border: color-mix(in srgb, var(--primary) 22%, transparent);
		--profile-chip-text: color-mix(in srgb, var(--primary-dark) 70%, var(--text-primary));
		--profile-list-bg: color-mix(in srgb, var(--bg-deep) 72%, var(--bg-surface));
		--profile-list-border: color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		--profile-list-hover-bg: color-mix(in srgb, var(--primary) 10%, var(--bg-surface));
		--profile-list-hover-border: color-mix(in srgb, var(--primary) 24%, var(--bg-elevated));
		min-height: 100vh;
		padding: 1.5rem 1rem 3rem;
		background:
			radial-gradient(
				circle at top center,
				color-mix(in srgb, var(--primary) 14%, transparent) 0%,
				transparent 42%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-surface) 32%, transparent) 0%,
				transparent 100%
			);
	}

	.container {
		width: 100%;
		max-width: 720px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card {
		width: 100%;
		box-sizing: border-box;
		background: var(--profile-card-bg);
		border: 1px solid var(--profile-card-border);
		border-radius: 1rem;
		padding: 1.25rem;
		box-shadow: var(--profile-card-shadow);
		backdrop-filter: blur(14px);
	}

	.header-card {
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--primary) 16%, transparent) 0%,
				transparent 58%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-surface) 92%, var(--bg-base)) 0%,
				var(--profile-card-bg) 100%
			);
		border-color: color-mix(in srgb, var(--primary) 22%, var(--bg-elevated));
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.avatar {
		width: 3.5rem;
		height: 3.5rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		border: 1px solid color-mix(in srgb, var(--bg-surface) 65%, transparent);
		border-radius: 0.75rem;
		box-shadow: 0 18px 36px color-mix(in srgb, var(--primary-glow) 45%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.375rem;
		font-weight: 700;
		color: white;
		flex-shrink: 0;
	}

	.user-details {
		min-width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;

		h1 {
			font-size: 1.25rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0 0 0.25rem;
			line-height: 1.2;
		}
	}

	.type-badge {
		display: inline-block;
		width: fit-content;
		background: var(--profile-chip-bg);
		color: var(--profile-chip-text);
		padding: 0.3rem 0.7rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid var(--profile-chip-border);
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.625rem;
	}

	.stat-card {
		background: var(--profile-stat-bg);
		border: 1px solid var(--profile-stat-border);
		border-radius: 0.75rem;
		padding: 0.875rem;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--bg-surface) 45%, transparent);
		backdrop-filter: blur(10px);
	}

	.stat-value {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.3;
	}

	.stat-label {
		font-size: 0.6875rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.card-header {
		margin-bottom: 1rem;

		h2 {
			font-size: 1rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0 0 0.125rem;
		}
	}

	.card-header-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.card-subtitle {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.badge {
		background: var(--profile-chip-bg);
		color: var(--profile-chip-text);
		padding: 0.18rem 0.55rem;
		border-radius: 1rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border: 1px solid var(--profile-chip-border);
	}

	.empty-state {
		text-align: center;
		padding: 1.5rem 1rem;
		border: 1px dashed color-mix(in srgb, var(--text-tertiary) 22%, transparent);
		border-radius: 0.875rem;
		background: color-mix(in srgb, var(--bg-deep) 46%, var(--bg-surface));

		p {
			color: var(--text-secondary);
			margin: 0.5rem 0 0.25rem;
			font-size: 0.875rem;
			font-weight: 500;
		}

		.empty-hint {
			display: block;
			font-size: 0.75rem;
			color: var(--text-tertiary);
		}
	}

	.empty-icon {
		width: 2.5rem;
		height: 2.5rem;
		margin: 0 auto;
		color: var(--text-tertiary);

		svg {
			width: 100%;
			height: 100%;
		}
	}

	.item-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		max-height: 400px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, var(--primary) 40%, transparent) transparent;

		&::-webkit-scrollbar {
			width: 4px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(45, 212, 191, 0.3);
			border-radius: 2px;
		}
	}

	.item-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.625rem;
		padding: 0.75rem 0.875rem;
		background: var(--profile-list-bg);
		border: 1px solid var(--profile-list-border);
		border-radius: 0.5rem;
		color: inherit;
		text-decoration: none;
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--bg-surface) 42%, transparent);
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			transform 0.15s ease,
			box-shadow 0.15s ease;

		&:hover,
		&:focus {
			background: var(--profile-list-hover-bg);
			border-color: var(--profile-list-hover-border);
			transform: translateY(-1px);
			box-shadow:
				inset 0 1px 0 color-mix(in srgb, var(--bg-surface) 52%, transparent),
				0 14px 24px color-mix(in srgb, var(--shadow-color) 14%, transparent);
			outline: none;

			.chevron {
				opacity: 1;
				transform: translateX(2px);
			}
		}
	}

	.item-content {
		min-width: 0;
		flex: 1;
	}

	.item-question {
		color: var(--text-primary);
		font-size: 0.8125rem;
		font-weight: 500;
		line-height: 1.4;
		display: block;
	}

	.item-answer {
		color: var(--text-secondary);
		font-size: 0.75rem;
		line-height: 1.4;
		margin: 0.25rem 0 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.chevron {
		width: 1rem;
		height: 1rem;
		color: var(--primary);
		opacity: 0.55;
		flex-shrink: 0;
		transition: all 0.15s ease;
	}

	@media (min-width: 480px) {
		.page {
			padding: 2rem 1.5rem 4rem;
		}

		.container {
			gap: 1.25rem;
		}

		.card {
			padding: 1.5rem;
		}

		.stats-row {
			grid-template-columns: repeat(4, 1fr);
		}

		.avatar {
			width: 4rem;
			height: 4rem;
			font-size: 1.5rem;
		}

		.user-details h1 {
			font-size: 1.375rem;
		}
	}

	@media (min-width: 768px) {
		.page {
			padding: 3rem 2rem 5rem;
		}

		.container {
			max-width: 800px;
			gap: 1.5rem;
		}

		.card {
			padding: 1.75rem;
		}

		.card-header h2 {
			font-size: 1.125rem;
		}
	}
</style>
