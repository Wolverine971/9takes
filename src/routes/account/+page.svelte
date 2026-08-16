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

	// Descriptors are page copy; names come from the canonical constant so they
	// cannot drift from the rest of the app. Type COLORS are deliberately not
	// used on this page — see the note at the top of the style block.
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
			descriptor: TYPE_DESCRIPTORS[Number(num)]
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
	<span class="feed-mark" class:on={group.unread} aria-hidden="true"></span>
	<div class="feed-body">
		<p class="feed-headline">{groupHeadline(group)}</p>
		{#if group.excerpt && group.kind !== 'take_on_answered_question'}
			<p class="feed-excerpt">“{group.excerpt}”</p>
		{/if}
		{#if group.questionText}
			<span class="feed-question">{group.questionText}</span>
		{/if}
	</div>
	<time class="feed-time" datetime={group.createdAt}>
		{relativeTime(group.createdAt)}
	</time>
{/snippet}

<div class="account-page">
	<div class="account-shell">
		<header class="page-head">
			<div class="page-head-copy">
				<p class="kicker">Account</p>
				<h1>Welcome back, {displayName}</h1>
				<p class="page-sub">{userEmail}</p>
			</div>

			<div class="page-head-actions">
				{#if user.admin}
					<a href="/admin" class="quiet-button">Admin</a>
				{/if}

				<form action="/logout" method="POST" use:enhance={submitLogout}>
					<Button
						type="submit"
						variant="secondary"
						size="md"
						loading={loggingOut}
						class="account-action"
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
			<section class="card identity">
				<div class="identity-main">
					<span class="type-mark" aria-hidden="true">{selectedType.num}</span>
					<div class="identity-copy">
						<h2>Type {selectedType.num} · The {selectedType.name}</h2>
						<p class="muted">{selectedType.descriptor}</p>
					</div>
				</div>
				<div class="identity-links">
					<a href={`/enneagram-corner/enneagram-type-${selectedType.num}`}>Type guide</a>
					<a href={`/personality-analysis/type/${selectedType.num}`}>
						Famous Type {selectedType.num}s
					</a>
					<button
						type="button"
						class="link-button"
						onclick={() => (showTypePicker = !showTypePicker)}
					>
						{showTypePicker ? 'Cancel' : 'Change type'}
					</button>
				</div>
			</section>
		{:else}
			<section class="card">
				<h2>You haven't set your type yet</h2>
				<p class="muted">
					Your type is the key to everything else here: which questions need your voice, which takes
					get shown to you, and who else sees the world the way you do. Pick one and the rest of
					this page comes alive.
				</p>
				<p class="muted small">
					Not sure? <a href="/enneagram-test">Take the test</a>. It takes a few minutes.
				</p>
			</section>
		{/if}

		{#if !hasType || showTypePicker}
			<section class="card">
				<div class="card-head">
					<h2>Pick your type</h2>
					{#if formChanged}
						<span class="pill">Unsaved</span>
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
					<p class="muted small" role="status">
						{formChanged ? 'Save to lock this in.' : 'Choose the type that fits you best.'}
					</p>
				</div>
			</section>
		{/if}

		<!-- ── Question of the day ─────────────────────────────────────────────
		     The page's primary CTA, and the only card that carries the amber.
		     Personalized: never a question you've already answered, and it prefers
		     threads where your type is missing. -->
		{#if questionOfTheDay}
			<section class="card feature">
				<p class="eyebrow">Your question today</p>
				<h2 class="feature-question">{questionOfTheDay.text}</h2>

				<p class="feature-meta">
					{#if questionOfTheDay.takeCount > 0}
						{questionOfTheDay.takeCount}
						{questionOfTheDay.takeCount === 1 ? 'take' : 'takes'} so far
					{:else}
						No takes yet — be first
					{/if}
					{#if questionOfTheDay.yourTypeMissing && selectedType}
						· no Type {selectedType.num} has weighed in
					{/if}
				</p>

				<a href={`/questions/${questionOfTheDay.url}`} class="primary-button">Add your take</a>
			</section>
		{/if}

		<!-- ── Notifications ─────────────────────────────────────────────────
		     Above the counters: coming back to your account, what came back to
		     you beats what you tallied. -->
		{#if notificationsAvailable}
			<section id="notifications" class="card" aria-labelledby="notifications-heading">
				<div class="card-head">
					<h2 id="notifications-heading">
						Activity
						{#if unreadCount > 0}
							<span class="badge">{unreadCount}</span>
						{/if}
					</h2>

					{#if unreadCount > 0}
						<button type="button" class="link-button" onclick={markAllRead} disabled={markingRead}>
							{markingRead ? 'Marking…' : 'Mark all read'}
						</button>
					{/if}
				</div>

				{#if !feedGroups.length}
					<p class="muted">
						When someone replies to your take, likes it, or answers a question you're in, it shows
						up here.
					</p>
				{:else}
					<ul class="rows">
						{#each feedGroups as group (group.key)}
							<li class="feed-item" class:unread={group.unread}>
								{#if group.questionUrl}
									<a
										href={resolve(`/questions/${group.questionUrl}`)}
										class="row feed-row"
										onclick={(event) => openNotification(event, group)}
									>
										{@render notificationContent(group)}
									</a>
								{:else}
									<div class="row feed-row">{@render notificationContent(group)}</div>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}

		<!-- ── Status ──────────────────────────────────────────────────────────
		     Community pulse sits first and personal record second, deliberately:
		     for most accounts the personal column is all zeros, and a page that
		     opens on your own zeros reads as dead. -->
		<div class="two-up">
			<section class="card">
				<div class="card-head">
					<h2>The room</h2>
					<a href="/questions" class="link">Browse</a>
				</div>

				{#if roomLively}
					<dl class="figures">
						<div>
							<dt>{pulse.newQuestions7d}</dt>
							<dd>new {pulse.newQuestions7d === 1 ? 'question' : 'questions'}</dd>
						</div>
						<div>
							<dt>{pulse.newTakes7d}</dt>
							<dd>new {pulse.newTakes7d === 1 ? 'take' : 'takes'}</dd>
						</div>
					</dl>
				{:else}
					<!-- Quiet week. A 7-day counter reading zero is a number the user
					     cannot act on and misreads the place as abandoned; the standing
					     opening is both truer and actionable. -->
					<dl class="figures">
						<div>
							<dt>{pulse.questionsAwaitingFirstTake}</dt>
							<dd>
								{pulse.questionsAwaitingFirstTake === 1 ? 'question is' : 'questions are'} waiting for
								a first take
							</dd>
						</div>
					</dl>
					{#if pulse.questionsAwaitingFirstTake > 0}
						<p class="muted small">
							Out of {pulse.totalQuestions}. Yours would be the first one on the page.
						</p>
					{/if}
				{/if}

				{#if pulse.activeTypes7d.length}
					<p class="chip-line">
						<span class="muted small">Types active this week</span>
						{#each pulse.activeTypes7d as type}
							<span class="chip">{type}</span>
						{/each}
					</p>
				{/if}

				<p class="footnote">
					{roomLively ? 'Last 7 days · ' : ''}{pulse.totalQuestions} questions · {pulse.totalTakes}
					takes all time
				</p>
			</section>

			<section class="card">
				<div class="card-head">
					<h2>Your record</h2>
				</div>

				{#if hasActivity}
					<dl class="figures">
						<div>
							<dt>{stats.takes}</dt>
							<dd>{stats.takes === 1 ? 'take' : 'takes'}</dd>
						</div>
						<div>
							<dt>{stats.questions}</dt>
							<dd>{stats.questions === 1 ? 'question' : 'questions'}</dd>
						</div>
						<div>
							<dt>{stats.repliesReceived}</dt>
							<dd>{stats.repliesReceived === 1 ? 'reply' : 'replies'}</dd>
						</div>
						<div>
							<dt>{stats.likesReceived}</dt>
							<dd>{stats.likesReceived === 1 ? 'like' : 'likes'}</dd>
						</div>
					</dl>

					<!-- The counts say how much; this says what. People come back for
					     their own words and the reply underneath them, so the takes
					     themselves carry more return-pull than the tallies above. -->
					{#if yourTakes.length}
						<ul class="rows">
							{#each yourTakes as take (take.id)}
								<li>
									<a href={`/questions/${take.questionUrl}`} class="row take-row">
										<span class="take-excerpt">{take.excerpt}</span>
										<span class="take-meta">
											{take.questionText}
											{#if take.replyCount}
												· {take.replyCount} {take.replyCount === 1 ? 'reply' : 'replies'}
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
					<p class="muted">Your takes, questions, and the replies they draw will collect here.</p>
					{#if questionOfTheDay}
						<a href={`/questions/${questionOfTheDay.url}`} class="link">Answer your first</a>
					{:else}
						<a href="/questions" class="link">Find a question</a>
					{/if}
				{/if}
			</section>
		</div>

		<!-- ── Others who share your type ──────────────────────────────────── -->
		{#if sharedTypePeople.length && selectedType}
			<section class="card">
				<div class="card-head">
					<h2>Type {selectedType.num}s we've analyzed</h2>
					<a href={`/personality-analysis/type/${selectedType.num}`} class="link">See all</a>
				</div>

				<ul class="people">
					{#each sharedTypePeople as person (person.slug)}
						<li>
							<a href={`/personality-analysis/${person.slug}`} class="person">
								<img
									src={person.imagePath}
									alt=""
									loading="lazy"
									width="64"
									height="64"
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
			<section class="card">
				<div class="card-head">
					<h2>Most answered lately</h2>
					<a href="/questions" class="link">All questions</a>
				</div>

				<ul class="rows">
					{#each activeQuestions as question (question.id)}
						<li>
							<a href={`/questions/${question.url}`} class="row question-row">
								<span class="row-text">{question.text}</span>
								<span class="row-count">
									{question.recentTakes}
									{question.recentTakes === 1 ? 'take' : 'takes'}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- ── Settings ────────────────────────────────────────────────────── -->
		<details class="card settings">
			<summary>
				<h2>Settings</h2>
				<span class="settings-marker" aria-hidden="true"></span>
			</summary>

			<div class="settings-body">
				<div class="settings-section">
					<h3>Profile</h3>
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
						<p class="muted small" role="status">
							{formChanged ? 'Save to commit the current edits.' : 'All fields are in sync.'}
						</p>
					</div>
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
						<p class="muted">
							You're not following any questions. Follow one from its page to get pinged when new
							takes land.
						</p>
					{:else}
						<ul class="rows">
							{#each subscriptions as subscription}
								<li>
									<a href={`/questions/${subscription.questions.url}`} class="row question-row">
										<span class="row-text">
											{subscription.questions.question_formatted || subscription.questions.question}
										</span>
										<span class="row-count">Open</span>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="settings-section">
					<h3>Account</h3>
					<p class="muted">{userEmail}</p>
					<a href="/account/unsubscribe" class="link">Email preferences</a>
				</div>
			</div>
		</details>
	</div>
</div>

<style lang="scss">
	/* One surface, one accent, hairlines instead of nested boxes.
	   Amber (--lamp-glow) is the page's only accent: the kicker, links, the
	   primary CTA, and the unread mark. Enneagram type colors are deliberately
	   not used here — nine accents on one page reads as noise, and the type is
	   already stated in words. */

	.account-page {
		--line: color-mix(in srgb, var(--ink-dim) 26%, transparent);
		--line-soft: color-mix(in srgb, var(--ink-dim) 14%, transparent);

		min-height: 100vh;
		padding: 2rem 1rem 4rem;
		background: var(--night-deep);
	}

	.account-shell {
		max-width: 860px;
		margin: 0 auto;
		display: grid;
		gap: 1rem;
	}

	/* ── Page head ────────────────────────────────────────────────────────── */

	.page-head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		padding-bottom: 1.25rem;
		margin-bottom: 0.25rem;
		border-bottom: 1px solid var(--line);
	}

	.page-head-copy {
		min-width: 0;
	}

	.kicker {
		margin: 0 0 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.page-head h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3.4vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
		color: var(--ink-bright);
	}

	.page-sub {
		margin: 0.35rem 0 0;
		color: var(--ink-mid);
		font-size: 0.9rem;
	}

	.page-head-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* ── Cards ────────────────────────────────────────────────────────────── */

	.card {
		padding: 1.25rem;
		border: 1px solid var(--line-soft);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.card h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		line-height: 1.3;
		color: var(--ink-bright);
	}

	.card h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink-bright);
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 0.9rem;
	}

	.muted {
		margin: 0.5rem 0 0;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.muted.small {
		font-size: 0.82rem;
	}

	.footnote {
		margin: 0.9rem 0 0;
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	.eyebrow {
		margin: 0 0 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	/* ── Links and buttons ────────────────────────────────────────────────── */

	a {
		color: var(--lamp-glow);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.link,
	.link-button {
		border: 0;
		padding: 0;
		background: none;
		color: var(--lamp-glow);
		font-family: inherit;
		font-size: 0.86rem;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
	}

	.link-button:hover:not(:disabled) {
		text-decoration: underline;
	}

	.link-button:disabled {
		color: var(--ink-dim);
		cursor: default;
	}

	.quiet-button {
		display: inline-flex;
		align-items: center;
		min-height: 2.5rem;
		padding: 0 0.9rem;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		color: var(--ink-bright);
		font-size: 0.88rem;
		font-weight: 500;
	}

	.quiet-button:hover {
		border-color: var(--lamp-glow);
		text-decoration: none;
	}

	.primary-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0 1.25rem;
		border-radius: 0.625rem;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.primary-button:hover {
		background: var(--lamp-light);
		text-decoration: none;
	}

	.pill {
		padding: 0.25rem 0.6rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--ink-mid);
		font-size: 0.75rem;
		white-space: nowrap;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.35rem;
		height: 1.35rem;
		margin-left: 0.35rem;
		padding: 0 0.35rem;
		border-radius: 999px;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		vertical-align: 1px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.35rem;
		height: 1.35rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.chip-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		margin: 0.9rem 0 0;
	}

	.chip-line .muted {
		margin: 0 0.2rem 0 0;
	}

	/* ── Identity ─────────────────────────────────────────────────────────── */

	.identity {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.9rem 1.25rem;
	}

	/* Badge and name stay welded together; only the links wrap away from them. */
	.identity-main {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-width: 0;
	}

	.type-mark {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 700;
	}

	.identity-copy {
		min-width: 0;
	}

	.identity-copy .muted {
		margin-top: 0.15rem;
		font-size: 0.85rem;
	}

	.identity-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.9rem;
		font-size: 0.86rem;
	}

	.identity-links a {
		font-size: 0.86rem;
		font-weight: 500;
	}

	/* ── Feature card (question of the day) ───────────────────────────────── */

	.feature {
		border-color: color-mix(in srgb, var(--lamp-glow) 28%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 5%, var(--stone-warm));
	}

	.feature-question {
		font-size: clamp(1.15rem, 2.6vw, 1.45rem) !important;
		font-weight: 700 !important;
		line-height: 1.3 !important;
	}

	.feature-meta {
		margin: 0.6rem 0 1.1rem;
		color: var(--ink-mid);
		font-size: 0.88rem;
	}

	/* ── Type picker ──────────────────────────────────────────────────────── */

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.type-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.6rem;
		align-items: start;
		padding: 0.7rem 0.75rem;
		border: 1px solid var(--line-soft);
		border-radius: 0.625rem;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
	}

	.type-card:hover {
		border-color: var(--line);
	}

	.type-card.selected {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-glow) 8%, transparent);
	}

	.type-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
	}

	.type-card.selected .type-number {
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
	}

	.type-body {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.type-body strong {
		color: var(--ink-bright);
		font-size: 0.88rem;
		font-weight: 600;
		line-height: 1.25;
	}

	.type-descriptor {
		color: var(--ink-mid);
		font-size: 0.76rem;
		line-height: 1.35;
	}

	/* ── Figures ──────────────────────────────────────────────────────────── */

	.figures {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 0;
	}

	.figures div {
		min-width: 0;
	}

	.figures dt {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--ink-bright);
	}

	.figures dd {
		margin: 0.25rem 0 0;
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.35;
	}

	.two-up {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		align-items: start;
	}

	/* ── Rows ─────────────────────────────────────────────────────────────── */

	.rows {
		list-style: none;
		margin: 0.9rem 0 0;
		padding: 0;
		border-top: 1px solid var(--line-soft);
	}

	.rows li {
		border-bottom: 1px solid var(--line-soft);
	}

	.row {
		display: block;
		padding: 0.7rem 0.4rem;
		margin: 0 -0.4rem;
		border-radius: 0.625rem;
		color: inherit;
		text-decoration: none;
	}

	a.row:hover {
		background: color-mix(in srgb, var(--ink-dim) 8%, transparent);
		text-decoration: none;
	}

	a.row:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: -2px;
	}

	.question-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.row-text {
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.row-count {
		flex-shrink: 0;
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		white-space: nowrap;
	}

	.take-row {
		display: grid;
		gap: 0.25rem;
	}

	.take-excerpt {
		color: var(--ink-bright);
		font-size: 0.88rem;
		line-height: 1.45;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.take-meta {
		color: var(--ink-dim);
		font-size: 0.76rem;
		line-height: 1.4;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		line-clamp: 1;
	}

	/* ── Notification feed ────────────────────────────────────────────────── */

	#notifications {
		scroll-margin-top: 6rem;
	}

	.feed-row {
		display: grid;
		grid-template-columns: 0.5rem minmax(0, 1fr) auto;
		gap: 0.7rem;
		align-items: start;
	}

	.feed-mark {
		width: 0.5rem;
		height: 0.5rem;
		margin-top: 0.4rem;
		border-radius: 999px;
		background: transparent;
	}

	.feed-mark.on {
		background: var(--lamp-glow);
	}

	.feed-body {
		min-width: 0;
		display: grid;
		gap: 0.2rem;
	}

	.feed-headline {
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.89rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.feed-item.unread .feed-headline {
		font-weight: 600;
	}

	.feed-excerpt {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.84rem;
		line-height: 1.45;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.feed-question {
		color: var(--ink-dim);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.feed-time {
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		white-space: nowrap;
	}

	/* ── People ───────────────────────────────────────────────────────────── */

	.people {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.person {
		display: grid;
		justify-items: center;
		gap: 0.3rem;
		text-align: center;
		color: inherit;
	}

	.person:hover {
		text-decoration: none;
	}

	.person img {
		width: 3.25rem;
		height: 3.25rem;
		border-radius: 999px;
		object-fit: cover;
		border: 1px solid var(--line);
		transition: border-color 0.15s ease;
	}

	.person:hover img {
		border-color: var(--lamp-glow);
	}

	.person-name {
		color: var(--ink-bright);
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1.25;
	}

	.person-title {
		color: var(--ink-dim);
		font-size: 0.68rem;
		line-height: 1.3;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	/* ── Settings ─────────────────────────────────────────────────────────── */

	.settings summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		list-style: none;
	}

	.settings summary::-webkit-details-marker {
		display: none;
	}

	.settings-marker {
		width: 0.55rem;
		height: 0.55rem;
		border-right: 1.5px solid var(--ink-dim);
		border-bottom: 1.5px solid var(--ink-dim);
		transform: rotate(45deg) translate(-2px, -2px);
		transition: transform 0.15s ease;
	}

	.settings[open] .settings-marker {
		transform: rotate(-135deg) translate(-2px, -2px);
	}

	.settings-body {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--line-soft);
		display: grid;
		gap: 1.75rem;
	}

	.settings-section {
		display: grid;
		gap: 0.6rem;
		justify-items: start;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--ink-bright);
		font-size: 0.88rem;
		cursor: pointer;
	}

	.toggle input {
		width: 1rem;
		height: 1rem;
		accent-color: var(--lamp-glow);
	}

	.field-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.field {
		display: grid;
		gap: 0.35rem;
	}

	.field-label {
		color: var(--ink-mid);
		font-size: 0.76rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.field input {
		width: 100%;
		padding: 0.7rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-size: 16px;
		transition: border-color 0.15s ease;
	}

	.field input::placeholder {
		color: var(--ink-dim);
	}

	.field input:focus {
		outline: none;
		border-color: var(--lamp-glow);
	}

	.form-actions {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.9rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.form-actions .muted {
		margin: 0;
	}

	.settings .rows,
	.settings-section .rows {
		width: 100%;
		margin-top: 0.2rem;
	}

	/* ── Responsive ───────────────────────────────────────────────────────── */

	@media (max-width: 900px) {
		.people {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.account-page {
			padding: 1.25rem 0.85rem 3rem;
		}

		.card {
			padding: 1rem;
		}

		.two-up {
			grid-template-columns: 1fr;
		}

		.page-head {
			align-items: flex-start;
		}

		.page-head-actions,
		.page-head-actions form {
			display: grid;
			width: 100%;
		}

		.quiet-button {
			justify-content: center;
		}

		.primary-button {
			width: 100%;
		}

		.type-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.field-grid {
			grid-template-columns: 1fr;
		}

		#notifications {
			scroll-margin-top: 9rem;
		}
	}

	@media (max-width: 480px) {
		.type-descriptor {
			display: none;
		}

		/* Two lines of headline squeezed beside a timestamp reads as a column of
		   fragments; drop the time under the text instead. */
		.feed-row {
			grid-template-columns: 0.5rem minmax(0, 1fr);
		}

		.feed-time {
			grid-column: 2;
		}

		.people {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.figures {
			gap: 1.1rem;
		}
	}
</style>
