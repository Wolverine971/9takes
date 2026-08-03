<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/atoms';
	import { notifications as toast } from '$lib/components/molecules/notifications';
	import { supabase } from '$lib/supabase';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';
	import { useNotificationCount } from '$lib/notificationCount.svelte';
	import type { PageData } from './$types';
	import type {
		ActiveQuestion,
		CommunityPulse,
		NotificationRow,
		PersonalStats,
		QuestionOfTheDay,
		SharedTypePerson,
		YourTake
	} from '$lib/server/accountDashboard';

	interface EnneagramType {
		num: number;
		name: string;
		descriptor: string;
		color: string;
	}

	interface ProfileSnapshot {
		firstName: string;
		lastName: string;
		enneagram: string;
	}

	interface AccountUser {
		first_name: string | null;
		last_name: string | null;
		enneagram: string | null;
		email: string | null;
		admin: boolean | null;
	}

	interface AccountSubscription {
		questions: {
			url: string;
			question_formatted: string | null;
			question: string;
		};
	}

	// Descriptors are page copy; names/colors come from the canonical constant so
	// they cannot drift from --type-N-color or the rest of the app.
	const TYPE_DESCRIPTORS: Record<number, string> = {
		1: 'Structured, measured, and improvement-driven',
		2: 'Warm, relational, and quick to support',
		3: 'Driven, adaptive, and outcome-focused',
		4: 'Expressive, nuanced, and emotionally precise',
		5: 'Analytical, reserved, and insight-oriented',
		6: 'Committed, vigilant, and team-minded',
		7: 'Upbeat, expansive, and possibility-driven',
		8: 'Direct, powerful, and action-first',
		9: 'Grounded, receptive, and harmony-oriented'
	};

	const enneagramTypes: EnneagramType[] = Object.entries(ENNEAGRAM_TYPE_COLORS).map(
		([num, meta]) => ({
			num: Number(num),
			name: meta.name.replace(/^The /, ''),
			descriptor: TYPE_DESCRIPTORS[Number(num)],
			color: meta.color
		})
	);
	const DEFAULT_NOTIFICATION_PREFERENCES = {
		reply_to_take: true,
		take_on_your_question: true,
		take_on_answered_question: true,
		like_on_take: true,
		email_digest: true
	};

	let { data }: { data: PageData } = $props();
	const notificationCount = useNotificationCount();

	// Demo mode routes these through mapDemoValues, which erases the row types.
	let user = $derived(data.user as unknown as AccountUser);
	let userEmail = $derived(user.email ?? '');
	let subscriptions = $derived((data.subscriptions ?? []) as unknown as AccountSubscription[]);
	let questionOfTheDay = $derived(data.questionOfTheDay as QuestionOfTheDay | null);
	let sharedTypePeople = $derived((data.sharedTypePeople ?? []) as SharedTypePerson[]);
	let pulse = $derived(data.communityPulse as CommunityPulse);
	// Server-computed (isRoomLively lives in $lib/server). True only when several
	// different types weighed in this week — the pulse is worth showing when it
	// demonstrates the nine-perspectives claim, not merely when the counter moved.
	let roomLively = $derived(data.roomLively === true);
	let stats = $derived(data.personalStats as PersonalStats);
	let yourTakes = $derived((data.yourTakes ?? []) as YourTake[]);
	let activeQuestions = $derived((data.activeQuestions ?? []) as ActiveQuestion[]);

	let firstName = $state('');
	let lastName = $state('');
	let enneagram = $state('');
	let saving = $state(false);
	let loggingOut = $state(false);
	let showTypePicker = $state(false);
	let markingRead = $state(false);
	let savingPrefs = $state(false);
	let profileSnapshot = $state<ProfileSnapshot>({ firstName: '', lastName: '', enneagram: '' });
	let lastLoadedSignature = $state('');

	// Local copies so mark-as-read and preference toggles feel instant without a
	// full invalidation round trip.
	let feedItems = $state<NotificationRow[]>([]);
	let unreadCount = $state(0);
	let prefs = $state({ ...DEFAULT_NOTIFICATION_PREFERENCES });

	let notificationsAvailable = $derived(data.notifications?.available ?? false);
	let hasType = $derived(/^[1-9]$/.test(enneagram));
	let selectedType = $derived(
		enneagramTypes.find((type) => String(type.num) === enneagram) ?? null
	);
	let accentColor = $derived(selectedType?.color ?? 'var(--lamp-glow)');
	let displayName = $derived(
		[user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'there'
	);
	let formChanged = $derived(
		firstName.trim() !== profileSnapshot.firstName ||
			lastName.trim() !== profileSnapshot.lastName ||
			enneagram.trim() !== profileSnapshot.enneagram
	);
	let hasActivity = $derived(
		stats.takes > 0 || stats.questions > 0 || stats.repliesReceived > 0 || stats.likesReceived > 0
	);

	$effect(() => {
		const nextSnapshot = {
			firstName: normalizeText(user.first_name),
			lastName: normalizeText(user.last_name),
			// 'unknown' is the registration default; treat it as "not chosen yet"
			// so the picker reads as empty rather than pre-selected.
			enneagram: /^[1-9]$/.test(normalizeText(user.enneagram)) ? normalizeText(user.enneagram) : ''
		};
		const signature = JSON.stringify([
			userEmail,
			nextSnapshot.firstName,
			nextSnapshot.lastName,
			nextSnapshot.enneagram
		]);

		if (signature === lastLoadedSignature) return;

		firstName = nextSnapshot.firstName;
		lastName = nextSnapshot.lastName;
		enneagram = nextSnapshot.enneagram;
		profileSnapshot = nextSnapshot;
		lastLoadedSignature = signature;
	});

	$effect(() => {
		feedItems = [...((data.notifications?.items ?? []) as NotificationRow[])];
		unreadCount = data.notifications?.unread ?? 0;
	});

	$effect(() => {
		const notificationPreferences = data.notificationPreferences;
		if (!notificationPreferences) return;

		// Do not merge from `prefs` here. Reading and then replacing the same
		// reactive object makes this effect subscribe to its own write and loop.
		prefs = { ...DEFAULT_NOTIFICATION_PREFERENCES, ...notificationPreferences };
	});

	interface FeedGroup {
		key: string;
		ids: number[];
		kind: string;
		actors: string[];
		questionText: string | null;
		questionUrl: string | null;
		excerpt: string | null;
		createdAt: string;
		unread: boolean;
		count: number;
	}

	// Collapses repeated "someone else answered a question you answered" events on
	// the same question into one row, so a busy thread reads as
	// "4 new takes · Types 2, 4, 7, 9" instead of four near-identical lines.
	let feedGroups = $derived.by<FeedGroup[]>(() => {
		const groups: FeedGroup[] = [];
		const indexByKey = new Map<string, number>();

		for (const item of feedItems) {
			const groupable = item.kind === 'take_on_answered_question' && item.question_id != null;
			const key = groupable ? `${item.kind}:${item.question_id}` : `single:${item.id}`;
			const existingIndex = indexByKey.get(key);

			if (groupable && existingIndex !== undefined) {
				const group = groups[existingIndex];
				group.ids.push(item.id);
				group.count += 1;
				if (!group.actors.includes(item.actor_enneagram)) {
					group.actors.push(item.actor_enneagram);
				}
				group.unread = group.unread || item.read_at === null;
				continue;
			}

			indexByKey.set(key, groups.length);
			groups.push({
				key,
				ids: [item.id],
				kind: item.kind,
				actors: [item.actor_enneagram],
				questionText: item.question_text,
				questionUrl: item.question_url,
				excerpt: item.comment_excerpt,
				createdAt: item.created_at,
				unread: item.read_at === null,
				count: 1
			});
		}

		return groups;
	});

	function normalizeText(value: string | null | undefined) {
		return value?.trim() ?? '';
	}

	function typeColor(type: string): string {
		const num = Number(type);
		return ENNEAGRAM_TYPE_COLORS[num]?.color ?? 'var(--ink-dim)';
	}

	function actorLabel(type: string): string {
		if (/^[1-9]$/.test(type)) return `A Type ${type}`;
		if (type === 'rando') return 'An anonymous visitor';
		return 'Someone';
	}

	function actorListLabel(actors: string[]): string {
		const typed = actors.filter((actor) => /^[1-9]$/.test(actor)).sort();
		if (!typed.length) return '';
		if (typed.length === 1) return `Type ${typed[0]}`;
		return `Types ${typed.join(', ')}`;
	}

	function groupHeadline(group: FeedGroup): string {
		switch (group.kind) {
			case 'reply_to_take':
				return `${actorLabel(group.actors[0])} replied to your take`;
			case 'take_on_your_question':
				return `${actorLabel(group.actors[0])} answered your question`;
			case 'take_on_answered_question': {
				if (group.count === 1) {
					return `${actorLabel(group.actors[0])} also answered a question you answered`;
				}
				const list = actorListLabel(group.actors);
				return `${group.count} new takes on a question you answered${list ? ` · ${list}` : ''}`;
			}
			case 'like_on_take':
				return `${actorLabel(group.actors[0])} liked your take`;
			default:
				return 'New activity';
		}
	}

	function relativeTime(iso: string): string {
		const then = new Date(iso).getTime();
		if (Number.isNaN(then)) return '';
		const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		const months = Math.floor(days / 30);
		if (months < 12) return `${months}mo ago`;
		return `${Math.floor(months / 12)}y ago`;
	}

	async function submitLogout({ cancel }: { cancel: Function }) {
		loggingOut = true;
		const { error: signOutError } = await supabase.auth.signOut();

		if (signOutError) {
			console.error(signOutError);
			loggingOut = false;
			cancel();
		}
	}

	async function save() {
		saving = true;

		const nextSnapshot = {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			enneagram: enneagram.trim()
		};

		const body = new FormData();
		body.append('firstName', nextSnapshot.firstName);
		body.append('lastName', nextSnapshot.lastName);
		body.append('enneagram', nextSnapshot.enneagram);
		body.append('email', userEmail);

		try {
			const response = await fetch('?/updateAccount', { method: 'POST', body });

			if (!response.ok) {
				throw new Error(`Failed to update account (${response.status})`);
			}

			firstName = nextSnapshot.firstName;
			lastName = nextSnapshot.lastName;
			enneagram = nextSnapshot.enneagram;
			profileSnapshot = nextSnapshot;
			lastLoadedSignature = JSON.stringify([
				userEmail,
				nextSnapshot.firstName,
				nextSnapshot.lastName,
				nextSnapshot.enneagram
			]);
			showTypePicker = false;

			toast.success('Account updated', 3000);
		} catch (error) {
			console.error('Error updating account:', error);
			toast.danger('Failed to update account', 3000);
		} finally {
			saving = false;
		}
	}

	async function savePreferences() {
		savingPrefs = true;
		const body = new FormData();
		for (const [key, value] of Object.entries(prefs)) {
			body.append(key, String(value));
		}

		try {
			const response = await fetch('?/updateNotificationPreferences', { method: 'POST', body });
			if (!response.ok) throw new Error(`Failed (${response.status})`);
			toast.success('Notification settings saved', 3000);
		} catch (error) {
			console.error('Error saving notification preferences:', error);
			toast.danger('Failed to save notification settings', 3000);
		} finally {
			savingPrefs = false;
		}
	}

	async function markAllRead() {
		if (!unreadCount || markingRead) return;
		markingRead = true;
		const now = new Date().toISOString();

		try {
			const response = await fetch('/api/notifications/read', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({})
			});

			if (!response.ok) throw new Error(`Failed (${response.status})`);

			feedItems = feedItems.map((item) => (item.read_at ? item : { ...item, read_at: now }));
			unreadCount = 0;
			notificationCount.setUnread(0);
		} catch (error) {
			console.error('Error marking notifications read:', error);
			toast.danger('Could not mark notifications read', 3000);
		} finally {
			markingRead = false;
		}
	}

	async function markGroupRead(group: FeedGroup) {
		const unreadIds = new Set(
			feedItems
				.filter((item) => group.ids.includes(item.id) && item.read_at === null)
				.map((item) => item.id)
		);

		if (!unreadIds.size) return;

		const previousItems = feedItems;
		const previousUnread = unreadCount;
		const now = new Date().toISOString();

		feedItems = feedItems.map((item) =>
			unreadIds.has(item.id) ? { ...item, read_at: now } : item
		);
		unreadCount = Math.max(0, unreadCount - unreadIds.size);
		notificationCount.setUnread(unreadCount);

		try {
			const response = await fetch('/api/notifications/read', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ids: [...unreadIds] }),
				keepalive: true
			});

			if (!response.ok) throw new Error(`Failed (${response.status})`);
		} catch (error) {
			feedItems = previousItems;
			unreadCount = previousUnread;
			notificationCount.setUnread(previousUnread);
			console.error('Error marking notification read:', error);
			toast.danger('Could not mark notification read', 3000);
		}
	}

	function openNotification(event: MouseEvent, group: FeedGroup) {
		if (
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			!group.questionUrl
		) {
			return;
		}

		event.preventDefault();
		void markGroupRead(group);
		void goto(resolve(`/questions/${group.questionUrl}`));
	}

	function selectType(num: number) {
		enneagram = String(num);
	}
