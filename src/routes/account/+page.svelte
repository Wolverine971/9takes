<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { tick, untrack } from 'svelte';
	import {
		Settings,
		ArrowRight,
		ArrowUpRight,
		ChevronDown,
		Bell,
		MessageCircle,
		Heart,
		LogOut,
		UserRound
	} from '@lucide/svelte';
	import { deserialize, enhance } from '$app/forms';
	import { afterNavigate, goto, invalidateAll } from '$app/navigation';
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

	// Keep type names consistent with the rest of the app.
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
		email_digest: true,
		email_replies: true
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

	let firstName = $state(untrack(() => normalizeText(user.first_name)));
	let lastName = $state(untrack(() => normalizeText(user.last_name)));
	let enneagram = $state(
		untrack(() =>
			/^[1-9]$/.test(normalizeText(user.enneagram)) ? normalizeText(user.enneagram) : ''
		)
	);
	let saving = $state(false);
	let loggingOut = $state(false);
	let showTypePicker = $state(false);
	let settingsOpen = $state(false);
	let settingsHeading: HTMLHeadingElement;
	let settingsButton: HTMLButtonElement;
	let activityExpanded = $state(false);
	let activitySection: HTMLElement;
	let refreshingActivity = $state(false);
	let failedPortraits = $state<Record<string, boolean>>({});
	let markingRead = $state(false);
	let savingPrefs = $state(false);
	let profileSnapshot = $state<ProfileSnapshot>(
		untrack(() => ({ firstName, lastName, enneagram }))
	);
	// A comparison cache, not UI state. Updating it after a save must not
	// re-run hydration with the previous server data and erase the saved type.
	let lastLoadedSignature = '';

	// Local copies so mark-as-read and preference toggles feel instant without a
	// full invalidation round trip.
	let feedItems = $state<NotificationRow[]>(
		untrack(() => [...((data.notifications?.items ?? []) as NotificationRow[])])
	);
	let unreadCount = $state(untrack(() => data.notifications?.unread ?? 0));
	let prefs = $state({ ...DEFAULT_NOTIFICATION_PREFERENCES });

	let notificationsAvailable = $derived(data.notifications?.available ?? false);
	let hasType = $derived(/^[1-9]$/.test(profileSnapshot.enneagram));
	let selectedType = $derived(
		enneagramTypes.find((type) => String(type.num) === profileSnapshot.enneagram) ?? null
	);
	let displayName = $derived(
		[user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'there'
	);
	let formChanged = $derived(
		firstName.trim() !== profileSnapshot.firstName ||
			lastName.trim() !== profileSnapshot.lastName ||
			enneagram.trim() !== profileSnapshot.enneagram
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

		for (const item of [...feedItems].sort(
			(a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id
		)) {
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

	let visibleFeedGroups = $derived(activityExpanded ? feedGroups : feedGroups.slice(0, 3));

	async function toggleActivity() {
		activityExpanded = !activityExpanded;
		await tick();
		activitySection?.scrollIntoView?.({ block: 'start', behavior: 'instant' });
		if (!activityExpanded || refreshingActivity) return;
		refreshingActivity = true;
		try {
			await invalidateAll();
		} catch {
			toast.danger('Could not refresh activity. Showing your last loaded activity.', 3000);
		} finally {
			refreshingActivity = false;
		}
	}

	afterNavigate(({ to }) => {
		if (to?.url.hash === '#notifications') settingsOpen = false;
	});

	async function toggleSettings() {
		settingsOpen = !settingsOpen;
		await tick();
		if (settingsOpen) settingsHeading?.focus();
		else settingsButton?.focus();
	}

	function cancelTypeChange() {
		enneagram = profileSnapshot.enneagram;
		showTypePicker = false;
	}

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
			const response = await fetch('?/updateAccount', {
				method: 'POST',
				body,
				headers: { accept: 'application/json', 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await response.text());

			if (!response.ok || result.type !== 'success' || result.data?.success !== true) {
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
			await invalidateAll();
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
			const response = await fetch('?/updateNotificationPreferences', {
				method: 'POST',
				body,
				headers: { accept: 'application/json', 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await response.text());
			if (!response.ok || result.type !== 'success' || result.data?.success !== true) {
				throw new Error(`Failed to save notification settings (${response.status})`);
			}
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
		showTypePicker = true;
		enneagram = String(num);
	}
</script>

<svelte:head><title>Your account | 9takes</title></svelte:head>

{#snippet notificationContent(group: FeedGroup)}
	<span class="feed-icon" class:unread={group.unread} aria-hidden="true">
		{#if group.kind === 'like_on_take'}<Heart size={18} />{:else}<MessageCircle size={18} />{/if}
	</span>
	<span class="feed-body">
		<span class="feed-headline">{groupHeadline(group)}</span>
		{#if group.questionText}<span class="feed-question">{group.questionText}</span>{/if}
		{#if group.excerpt && group.kind !== 'take_on_answered_question'}<span class="feed-excerpt"
				>“{group.excerpt}”</span
			>{/if}
		<time class="feed-time" datetime={group.createdAt}>{relativeTime(group.createdAt)}</time>
	</span>
	<span class="feed-end" aria-hidden="true"
		>{#if group.unread}<span class="unread-dot"></span>{/if}<ArrowUpRight size={16} /></span
	>
{/snippet}

<div class="account-page">
	<div class="account-shell">
		<header class="page-head">
			<div class="page-head-copy">
				<p class="kicker">Your corner of 9takes</p>
				<h1>Welcome back, {displayName}</h1>
				<p class="page-sub">A place for your perspective. And a few that might change it.</p>
			</div>
			<div class="page-head-actions">
				{#if user.admin}<a href={resolve('/admin')} class="admin-link"
						>Admin <ArrowUpRight size={15} aria-hidden="true" /></a
					>{/if}
				<button
					type="button"
					class="settings-button"
					bind:this={settingsButton}
					aria-expanded={settingsOpen}
					aria-controls="account-settings"
					onclick={toggleSettings}
					><Settings size={18} aria-hidden="true" /><span>Settings</span></button
				>
				<form action={resolve('/logout')} method="POST" use:enhance={submitLogout}>
					<Button type="submit" variant="secondary" size="md" loading={loggingOut}>
						{#snippet icon()}<LogOut size={18} aria-hidden="true" />{/snippet}
						{loggingOut ? 'Signing out…' : 'Sign out'}
					</Button>
				</form>
			</div>
		</header>
		<section
			id="account-settings"
			class="account-panel settings-panel"
			hidden={!settingsOpen}
			aria-labelledby="settings-heading"
		>
			<div class="section-head">
				<div>
					<p class="kicker">Make yourself at home</p>
					<h2 id="settings-heading" tabindex="-1" bind:this={settingsHeading}>Account settings</h2>
				</div>
				<button type="button" class="settings-button" onclick={toggleSettings}
					>Back to overview <ArrowRight size={16} aria-hidden="true" /></button
				>
			</div>
			<div class="settings-body">
				<div class="settings-section">
					<h3>Profile</h3>
					<p class="muted small">Your name and the perspective you bring.</p>
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

					<label class="field type-select">
						<span class="field-label">Enneagram type</span>
						<select bind:value={enneagram}>
							<option value="">Not sure yet</option>
							{#each enneagramTypes as type (type.num)}
								<option value={String(type.num)}>Type {type.num} · The {type.name}</option>
							{/each}
						</select>
					</label>
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
							{formChanged ? 'You have unsaved changes.' : 'Your profile is up to date.'}
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

						<!-- The email rides on the in-app reply_to_take notification row, so
						     it cannot fire while that switch is off. Disabling (not hiding)
						     keeps the stored choice intact. -->
						<label class="toggle toggle-group-heading">
							<input
								type="checkbox"
								bind:checked={prefs.email_replies}
								disabled={!prefs.reply_to_take}
							/>
							<span>Email me when someone replies to my take</span>
						</label>
						<p class="muted small">
							{#if prefs.reply_to_take}
								One email per direct reply, with a link straight to the conversation. Every email
								has a one-click off switch.
							{:else}
								Turn on "Someone replies to my take" above to get these emails.
							{/if}
						</p>

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
							{#each subscriptions as subscription (subscription.questions.url)}
								<li>
									<a
										href={resolve(`/questions/${subscription.questions.url}`)}
										class="row question-row"
									>
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
					<a href={resolve('/account/unsubscribe')} class="link">Email preferences</a>
				</div>
			</div>
		</section>
		<div class="overview" hidden={settingsOpen}>
			<section class="profile-panel" aria-label="Your profile">
				<div class="identity">
					<span class="type-mark" aria-hidden="true"
						>{#if hasType && selectedType}{selectedType.num}{:else}<UserRound
								size={30}
							/>{/if}</span
					>
					<div class="identity-copy">
						<p class="eyebrow">Your perspective</p>
						{#if hasType && selectedType}<h2>Type {selectedType.num} · The {selectedType.name}</h2>
							<p class="muted">{selectedType.descriptor}</p>
						{:else}<h2>Start with your Enneagram type</h2>
							<p class="muted">
								Find familiar perspectives and discover what makes yours different.
							</p>{/if}
						<div class="identity-links">
							{#if hasType && selectedType}<a
									href={resolve(`/enneagram-corner/enneagram-type-${selectedType.num}`)}
									>Explore your type <ArrowRight size={14} aria-hidden="true" /></a
								><button
									type="button"
									class="link-button"
									onclick={() => (showTypePicker ? cancelTypeChange() : (showTypePicker = true))}
									aria-expanded={showTypePicker}>Change type</button
								>
							{:else}<a href={resolve('/enneagram-test')}
									>Not sure? Take the test <ArrowRight size={14} aria-hidden="true" /></a
								>{/if}
						</div>
					</div>
				</div>
				<dl class="profile-stats">
					<div>
						<dt>{stats.takes}</dt>
						<dd>{stats.takes === 1 ? 'Take' : 'Takes'}</dd>
					</div>
					<div>
						<dt>{stats.questions}</dt>
						<dd>{stats.questions === 1 ? 'Question' : 'Questions'}</dd>
					</div>
					<div>
						<dt>{stats.repliesReceived}</dt>
						<dd>{stats.repliesReceived === 1 ? 'Reply' : 'Replies'}</dd>
					</div>
					<div>
						<dt>{stats.likesReceived}</dt>
						<dd>{stats.likesReceived === 1 ? 'Like' : 'Likes'}</dd>
					</div>
				</dl>
				{#if !hasType || showTypePicker}
					<section class="type-picker">
						<div class="section-head">
							<h2>Pick your type</h2>
							{#if formChanged}
								<span class="pill">Unsaved</span>
							{/if}
						</div>

						<div class="type-grid" role="group" aria-label="Enneagram type">
							{#each enneagramTypes as type (type.num)}
								<label class="type-option" class:selected={enneagram === String(type.num)}>
									<input
										type="radio"
										name="enneagram-type"
										value={String(type.num)}
										checked={enneagram === String(type.num)}
										onchange={() => selectType(type.num)}
									/>
									<span class="type-number">{type.num}</span>
									<span class="type-body">
										<strong>{type.name}</strong>
										<span class="type-descriptor">{type.descriptor}</span>
									</span>
								</label>
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
							{#if profileSnapshot.enneagram}<button
									type="button"
									class="link-button"
									onclick={cancelTypeChange}>Cancel</button
								>{/if}
							<p class="muted small" role="status">
								{formChanged ? 'Save to lock this in.' : 'Choose the type that fits you best.'}
							</p>
						</div>
					</section>
				{/if}
			</section>
			<div class="dashboard-grid">
				<div class="main-column">
					<section
						id="notifications"
						bind:this={activitySection}
						class="account-panel activity-panel"
						aria-labelledby="notifications-heading"
					>
						<div class="section-head">
							<div class="heading-with-icon">
								<Bell size={20} aria-hidden="true" />
								<h2 id="notifications-heading">Activity</h2>
								{#if unreadCount > 0}<span class="badge">{unreadCount} new</span>{/if}
							</div>
							{#if unreadCount > 0}<button
									type="button"
									class="link-button"
									onclick={markAllRead}
									disabled={markingRead}>{markingRead ? 'Marking…' : 'Mark all read'}</button
								>{/if}
						</div>
						{#if !notificationsAvailable || !feedGroups.length}
							<div class="empty-state">
								<span class="empty-icon"><MessageCircle size={24} aria-hidden="true" /></span>
								<h3>
									{notificationsAvailable
										? 'Your conversations start here'
										: 'Activity is temporarily unavailable'}
								</h3>
								<p class="muted">
									{notificationsAvailable
										? 'Replies, likes, and new perspectives on your questions will appear here.'
										: 'Your profile and recent takes are still available. Try refreshing in a moment.'}
								</p>
								<a href={resolve('/questions')} class="link"
									>Find a conversation <ArrowRight size={15} aria-hidden="true" /></a
								>
							</div>
						{:else}
							<p class="section-description">The latest from your conversations.</p>
							<ul class="activity-list" id="activity-feed" aria-busy={refreshingActivity}>
								{#each visibleFeedGroups as group (group.key)}<li
										class="feed-item"
										class:unread={group.unread}
									>
										{#if group.questionUrl}<a
												href={resolve(`/questions/${group.questionUrl}`)}
												class="feed-row"
												onclick={(event) => openNotification(event, group)}
												>{@render notificationContent(group)}</a
											>
										{:else}<div class="feed-row">{@render notificationContent(group)}</div>{/if}
									</li>{/each}
							</ul>
							{#if feedGroups.length > 3}<button
									type="button"
									class="activity-toggle"
									aria-expanded={activityExpanded}
									aria-controls="activity-feed"
									onclick={toggleActivity}
									><span>{activityExpanded ? 'Show less activity' : 'Show all activity'}</span><span
										class="toggle-meta">{refreshingActivity ? 'Refreshing…' : 'Newest first'}</span
									><span class:rotated={activityExpanded}
										><ChevronDown size={17} aria-hidden="true" /></span
									></button
								>{/if}
						{/if}
					</section>
					<section class="account-panel recent-takes" aria-labelledby="takes-heading">
						<div class="section-head">
							<h2 id="takes-heading">Your recent takes</h2>
							<span class="subtle-label">Your perspective, in your words</span>
						</div>
						{#if yourTakes.length}<ul class="rows">
								{#each yourTakes as take (take.id)}<li>
										<a href={resolve(`/questions/${take.questionUrl}`)} class="take-row"
											><span class="take-question">{take.questionText}</span><span
												class="take-excerpt">“{take.excerpt}”</span
											><span class="take-meta"
												><time datetime={take.createdAt}>{relativeTime(take.createdAt)}</time
												>{#if take.replyCount}<span
														>{take.replyCount} {take.replyCount === 1 ? 'reply' : 'replies'}</span
													>{/if}{#if take.likeCount}<span
														>{take.likeCount} {take.likeCount === 1 ? 'like' : 'likes'}</span
													>{/if}</span
											><ArrowUpRight size={16} aria-hidden="true" /></a
										>
									</li>{/each}
							</ul>
						{:else}<p class="muted">
								You have a perspective no one else does. Give it a place to land.
							</p>
							<a
								href={resolve(
									questionOfTheDay ? `/questions/${questionOfTheDay.url}` : '/questions'
								)}
								class="link first-take"
								>Share your first take <ArrowRight size={15} aria-hidden="true" /></a
							>{/if}
					</section>
				</div>
				<aside class="side-column" aria-label="Explore the community">
					{#if questionOfTheDay}<section class="account-panel feature">
							<p class="kicker">A question for you</p>
							<h2 class="feature-question">{questionOfTheDay.text}</h2>
							<p class="feature-meta">
								{questionOfTheDay.takeCount > 0
									? `${questionOfTheDay.takeCount} ${questionOfTheDay.takeCount === 1 ? 'take' : 'takes'} so far`
									: 'Be the first to weigh in.'}
							</p>
							{#if questionOfTheDay.yourTypeMissing && selectedType}<p class="perspective-note">
									This conversation is missing a Type {selectedType.num} perspective.
								</p>{/if}<a
								href={resolve(`/questions/${questionOfTheDay.url}`)}
								class="primary-button">Add your take <ArrowRight size={17} aria-hidden="true" /></a
							>
						</section>{/if}
					<section class="community-section">
						<div class="section-head">
							<h2>In the community</h2>
							<a href={resolve('/questions')} class="icon-link" aria-label="Browse all questions"
								><ArrowUpRight size={18} aria-hidden="true" /></a
							>
						</div>
						{#if roomLively}<p class="community-copy">
								<strong>{pulse.newTakes7d} new takes</strong> on {pulse.newQuestions7d} new {pulse.newQuestions7d ===
								1
									? 'question'
									: 'questions'} this week.
							</p>
						{:else if pulse.questionsAwaitingFirstTake > 0}<p class="community-copy">
								<strong>{pulse.questionsAwaitingFirstTake} questions</strong> are waiting for a first
								perspective. One could be yours.
							</p>
						{:else}<p class="community-copy">
								A good question opens up a new way of seeing things.
							</p>{/if}
						{#if pulse.activeTypes7d.length}<div class="chip-line">
								<span>Active types</span>{#each pulse.activeTypes7d as type (type)}<span
										class="chip">{type}</span
									>{/each}
							</div>{/if}
						{#if activeQuestions.length}<p class="eyebrow community-label">
								Conversations picking up
							</p>
							<ul class="rows">
								{#each activeQuestions as question (question.id)}<li>
										<a href={resolve(`/questions/${question.url}`)} class="question-row"
											><span>{question.text}</span><span class="take-meta"
												>{question.recentTakes}
												{question.recentTakes === 1 ? 'recent take' : 'recent takes'}
												<ArrowUpRight size={13} aria-hidden="true" /></span
											></a
										>
									</li>{/each}
							</ul>{/if}
						<a href={resolve('/questions')} class="link browse-link"
							>Explore questions <ArrowRight size={15} aria-hidden="true" /></a
						>
					</section>
				</aside>
			</div>
			{#if sharedTypePeople.length && selectedType}
				<section class="people-section" aria-labelledby="people-heading">
					<div class="section-head">
						<div>
							<p class="kicker">A familiar perspective</p>
							<h2 id="people-heading">Type {selectedType.num}s we've analyzed</h2>
							<p class="section-description">
								Different lives. A few patterns you might recognize.
							</p>
						</div>
						<a href={resolve(`/personality-analysis/type/${selectedType.num}`)} class="link"
							>See all Type {selectedType.num}s <ArrowRight size={16} aria-hidden="true" /></a
						>
					</div>
					<ul class="people">
						{#each sharedTypePeople as person (person.slug)}<li>
								<a href={resolve(`/personality-analysis/${person.slug}`)} class="person"
									><div class="portrait">
										{#if !failedPortraits[person.slug]}<img
												src={person.imagePath}
												alt=""
												loading="lazy"
												width="320"
												height="400"
												onerror={() => (failedPortraits[person.slug] = true)}
											/>{:else}<span class="portrait-fallback" aria-hidden="true"
												>{person.name
													.split(' ')
													.map((part) => part[0])
													.slice(0, 2)
													.join('')}</span
											>{/if}<span class="portrait-link" aria-hidden="true"
											><ArrowUpRight size={17} /></span
										>
									</div>
									<span class="person-name">{person.name}</span>{#if person.personaTitle}<span
											class="person-title">{person.personaTitle}</span
										>{/if}<span class="person-cta"
										>Read the profile <ArrowRight size={13} aria-hidden="true" /></span
									></a
								>
							</li>{/each}
					</ul>
				</section>
			{/if}
		</div>
	</div>
</div>

<style>
	.account-page {
		--line: color-mix(in srgb, var(--ink-dim) 28%, transparent);
		--line-soft: color-mix(in srgb, var(--ink-dim) 16%, transparent);
		min-height: 80vh;
		padding: 3rem 2rem 5rem;
		background: var(--night-deep);
		color: var(--ink-bright);
	}
	.account-shell {
		max-width: 1160px;
		margin: 0 auto;
	}
	.account-page [hidden] {
		display: none !important;
	}
	.page-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 2rem;
	}
	.page-head-copy,
	.identity-copy,
	.main-column,
	.side-column {
		min-width: 0;
	}
	.kicker,
	.eyebrow {
		margin: 0 0 0.65rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.11em;
		line-height: 1.5;
		text-transform: uppercase;
	}
	.kicker {
		color: var(--lamp-glow);
	}
	.eyebrow {
		color: var(--ink-mid);
	}
	h1,
	h2,
	h3,
	p {
		overflow-wrap: anywhere;
	}
	h1,
	h2,
	h3 {
		font-family: var(--font-display);
		color: var(--ink-bright);
		padding: 0;
	}
	h1 {
		margin: 0;
		font-size: clamp(1.65rem, 3vw, 2.1rem);
		letter-spacing: -0.045em;
		font-weight: 650;
		line-height: 1.2;
	}
	h2 {
		margin: 0;
		font-size: 1.08rem;
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.4;
	}
	h3 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
	}
	.page-sub {
		margin: 0.65rem 0 0;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.page-head-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}
	.page-head-actions form {
		display: flex;
		margin: 0;
	}
	a {
		color: var(--lamp-glow);
		text-decoration: none;
	}
	button {
		font-family: inherit;
	}
	a,
	button,
	input,
	select {
		-webkit-tap-highlight-color: transparent;
	}
	a:focus-visible,
	button:focus-visible,
	input:focus-visible,
	select:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 4px;
	}
	.link,
	.link-button,
	.admin-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 2.75rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
	}
	.link-button {
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--ink-mid);
		cursor: pointer;
	}
	.link-button:hover,
	.admin-link:hover {
		color: var(--lamp-glow);
	}
	.link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.link-button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.admin-link {
		color: var(--ink-mid);
	}
	.settings-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		min-height: 2.75rem;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		background: var(--stone-warm);
		color: var(--ink-bright);
		font-size: 0.82rem;
		font-weight: 550;
		cursor: pointer;
	}
	.settings-button:hover,
	.settings-button[aria-expanded='true'] {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-glow) 5%, var(--stone-warm));
	}
	.overview {
		display: grid;
		gap: 2rem;
	}
	.profile-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1.75rem;
		padding: 1.6rem 1.75rem;
		border: 1px solid var(--line);
		border-radius: 1rem;
		background: var(--stone-warm);
	}
	.identity {
		display: flex;
		align-items: center;
		gap: 1.2rem;
		min-width: 0;
	}
	.type-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 4.5rem;
		height: 4.5rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 30%, var(--line));
		border-radius: 1rem;
		background: color-mix(in srgb, var(--lamp-glow) 7%, var(--stone-warm));
		color: var(--lamp-glow);
		font-family: var(--font-display);
		font-size: 2.4rem;
		font-weight: 500;
	}
	.identity .eyebrow {
		margin-bottom: 0.3rem;
		font-size: 0.6rem;
	}
	.identity h2 {
		font-size: 1.15rem;
	}
	.muted {
		margin: 0.4rem 0 0;
		color: var(--ink-mid);
		font-size: 0.88rem;
		line-height: 1.65;
	}
	.muted.small {
		font-size: 0.8rem;
	}
	.identity .muted {
		font-size: 0.8rem;
	}
	.identity-links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-top: 0.25rem;
	}
	.identity-links a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2rem;
		font-size: 0.76rem;
		font-weight: 500;
	}
	.identity-links .link-button {
		min-height: 2rem;
		font-size: 0.76rem;
	}
	.profile-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(3.2rem, 1fr));
		gap: 1.5rem;
		margin: 0;
		padding-left: 2rem;
		border-left: 1px solid var(--line);
		text-align: center;
	}
	.profile-stats dt {
		color: var(--ink-bright);
		font-size: 1.6rem;
		font-weight: 550;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
		line-height: 1.3;
	}
	.profile-stats dd {
		margin: 0.3rem 0 0;
		color: var(--ink-mid);
		font-size: 0.72rem;
	}
	.dashboard-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
		gap: 1.5rem;
		align-items: start;
	}
	.main-column,
	.side-column {
		display: grid;
		gap: 1.5rem;
	}
	.account-panel {
		padding: 1.5rem;
		border: 1px solid var(--line);
		border-radius: 1rem;
		background: var(--stone-warm);
		min-width: 0;
	}
	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	.heading-with-icon {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}
	.heading-with-icon > :global(svg) {
		color: var(--ink-mid);
		flex-shrink: 0;
	}
	.section-description {
		margin: 0.4rem 0 0;
		color: var(--ink-mid);
		font-size: 0.82rem;
		line-height: 1.5;
	}
	.badge,
	.pill {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.63rem;
		white-space: nowrap;
	}
	.badge {
		background: color-mix(in srgb, var(--lamp-glow) 12%, transparent);
		color: var(--lamp-glow);
	}
	.pill {
		color: var(--ink-mid);
		border: 1px solid var(--line);
	}
	#notifications {
		scroll-margin-top: 7rem;
	}
	.activity-list,
	.rows,
	.people {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.activity-list {
		margin-top: 1rem;
	}
	.feed-item + .feed-item {
		border-top: 1px solid var(--line-soft);
	}
	.feed-row {
		display: grid;
		grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
		gap: 0.85rem;
		padding: 1.15rem 0;
		color: inherit;
	}
	.feed-row:hover .feed-question {
		color: var(--lamp-glow);
	}
	.feed-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--line-soft);
		border-radius: 0.625rem;
		color: var(--ink-mid);
		background: var(--night-deep);
	}
	.feed-icon.unread {
		color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-glow) 6%, var(--stone-warm));
		border-color: color-mix(in srgb, var(--lamp-glow) 20%, var(--line-soft));
	}
	.feed-body {
		display: grid;
		min-width: 0;
		gap: 0.35rem;
	}
	.feed-headline {
		font-size: 0.73rem;
		line-height: 1.45;
		color: var(--ink-mid);
	}
	.feed-question {
		color: var(--ink-bright);
		font-size: 0.91rem;
		line-height: 1.5;
		font-weight: 550;
		overflow-wrap: anywhere;
	}
	.feed-excerpt {
		color: var(--ink-mid);
		font-size: 0.82rem;
		line-height: 1.55;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	.feed-time {
		margin-top: 0.15rem;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		color: var(--ink-mid);
	}
	.feed-end {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8rem;
		padding-top: 0.4rem;
		color: var(--ink-dim);
	}
	.unread-dot {
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 999px;
		background: var(--lamp-glow);
	}
	.activity-toggle {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.85rem 0 0;
		border: 0;
		border-top: 1px solid var(--line-soft);
		background: transparent;
		color: var(--ink-bright);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
	}
	.toggle-meta {
		margin-left: auto;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 400;
	}
	.activity-toggle > span:last-child {
		display: flex;
		transition: transform 160ms ease;
	}
	.rotated {
		transform: rotate(180deg);
	}
	.empty-state {
		display: grid;
		justify-items: center;
		text-align: center;
		padding: 2rem 1rem 1rem;
	}
	.empty-icon {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		margin-bottom: 1rem;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		color: var(--ink-mid);
	}
	.empty-state p {
		max-width: 24rem;
	}
	.empty-state .link {
		margin-top: 0.75rem;
	}
	.feature {
		border-color: color-mix(in srgb, var(--lamp-glow) 28%, var(--line));
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lamp-glow) 7%, var(--stone-warm)),
			var(--stone-warm)
		);
		padding: 1.75rem;
	}
	.feature .kicker {
		margin-bottom: 1.1rem;
	}
	.feature .feature-question {
		font-size: 1.35rem;
		line-height: 1.4;
		letter-spacing: -0.035em;
		font-weight: 600;
	}
	.feature-meta {
		margin: 0.9rem 0 0;
		color: var(--ink-mid);
		font-size: 0.75rem;
	}
	.perspective-note {
		margin: 1rem 0 0;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in srgb, var(--lamp-glow) 15%, transparent);
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.6;
	}
	.primary-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem;
		min-height: 2.85rem;
		margin-top: 1.4rem;
		padding: 0.75rem 1rem;
		border-radius: 0.625rem;
		color: var(--text-on-primary);
		background: var(--lamp-glow);
		font-size: 0.85rem;
		font-weight: 600;
	}
	.primary-button:hover {
		background: var(--lamp-light);
	}
	.subtle-label {
		color: var(--ink-mid);
		font-size: 0.68rem;
	}
	.recent-takes .rows {
		margin-top: 0.8rem;
	}
	.rows li + li {
		border-top: 1px solid var(--line-soft);
	}
	.take-row {
		position: relative;
		display: grid;
		gap: 0.45rem;
		padding: 1rem 1.4rem 1rem 0;
		color: inherit;
	}
	.take-row > :global(svg) {
		position: absolute;
		right: 0;
		top: 1.2rem;
		color: var(--ink-dim);
	}
	.take-question {
		color: var(--ink-bright);
		font-size: 0.87rem;
		font-weight: 550;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}
	.take-excerpt {
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.6;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	.take-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem;
		color: var(--ink-mid);
		font-size: 0.65rem;
		line-height: 1.6;
	}
	.take-row:hover .take-question {
		color: var(--lamp-glow);
	}
	.first-take {
		margin-top: 0.75rem;
	}
	.community-section {
		padding: 0.5rem 0.5rem 0;
	}
	.community-section h2 {
		font-size: 0.95rem;
	}
	.icon-link {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		color: var(--ink-mid);
	}
	.community-copy {
		margin: 0.35rem 0 0;
		color: var(--ink-mid);
		font-size: 0.83rem;
		line-height: 1.7;
	}
	.community-copy strong {
		color: var(--ink-bright);
		font-weight: 550;
	}
	.chip-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		margin-top: 1rem;
		color: var(--ink-mid);
		font-size: 0.7rem;
	}
	.chip-line > span:first-child {
		margin-right: 0.3rem;
	}
	.chip {
		display: inline-grid;
		place-items: center;
		height: 1.4rem;
		width: 1.4rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.63rem;
	}
	.community-label {
		margin: 1.6rem 0 0.4rem;
		font-size: 0.6rem;
	}
	.question-row {
		display: grid;
		gap: 0.45rem;
		padding: 0.85rem 0;
		color: var(--ink-bright);
		font-size: 0.8rem;
		font-weight: 450;
		line-height: 1.55;
		overflow-wrap: anywhere;
	}
	.question-row:hover {
		color: var(--lamp-glow);
	}
	.browse-link {
		margin-top: 0.4rem;
	}
	.people-section {
		padding-top: 0.5rem;
	}
	.people-section h2 {
		font-size: 1.3rem;
	}
	.people-section .kicker {
		margin-bottom: 0.4rem;
	}
	.people-section .section-head {
		margin-bottom: 1.5rem;
		align-items: flex-end;
	}
	.people-section .link {
		flex-shrink: 0;
	}
	.people {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 1rem;
	}
	.people li {
		min-width: 0;
	}
	.person {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: inherit;
	}
	.portrait {
		position: relative;
		overflow: hidden;
		aspect-ratio: 4 / 5;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		background: var(--stone-warm);
	}
	.portrait img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 25%;
		transition: transform 200ms ease;
	}
	.portrait-link {
		position: absolute;
		bottom: 0.6rem;
		right: 0.6rem;
		display: grid;
		place-items: center;
		width: 1.85rem;
		height: 1.85rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--stone-warm);
		color: var(--ink-bright);
	}
	.person:hover img {
		transform: scale(1.04);
	}
	.person:hover .person-name {
		color: var(--lamp-glow);
	}
	.person-name {
		margin-top: 0.8rem;
		color: var(--ink-bright);
		font-size: 0.86rem;
		line-height: 1.4;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.person-title {
		margin-top: 0.3rem;
		color: var(--ink-mid);
		font-size: 0.72rem;
		line-height: 1.5;
	}
	.person-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding-top: 0.8rem;
		margin-top: auto;
		font-size: 0.65rem;
		color: var(--lamp-glow);
	}
	.portrait-fallback {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		color: var(--ink-mid);
		font-family: var(--font-display);
		font-size: 2.5rem;
		background: linear-gradient(135deg, var(--stone-warm), var(--night-deep));
	}
	.type-picker {
		grid-column: 1 / -1;
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
	}
	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
		margin-top: 1rem;
	}
	.type-option {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		cursor: pointer;
	}
	.type-option.selected {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-glow) 6%, transparent);
	}
	.type-option:focus-within {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 3px;
	}
	.type-option input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.type-number {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 1.75rem;
		height: 1.75rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--lamp-glow);
	}
	.type-body {
		display: grid;
		gap: 0.2rem;
	}
	.type-body strong {
		font-size: 0.85rem;
		font-weight: 550;
	}
	.type-descriptor {
		color: var(--ink-mid);
		font-size: 0.73rem;
		line-height: 1.5;
	}
	.form-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		width: 100%;
		margin-top: 1rem;
	}
	.form-actions .muted {
		margin: 0;
	}
	.settings-panel {
		padding: 2rem;
	}
	.settings-body {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem 3rem;
		padding-top: 2rem;
		margin-top: 1.5rem;
		border-top: 1px solid var(--line);
	}
	.settings-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		min-width: 0;
	}
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
		width: 100%;
	}
	.field {
		display: grid;
		gap: 0.4rem;
		min-width: 0;
		width: 100%;
	}
	.field-label {
		color: var(--ink-mid);
		font-size: 0.74rem;
		font-weight: 500;
	}
	.field input,
	.field select {
		width: 100%;
		min-height: 2.75rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: 0.625rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: inherit;
		font-size: 16px;
	}
	.field input::placeholder {
		color: var(--ink-dim);
	}
	.toggle {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-height: 2.75rem;
		color: var(--ink-bright);
		font-size: 0.82rem;
		line-height: 1.5;
		cursor: pointer;
	}
	.toggle input {
		width: 1.05rem;
		height: 1.05rem;
		flex-shrink: 0;
		accent-color: var(--lamp-glow);
	}
	.toggle input:disabled {
		opacity: 0.55;
	}
	.toggle-group-heading {
		margin-top: 0.75rem;
	}
	.settings-section .rows {
		width: 100%;
	}
	.settings-section .question-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.row-text {
		min-width: 0;
	}
	.row-count {
		flex-shrink: 0;
		color: var(--ink-mid);
		font-size: 0.7rem;
	}
	@media (max-width: 1000px) {
		.profile-panel {
			grid-template-columns: 1fr;
		}
		.profile-stats {
			padding: 1.2rem 0 0;
			border-left: 0;
			border-top: 1px solid var(--line-soft);
		}
		.people {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1.5rem 1rem;
		}
		.dashboard-grid {
			grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		}
		.subtle-label {
			display: none;
		}
	}
	@media (max-width: 720px) {
		.account-page {
			padding: 1.75rem 1rem 3rem;
		}
		.page-head {
			align-items: flex-start;
			flex-direction: column;
			gap: 1rem;
			margin-bottom: 1.5rem;
		}
		.page-head-copy {
			flex: 1;
		}
		.page-head-actions {
			width: 100%;
			gap: 0.5rem;
			justify-content: flex-end;
		}
		.page-head .settings-button {
			width: 2.75rem;
			padding: 0;
		}
		.page-head .settings-button span {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		.admin-link {
			margin-right: auto;
			font-size: 0.7rem;
			min-height: 2rem;
		}
		.page-sub {
			font-size: 0.82rem;
		}
		.kicker {
			font-size: 0.6rem;
		}
		.overview {
			gap: 1.25rem;
		}
		.profile-panel {
			padding: 1.25rem;
			gap: 1.25rem;
		}
		.identity {
			gap: 0.85rem;
			align-items: flex-start;
		}
		.type-mark {
			width: 3.25rem;
			height: 3.25rem;
			font-size: 1.8rem;
		}
		.identity h2 {
			font-size: 1rem;
		}
		.identity-links {
			column-gap: 0.85rem;
		}
		.profile-stats {
			gap: 0.5rem;
		}
		.profile-stats dt {
			font-size: 1.4rem;
		}
		.dashboard-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		.main-column,
		.side-column {
			gap: 1.25rem;
		}
		.account-panel {
			padding: 1.25rem;
		}
		.section-head {
			gap: 0.6rem;
		}
		.heading-with-icon {
			gap: 0.45rem;
		}
		.heading-with-icon > :global(svg) {
			width: 17px;
		}
		.badge {
			font-size: 0.58rem;
		}
		.section-head .link-button {
			font-size: 0.7rem;
		}
		.feed-row {
			grid-template-columns: 1.9rem minmax(0, 1fr) 0.8rem;
			gap: 0.65rem;
		}
		.feed-icon {
			width: 1.9rem;
			height: 1.9rem;
		}
		.feed-question {
			font-size: 0.85rem;
		}
		.feed-excerpt {
			font-size: 0.78rem;
		}
		.feed-headline {
			font-size: 0.68rem;
		}
		.activity-toggle {
			font-size: 0.75rem;
		}
		.toggle-meta {
			font-size: 0.55rem;
		}
		.feature {
			padding: 1.5rem;
		}
		.community-section {
			padding: 0.5rem;
		}
		.people-section {
			padding-top: 1rem;
			border-top: 1px solid var(--line);
		}
		.people-section .section-head {
			flex-wrap: wrap;
			align-items: flex-start;
			gap: 0.35rem;
			margin-bottom: 1rem;
		}
		.people-section h2 {
			font-size: 1.15rem;
		}
		.people {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.5rem 0.8rem;
		}
		.portrait {
			aspect-ratio: 1;
		}
		.type-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.type-option {
			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			padding: 0.75rem;
			gap: 0.5rem;
		}
		.type-body {
			display: contents;
		}
		.type-descriptor {
			grid-column: 1 / -1;
			font-size: 0.67rem;
		}
		.settings-panel > .section-head {
			flex-wrap: wrap;
			gap: 0.75rem;
		}
		.settings-body {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-top: 1rem;
			padding-top: 1.5rem;
		}
		.settings-section + .settings-section {
			padding-top: 1.5rem;
			border-top: 1px solid var(--line-soft);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.portrait img,
		.activity-toggle > span:last-child {
			transition: none;
		}
		.person:hover img {
			transform: none;
		}
	}
</style>