</script>

{#snippet notificationContent(group: FeedGroup)}
	<span class="feed-dot" style={`--dot: ${typeColor(group.actors[0])}`} aria-hidden="true"></span>
	<div class="feed-body">
		<p class="feed-headline">{groupHeadline(group)}</p>
		{#if group.excerpt && group.kind !== 'take_on_answered_question'}
			<p class="feed-excerpt">“{group.excerpt}”</p>
		{/if}
		{#if group.questionText}
			<span class="feed-link">{group.questionText}</span>
		{/if}
	</div>
	<time class="feed-time" datetime={group.createdAt}>
		{relativeTime(group.createdAt)}
	</time>
{/snippet}

<div class="account-page">
	<div class="account-shell">
		<header class="header-panel">
			<div class="header-copy">
				<p class="kicker">Your 9takes</p>
				<h1>Welcome back, {displayName}</h1>
			</div>

			<div class="header-actions">
				{#if user.admin}
					<a href="/admin" class="action-link action-link-primary">Admin dashboard</a>
				{/if}

				<form action="/logout" method="POST" use:enhance={submitLogout}>
					<Button
						type="submit"
						variant="secondary"
						size="md"
						loading={loggingOut}
						class="account-action signout-button"
					>
						Sign out
					</Button>
				</form>
			</div>
		</header>

		<!-- ── Identity ─────────────────────────────────────────────────────────
		     Two states. 133 of 149 accounts have no type set, and every other
		     section on this page keys off it, so the untyped state is the loud
		     one: it is the page's real job, not a settings row. -->
		{#if hasType && selectedType}
			<section class="panel identity-panel" style={`--accent: ${accentColor}`}>
				<div class="identity-main">
					<span class="identity-badge">{selectedType.num}</span>
					<div class="identity-copy">
						<p class="section-label">Your lens</p>
						<h2>Type {selectedType.num} · The {selectedType.name}</h2>
						<p class="section-copy">{selectedType.descriptor}</p>
					</div>
				</div>

				<div class="identity-links">
					<a href={`/enneagram-corner/enneagram-type-${selectedType.num}`} class="text-link">
						Your type, explained
					</a>
					<a href={`/personality-analysis/type/${selectedType.num}`} class="text-link">
						Famous Type {selectedType.num}s
					</a>
					<button
						type="button"
						class="ghost-link"
						onclick={() => (showTypePicker = !showTypePicker)}
					>
						{showTypePicker ? 'Cancel' : 'Change type'}
					</button>
				</div>
			</section>
		{:else}
			<section class="panel identity-panel untyped">
				<div class="identity-copy">
					<p class="section-label">Start here</p>
					<h2>You haven't set your type yet</h2>
					<p class="section-copy">
						Your type is the key to everything else here — which questions need your voice, which
						takes get shown to you, and who else sees the world the way you do. Pick one and the
						rest of this page comes alive.
					</p>
					<p class="section-copy subtle">
						Not sure? <a href="/enneagram-test" class="inline-link">Take the test</a> — it takes a few
						minutes.
					</p>
				</div>
			</section>
		{/if}

		{#if !hasType || showTypePicker}
			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="section-label">Enneagram</p>
						<h2>Pick your type</h2>
					</div>
					{#if formChanged}
						<span class="state-pill pending">Unsaved</span>
					{/if}
				</div>

				<div class="type-grid" role="radiogroup" aria-label="Enneagram type">
					{#each enneagramTypes as type}
						<button
							type="button"
							role="radio"
							class="type-card"
							class:selected={enneagram === String(type.num)}
							aria-checked={enneagram === String(type.num)}
							onclick={() => selectType(type.num)}
							style={`--type-accent: ${type.color}`}
						>
							<span class="type-number">{type.num}</span>
							<span class="type-body">
								<strong>{type.name}</strong>
								<span class="type-descriptor">{type.descriptor}</span>
							</span>
						</button>
					{/each}
				</div>

				<div class="form-actions">
					<Button
						type="button"
						variant="primary"
						size="md"
						loading={saving}
						disabled={!formChanged}
						onclick={save}
						class="account-action save-button"
					>
						Save type
					</Button>
					<p class="action-note" role="status">
						{formChanged ? 'Save to lock this in.' : 'Choose the type that fits you best.'}
					</p>
				</div>
			</section>
		{/if}

		<!-- ── Question of the day ─────────────────────────────────────────────
		     The page's primary CTA. Personalized: never a question you've already
		     answered, and it prefers threads where your type is missing. -->
		{#if questionOfTheDay}
			<section class="panel qotd-panel" style={`--accent: ${accentColor}`}>
				<p class="section-label">Your question today</p>
				<h2 class="qotd-text">{questionOfTheDay.text}</h2>

				<div class="qotd-meta">
					{#if questionOfTheDay.takeCount > 0}
						<span class="meta-pill">
							{questionOfTheDay.takeCount}
							{questionOfTheDay.takeCount === 1 ? 'take' : 'takes'}
						</span>
					{:else}
						<span class="meta-pill">No takes yet — be first</span>
					{/if}

					{#if questionOfTheDay.typesPresent.length}
						<span class="type-dots" aria-label="Types that have answered">
							{#each questionOfTheDay.typesPresent as type}
								<span
									class="type-dot"
									style={`--dot: ${typeColor(type)}`}
									title={`Type ${type} has weighed in`}
								>
									{type}
								</span>
							{/each}
						</span>
					{/if}
				</div>

				{#if questionOfTheDay.yourTypeMissing && selectedType}
					<p class="qotd-hook">
						No Type {selectedType.num} has weighed in yet.
					</p>
				{/if}

				<a
					href={`/questions/${questionOfTheDay.url}`}
					class="action-link action-link-primary qotd-cta"
				>
					Add your take
				</a>
			</section>
		{/if}

		<!-- ── Status panel ────────────────────────────────────────────────────
		     Community pulse sits first and personal record second, deliberately:
		     for most accounts the personal column is all zeros, and a page that
		     opens on your own zeros reads as dead. -->
		<div class="content-grid">
			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="section-label">The room</p>
						<h2>{roomLively ? 'Last 7 days' : 'Room for your take'}</h2>
					</div>
					<a href="/questions" class="text-link">Browse</a>
				</div>

				{#if roomLively}
					<div class="stat-row">
						<div class="stat">
							<strong>{pulse.newQuestions7d}</strong>
							<span>new {pulse.newQuestions7d === 1 ? 'question' : 'questions'}</span>
						</div>
						<div class="stat">
							<strong>{pulse.newTakes7d}</strong>
							<span>new {pulse.newTakes7d === 1 ? 'take' : 'takes'}</span>
						</div>
					</div>
				{:else}
					<!-- Quiet week. A 7-day counter reading zero is a number the user
					     cannot act on and misreads the place as abandoned; the standing
					     opening is both truer and actionable. -->
					<div class="opening">
						<strong>{pulse.questionsAwaitingFirstTake}</strong>
						<span>
							{pulse.questionsAwaitingFirstTake === 1 ? 'question is' : 'questions are'} still waiting
							for a first take
						</span>
						{#if pulse.questionsAwaitingFirstTake > 0}
							<p class="opening-note">
								Out of {pulse.totalQuestions}. Yours would be the first one on the page.
							</p>
						{/if}
					</div>
				{/if}

				{#if pulse.activeTypes7d.length}
					<div class="pulse-types">
						<span class="pulse-label">Types active this week</span>
						<span class="type-dots">
							{#each pulse.activeTypes7d as type}
								<span class="type-dot" style={`--dot: ${typeColor(type)}`} title={`Type ${type}`}>
									{type}
								</span>
							{/each}
						</span>
					</div>
				{/if}

				<p class="corpus-note">
					{pulse.totalQuestions} questions · {pulse.totalTakes} takes all time
				</p>
			</section>

			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="section-label">Your record</p>
						<h2>What you've added</h2>
					</div>
				</div>

				{#if hasActivity}
					<div class="stat-grid">
						<div class="stat">
							<strong>{stats.takes}</strong>
							<span>{stats.takes === 1 ? 'take' : 'takes'}</span>
						</div>
						<div class="stat">
							<strong>{stats.questions}</strong>
							<span>{stats.questions === 1 ? 'question' : 'questions'}</span>
						</div>
						<div class="stat">
							<strong>{stats.repliesReceived}</strong>
							<span>{stats.repliesReceived === 1 ? 'reply' : 'replies'} to you</span>
						</div>
						<div class="stat">
							<strong>{stats.likesReceived}</strong>
							<span>{stats.likesReceived === 1 ? 'like' : 'likes'}</span>
						</div>
					</div>

					<!-- The counts say how much; this says what. People come back for
					     their own words and the reply underneath them, so the takes
					     themselves carry more return-pull than the tallies above. -->
					{#if yourTakes.length}
						<ul class="your-takes">
							{#each yourTakes as take (take.id)}
								<li>
									<a href={`/questions/${take.questionUrl}`} class="your-take">
										<span class="your-take-question">{take.questionText}</span>
										<span class="your-take-excerpt">{take.excerpt}</span>
										<span class="your-take-meta">
											{#if take.replyCount}
												{take.replyCount}
												{take.replyCount === 1 ? 'reply' : 'replies'}
											{:else}
												No replies yet
											{/if}
											{#if take.likeCount}
												· {take.likeCount} {take.likeCount === 1 ? 'like' : 'likes'}
											{/if}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				{:else}
					<div class="empty-block">
						<strong>Nothing yet</strong>
						<p>Your takes, questions, and the replies they draw will collect here.</p>
						{#if questionOfTheDay}
							<a href={`/questions/${questionOfTheDay.url}`} class="text-link">Answer your first</a>
						{:else}
							<a href="/questions" class="text-link">Find a question</a>
						{/if}
					</div>
				{/if}
			</section>
		</div>

		<!-- ── Notifications ───────────────────────────────────────────────── -->
		{#if notificationsAvailable}
			<section id="notifications" class="panel" aria-labelledby="notifications-heading">
				<div class="panel-head">
					<div>
						<p class="section-label">Activity</p>
						<h2 id="notifications-heading">
							What's come back to you
							{#if unreadCount > 0}
								<span class="unread-badge">{unreadCount}</span>
							{/if}
						</h2>
					</div>

					{#if unreadCount > 0}
						<button type="button" class="ghost-link" onclick={markAllRead} disabled={markingRead}>
							{markingRead ? 'Marking…' : 'Mark all read'}
						</button>
					{/if}
				</div>

				{#if !feedGroups.length}
					<div class="empty-block">
						<strong>Quiet so far</strong>
						<p>
							When someone replies to your take, likes it, or answers a question you're in, it shows
							up here.
						</p>
					</div>
				{:else}
					<ul class="feed-list">
						{#each feedGroups as group (group.key)}
							<li class="feed-item" class:unread={group.unread}>
								{#if group.questionUrl}
									<a
										href={resolve(`/questions/${group.questionUrl}`)}
										class="feed-row"
										onclick={(event) => openNotification(event, group)}
									>
										{@render notificationContent(group)}
									</a>
								{:else}
									<div class="feed-row">{@render notificationContent(group)}</div>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}

		<!-- ── Others who share your type ──────────────────────────────────── -->
		{#if sharedTypePeople.length && selectedType}
			<section class="panel" style={`--accent: ${accentColor}`}>
				<div class="panel-head">
					<div>
						<p class="section-label">Others who see it like you</p>
						<h2>Type {selectedType.num}s we've analyzed</h2>
					</div>
					<a href={`/personality-analysis/type/${selectedType.num}`} class="text-link">See all</a>
				</div>

				<ul class="people-row">
					{#each sharedTypePeople as person (person.slug)}
						<li>
							<a href={`/personality-analysis/${person.slug}`} class="person-card">
								<img
									src={person.imagePath}
									alt=""
									loading="lazy"
									width="72"
									height="72"
									onerror={(event) => {
										(event.currentTarget as HTMLImageElement).style.visibility = 'hidden';
									}}
								/>
								<span class="person-name">{person.name}</span>
								{#if person.personaTitle}
									<span class="person-title">{person.personaTitle}</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- ── Where the room is loudest ───────────────────────────────────── -->
		{#if activeQuestions.length}
			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="section-label">Heating up</p>
						<h2>Most answered lately</h2>
					</div>
					<a href="/questions" class="text-link">All questions</a>
				</div>

				<ul class="subscription-list">
					{#each activeQuestions as question (question.id)}
						<li>
							<a href={`/questions/${question.url}`} class="subscription-row">
								<span class="row-index">{question.recentTakes}</span>
								<span class="row-text">{question.text}</span>
								<span class="row-action">Open</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- ── Settings ────────────────────────────────────────────────────── -->
		<details class="panel settings-panel">
			<summary>
				<span>
					<p class="section-label">Settings</p>
					<h2>Profile, notifications, and follows</h2>
				</span>
			</summary>

			<div class="settings-body">
				<div class="field-grid">
					<label class="field">
						<span class="field-label">First name</span>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							placeholder="First name"
							autocomplete="given-name"
						/>
					</label>

					<label class="field">
						<span class="field-label">Last name</span>
						<input
							type="text"
							id="lastName"
							bind:value={lastName}
							placeholder="Last name"
							autocomplete="family-name"
						/>
					</label>
				</div>

				<div class="form-actions">
					<Button
						type="button"
						variant="primary"
						size="md"
						loading={saving}
						disabled={!formChanged}
						onclick={save}
						class="account-action save-button"
					>
						Save changes
					</Button>
					<p class="action-note" role="status">
						{formChanged ? 'Save to commit the current edits.' : 'All fields are in sync.'}
					</p>
				</div>

				{#if notificationsAvailable}
					<div class="settings-section">
						<h3>Notify me when</h3>
						<label class="toggle">
							<input type="checkbox" bind:checked={prefs.reply_to_take} />
							<span>Someone replies to my take</span>
						</label>
						<label class="toggle">
							<input type="checkbox" bind:checked={prefs.take_on_your_question} />
							<span>Someone answers a question I asked</span>
						</label>
						<label class="toggle">
							<input type="checkbox" bind:checked={prefs.take_on_answered_question} />
							<span>Someone answers a question I answered</span>
						</label>
						<label class="toggle">
							<input type="checkbox" bind:checked={prefs.like_on_take} />
							<span>Someone likes my take</span>
						</label>
						<!-- The email-digest toggle is deliberately not rendered yet. The
						     column, the preference RPC, and the notification events it
						     would draw from all exist, but nothing sends the email — so
						     showing the switch would promise mail that never arrives.
						     Restore this control in the same change that ships the digest
						     job; prefs.email_digest still round-trips and defaults true,
						     so nobody's stored choice is lost in the meantime. -->

						<Button
							type="button"
							variant="secondary"
							size="md"
							loading={savingPrefs}
							onclick={savePreferences}
							class="account-action"
						>
							Save notification settings
						</Button>
					</div>
				{/if}

				<div class="settings-section">
					<h3>Followed questions</h3>
					{#if !subscriptions.length}
						<p class="section-copy">
							You're not following any questions. Follow one from its page to get pinged when new
							takes land.
						</p>
					{:else}
						<ul class="subscription-list">
							{#each subscriptions as subscription, index}
								<li>
									<a href={`/questions/${subscription.questions.url}`} class="subscription-row">
										<span class="row-index">{String(index + 1).padStart(2, '0')}</span>
										<span class="row-text">
											{subscription.questions.question_formatted || subscription.questions.question}
										</span>
										<span class="row-action">Open</span>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="settings-section">
					<h3>Account</h3>
					<p class="section-copy">{userEmail}</p>
					<a href="/account/unsubscribe" class="text-link">Email preferences</a>
				</div>
			</div>
		</details>
	</div>
</div>

<style lang="scss">
	.account-page {
		position: relative;
		min-height: 100vh;
		padding: 1.1rem 1rem 3rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--night-deep) 88%, black) 0%,
			var(--night-deep) 100%
		);
	}

	.account-page::before {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0.14;
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--ink-dim) 18%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--ink-dim) 18%, transparent) 1px,
				transparent 1px
			);
		background-size: 32px 32px;
	}

	.account-shell {
		position: relative;
		max-width: 1080px;
		margin: 0 auto;
		display: grid;
		gap: 0.9rem;
	}

	.header-panel,
	.panel {
		position: relative;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 16%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--stone-warm) 96%, transparent);
		box-shadow: 0 16px 36px rgba(12, 10, 9, 0.16);
	}

	.header-panel {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1.1rem;
		flex-wrap: wrap;
	}

	.header-copy {
		min-width: 0;
		display: grid;
		gap: 0.15rem;
	}

	.kicker,
	.section-label,
	.row-index,
	.row-action {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.kicker,
	.section-label {
		margin: 0;
		color: color-mix(in srgb, var(--lamp-glow) 70%, var(--ink-dim));
	}

	.section-label {
		margin-bottom: 0.4rem;
	}

	.header-copy h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 1.9rem);
		line-height: 1.1;
		color: var(--ink-bright);
	}

	.row-index,
	.row-action {
		color: var(--ink-dim);
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		align-items: center;
	}

	.header-actions form {
		display: flex;
	}

	.action-link,
	.text-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.5rem;
		padding: 0.65rem 0.9rem;
		border-radius: 0.625rem;
		text-decoration: none;
		font-weight: 600;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			transform 0.18s ease;
	}

	.action-link {
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 10%, var(--night-deep));
		color: var(--ink-bright);
	}

	.action-link:hover,
	.text-link:hover {
		transform: translateY(-1px);
	}

	.action-link-primary {
		background: var(--lamp-glow);
		border-color: var(--lamp-glow);
		color: var(--text-on-primary);
	}

	.text-link {
		border: 1px solid color-mix(in srgb, var(--ink-dim) 16%, transparent);
		background: color-mix(in srgb, var(--night-deep) 90%, transparent);
		color: var(--ink-bright);
	}

	.ghost-link {
		border: 0;
		background: none;
		padding: 0.4rem 0;
		color: color-mix(in srgb, var(--lamp-glow) 80%, var(--ink-bright));
		font-weight: 600;
		font-size: 0.88rem;
		cursor: pointer;
	}

	.ghost-link:hover:not(:disabled) {
		text-decoration: underline;
	}

	.ghost-link:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.inline-link {
		color: var(--lamp-glow);
		font-weight: 600;
	}

	.panel {
		padding: 1rem;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.85rem;
		margin-bottom: 0.9rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid color-mix(in srgb, var(--ink-dim) 12%, transparent);
	}

	.panel-head h2,
	.identity-copy h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.3rem;
		line-height: 1.15;
		color: var(--ink-bright);
	}

	.section-copy {
		margin: 0.3rem 0 0;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.section-copy.subtle {
		font-size: 0.85rem;
	}

	/* ── Identity ─────────────────────────────────────────────────────────── */

	.identity-panel {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		border-color: color-mix(in srgb, var(--accent, var(--lamp-glow)) 30%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent, var(--lamp-glow)) 10%, var(--stone-warm)) 0%,
			color-mix(in srgb, var(--stone-warm) 96%, transparent) 60%
		);
	}

	.identity-panel.untyped {
		border-color: color-mix(in srgb, var(--lamp-glow) 40%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lamp-glow) 12%, var(--stone-warm)) 0%,
			color-mix(in srgb, var(--stone-warm) 96%, transparent) 70%
		);
	}

	.identity-main {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		min-width: 0;
	}

	.identity-badge {
		flex-shrink: 0;
		width: 3.25rem;
		height: 3.25rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* lint-radius-role: card */
		border-radius: 1rem;
		background: color-mix(in srgb, var(--accent) 22%, var(--night-deep));
		border: 1px solid color-mix(in srgb, var(--accent) 46%, transparent);
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 700;
	}

	.identity-copy {
		min-width: 0;
	}

	.identity-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		align-items: center;
	}

	/* ── Type picker ──────────────────────────────────────────────────────── */

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.type-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.6rem;
		align-items: start;
		padding: 0.7rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--type-accent) 18%, var(--ink-dim));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.18s ease,
			background 0.18s ease,
			transform 0.18s ease;
	}

	.type-card:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--type-accent) 44%, transparent);
	}

	.type-card.selected {
		border-color: color-mix(in srgb, var(--type-accent) 56%, transparent);
		background: color-mix(in srgb, var(--type-accent) 12%, var(--night-deep));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--type-accent) 22%, transparent);
	}

	.type-number {
		min-width: 2rem;
		height: 2rem;
		padding: 0 0.45rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--type-accent) 18%, var(--night-deep));
		color: var(--ink-bright);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 700;
	}

	.type-body {
		display: grid;
		gap: 0.15rem;
		min-width: 0;
	}

	.type-body strong {
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.25;
	}

	.type-descriptor {
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.state-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--warning) 28%, transparent);
		background: color-mix(in srgb, var(--warning) 12%, var(--night-deep));
		color: var(--ink-bright);
		font-size: 0.78rem;
		font-weight: 600;
		white-space: nowrap;
	}

	/* ── Question of the day ──────────────────────────────────────────────── */

	.qotd-panel {
		border-color: color-mix(in srgb, var(--accent, var(--lamp-glow)) 32%, transparent);
	}

	.qotd-text {
		margin: 0 0 0.75rem;
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 3.2vw, 1.7rem);
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.qotd-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.7rem;
	}

	.meta-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.4rem 0.7rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 16%, transparent);
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		color: var(--ink-bright);
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1;
	}

	.type-dots {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.type-dot {
		width: 1.5rem;
		height: 1.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: color-mix(in srgb, var(--dot) 24%, var(--night-deep));
		border: 1px solid color-mix(in srgb, var(--dot) 55%, transparent);
		color: var(--ink-bright);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
	}

	.qotd-hook {
		margin: 0 0 0.9rem;
		padding: 0.7rem 0.85rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--accent, var(--lamp-glow)) 26%, transparent);
		background: color-mix(in srgb, var(--accent, var(--lamp-glow)) 10%, var(--night-deep));
		color: var(--ink-bright);
		font-size: 0.92rem;
		font-weight: 600;
	}

	.qotd-cta {
		width: fit-content;
		min-width: 11rem;
	}

	/* ── Stats ────────────────────────────────────────────────────────────── */

	.content-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.9rem;
		align-items: start;
	}

	.stat-row,
	.stat-grid {
		display: grid;
		gap: 0.65rem;
	}

	.stat-row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.stat-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.stat {
		display: grid;
		gap: 0.15rem;
		padding: 0.75rem 0.85rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 14%, transparent);
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
	}

	.stat strong {
		font-family: var(--font-display);
		font-size: 1.6rem;
		line-height: 1;
		color: var(--ink-bright);
	}

	.stat span {
		color: var(--ink-mid);
		font-size: 0.82rem;
	}

	.your-takes {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}

	.your-take {
		display: grid;
		gap: 0.2rem;
		padding: 0.65rem 0.75rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 14%, transparent);
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		text-decoration: none;
	}

	.your-take:hover {
		border-color: color-mix(in srgb, var(--lamp-glow) 40%, transparent);
	}

	.your-take-question {
		color: var(--ink-dim);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		line-clamp: 1;
	}

	.your-take-excerpt {
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.4;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.your-take-meta {
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	/* Quiet-week counterpart to .stat-row. Single figure rather than a row of
	   them: the point is one open invitation, not a scoreboard. */
	.opening {
		display: grid;
		gap: 0.15rem;
		padding: 0.75rem 0.85rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 28%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 7%, transparent);
	}

	.opening strong {
		font-family: var(--font-display);
		font-size: 1.6rem;
		line-height: 1;
		color: var(--ink-bright);
	}

	.opening span {
		color: var(--ink-mid);
		font-size: 0.82rem;
	}

	.opening-note {
		margin: 0.35rem 0 0;
		color: var(--ink-dim);
		font-size: 0.8rem;
	}

	.pulse-types {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.pulse-label {
		color: var(--ink-mid);
		font-size: 0.82rem;
	}

	.corpus-note {
		margin: 0.75rem 0 0;
		color: var(--ink-dim);
		font-size: 0.8rem;
		font-family: var(--font-mono);
	}

	.empty-block {
		display: grid;
		gap: 0.5rem;
		padding: 0.9rem;
		border: 1px dashed color-mix(in srgb, var(--ink-dim) 22%, transparent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		justify-items: start;
	}

	.empty-block strong {
		color: var(--ink-bright);
		font-family: var(--font-mono);
	}

	.empty-block p {
		margin: 0;
		color: var(--ink-mid);
		line-height: 1.5;
	}

	/* ── Notification feed ────────────────────────────────────────────────── */
	#notifications {
		scroll-margin-top: 6rem;
	}

	.unread-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.5rem;
		height: 1.5rem;
		margin-left: 0.4rem;
		padding: 0 0.4rem;
		border-radius: 999px;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		vertical-align: middle;
	}

	.feed-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	.feed-item {
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 14%, transparent);
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		overflow: hidden;
	}

	.feed-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.7rem;
		align-items: start;
		padding: 0.75rem 0.85rem;
		color: inherit;
		text-decoration: none;
	}

	a.feed-row {
		transition: background 0.18s ease;
	}

	a.feed-row:hover {
		background: color-mix(in srgb, var(--lamp-glow) 7%, transparent);
	}

	a.feed-row:focus {
		outline: 2px solid var(--lamp-glow);
		outline-offset: -2px;
	}

	.feed-item.unread {
		border-color: color-mix(in srgb, var(--lamp-glow) 34%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 8%, var(--night-deep));
	}

	.feed-dot {
		width: 0.6rem;
		height: 0.6rem;
		margin-top: 0.4rem;
		border-radius: 999px;
		background: var(--dot);
	}

	.feed-body {
		min-width: 0;
		display: grid;
		gap: 0.25rem;
	}

	.feed-headline {
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.92rem;
		font-weight: 600;
		line-height: 1.35;
	}

	.feed-excerpt {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.86rem;
		line-height: 1.45;
		font-style: italic;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.feed-link {
		color: color-mix(in srgb, var(--lamp-glow) 80%, var(--ink-bright));
		font-size: 0.84rem;
		text-decoration: none;
	}

	a.feed-row:hover .feed-link {
		text-decoration: underline;
	}

	.feed-time {
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		white-space: nowrap;
	}

	/* ── People row ───────────────────────────────────────────────────────── */

	.people-row {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.person-card {
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		padding: 0.7rem 0.5rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 14%, transparent);
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		text-decoration: none;
		text-align: center;
		transition:
			border-color 0.18s ease,
			transform 0.18s ease;
	}

	.person-card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--accent, var(--lamp-glow)) 40%, transparent);
	}

	.person-card img {
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 999px;
		object-fit: cover;
		border: 1px solid color-mix(in srgb, var(--accent, var(--lamp-glow)) 30%, transparent);
	}

	.person-name {
		color: var(--ink-bright);
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.25;
	}

	.person-title {
		color: var(--ink-dim);
		font-size: 0.7rem;
		line-height: 1.3;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	/* ── Lists ────────────────────────────────────────────────────────────── */

	.subscription-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.6rem;
	}

	.subscription-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.75rem;
		align-items: center;
		padding: 0.8rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 14%, transparent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.18s ease,
			background 0.18s ease,
			transform 0.18s ease;
	}

	.subscription-row:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--lamp-glow) 32%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 9%, var(--night-deep));
	}

	.row-text {
		color: var(--ink-bright);
		font-size: 0.92rem;
		line-height: 1.45;
	}

	/* ── Settings ─────────────────────────────────────────────────────────── */

	.settings-panel summary {
		cursor: pointer;
		list-style: none;
	}

	.settings-panel summary::-webkit-details-marker {
		display: none;
	}

	.settings-panel summary::after {
		content: '＋';
		float: right;
		color: var(--ink-dim);
		font-size: 1.1rem;
	}

	.settings-panel[open] summary::after {
		content: '－';
	}

	.settings-body {
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 12%, transparent);
		display: grid;
		gap: 1.1rem;
	}

	.settings-section {
		display: grid;
		gap: 0.5rem;
		justify-items: start;
	}

	.settings-section h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
		color: var(--ink-bright);
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--ink-mid);
		font-size: 0.9rem;
		cursor: pointer;
	}

	.toggle input {
		width: 1.1rem;
		height: 1.1rem;
		accent-color: var(--lamp-glow);
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.field {
		display: grid;
		gap: 0.35rem;
	}

	.field-label {
		font-size: 0.76rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-bright);
	}

	.field input {
		width: 100%;
		padding: 0.75rem 0.85rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 16%, transparent);
		background: color-mix(in srgb, var(--night-deep) 92%, transparent);
		color: var(--ink-bright);
		font-size: 16px;
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.field input::placeholder {
		color: var(--ink-dim);
	}

	.field input:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--lamp-glow) 40%, transparent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--lamp-glow) 12%, transparent);
	}

	.form-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 12%, transparent);
	}

	.action-note {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.88rem;
	}

	.header-actions :global(.account-action),
	.form-actions :global(.account-action) {
		justify-content: center;
	}

	.form-actions :global(.save-button) {
		min-width: 10rem;
	}

	/* ── Responsive ───────────────────────────────────────────────────────── */

	@media (max-width: 960px) {
		.people-row {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 899px) {
		#notifications {
			scroll-margin-top: 9rem;
		}
	}

	@media (max-width: 720px) {
		.account-page {
			padding: 0.85rem 0.75rem 2.5rem;
		}

		.header-panel,
		.panel {
			padding: 0.95rem;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}

		.panel-head,
		.form-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.identity-panel {
			flex-direction: column;
			align-items: flex-start;
		}

		.field-grid {
			grid-template-columns: 1fr;
		}

		.type-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.header-actions,
		.header-actions form {
			display: grid;
			width: 100%;
		}

		.action-link,
		.text-link,
		.header-actions :global(.account-action),
		.form-actions :global(.account-action) {
			width: 100%;
		}

		.qotd-cta {
			width: 100%;
		}

		.subscription-row {
			grid-template-columns: auto 1fr;
		}

		.feed-row {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.feed-time {
			grid-column: 2;
		}

		.row-action {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.type-card {
			padding-inline: 0.7rem;
		}

		.type-body strong {
			font-size: 0.84rem;
		}

		.type-descriptor {
			display: none;
		}

		.people-row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.stat-grid,
		.stat-row {
			grid-template-columns: 1fr;
		}
	}
</style>
