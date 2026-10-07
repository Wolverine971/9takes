<!-- src/lib/components/enneagramTest/InviteSheet.svelte -->
<!--
  "Ask someone who knows you": the friend link on an Enneagram test result.
  The message never names the test-taker's types, because the friend answers
  before seeing them (answer before the crowd). The name field is what the
  friend sees ("Jordan wants your honest read"); it saves on its own.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { Button, Field, Input, Textarea } from '$lib/components/atoms';
	import {
		captureFriendLinkShared,
		type FriendShareMethod
	} from '$lib/analytics/enneagramTestEvents';

	type Props = {
		resultToken: string;
		readToken: string;
		split: boolean;
		initialName: string | null;
	};

	let { resultToken, readToken, split, initialName }: Props = $props();

	// svelte-ignore state_referenced_locally
	let name = $state(initialName ?? '');
	// svelte-ignore state_referenced_locally
	let savedName = $state(initialName ?? '');
	let nameStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let nameError = $state('');
	// svelte-ignore state_referenced_locally
	let message = $state(
		split
			? 'I took an Enneagram test and I’m stuck between two types. Which one am I? It takes 3 minutes, and you answer before you see my two:'
			: 'I took an Enneagram test and I want an outside read before I believe my result. It takes 3 minutes, and you answer before you see what I picked:'
	);
	let copied = $state(false);
	let canShare = $state(false);
	let linkBox: HTMLElement | undefined = $state();
	let nameTimer: ReturnType<typeof setTimeout> | undefined;

	const link = $derived(`${page.url.origin}/enneagram-test/read/${readToken}`);
	const fullMessage = $derived(`${message.trim()} ${link}`);
	const smsHref = $derived(`sms:?&body=${encodeURIComponent(fullMessage)}`);
	const mailHref = $derived(
		`mailto:?subject=${encodeURIComponent('Does this sound like me?')}&body=${encodeURIComponent(fullMessage)}`
	);

	$effect(() => {
		canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
	});

	async function saveName() {
		clearTimeout(nameTimer);
		const next = name.trim();
		if (next === savedName.trim()) return;
		nameStatus = 'saving';
		nameError = '';
		try {
			const response = await fetch(
				`/api/enneagram-test/results/${encodeURIComponent(resultToken)}`,
				{
					method: 'PATCH',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ displayName: next })
				}
			);
			const body = (await response.json().catch(() => null)) as {
				ok?: boolean;
				message?: string;
			} | null;
			if (!response.ok || !body?.ok) throw new Error(body?.message ?? 'We couldn’t save that.');
			savedName = next;
			nameStatus = 'saved';
		} catch (error) {
			nameStatus = 'error';
			nameError = error instanceof Error ? error.message : 'We couldn’t save that.';
		}
	}

	function onNameInput() {
		nameStatus = 'idle';
		clearTimeout(nameTimer);
		nameTimer = setTimeout(saveName, 800);
	}

	function shared(method: FriendShareMethod) {
		void saveName();
		void captureFriendLinkShared(method);
	}

	function selectLink() {
		if (!linkBox) return;
		const range = document.createRange();
		range.selectNodeContents(linkBox);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	}

	function copy() {
		shared('copy');
		try {
			navigator.clipboard.writeText(fullMessage).then(() => {
				copied = true;
				setTimeout(() => (copied = false), 2500);
			}, selectLink);
		} catch {
			selectLink();
		}
	}

	function openApp(method: 'text' | 'email', href: string) {
		shared(method);
		window.location.href = href;
	}

	async function share() {
		shared('share');
		try {
			await navigator.share({ text: message.trim(), url: link });
		} catch {
			// Closing the share sheet rejects; nothing to do.
		}
	}
</script>

<div class="invite">
	<Field
		for="et-invite-name"
		label="What should they call you?"
		optional
		error={nameStatus === 'error' ? nameError : undefined}
		help={nameStatus === 'saved' ? 'Saved. Your friend will see this name.' : undefined}
	>
		<Input
			id="et-invite-name"
			bind:value={name}
			maxlength={40}
			autocomplete="given-name"
			placeholder="e.g. Jordan"
			oninput={onNameInput}
			onblur={saveName}
		/>
	</Field>

	<Field for="et-invite-message" label="Your message">
		<Textarea id="et-invite-message" bind:value={message} rows={4} maxlength={500} />
	</Field>

	<div class="link-row">
		<span class="link-label">Your link</span>
		<span class="link-box" bind:this={linkBox}>{link}</span>
	</div>

	<div class="actions">
		{#if canShare}
			<Button size="lg" fullWidth onclick={share}>Share your link</Button>
			<Button size="lg" variant="secondary" fullWidth onclick={copy}>
				{copied ? 'Copied' : 'Copy message and link'}
			</Button>
		{:else}
			<Button size="lg" fullWidth onclick={copy}>
				{copied ? 'Copied' : 'Copy message and link'}
			</Button>
		{/if}
		<div class="send-row">
			<Button variant="secondary" onclick={() => openApp('text', smsHref)}>Text it</Button>
			<Button variant="secondary" onclick={() => openApp('email', mailHref)}>Email it</Button>
		</div>
	</div>
	<p class="note" role="status">{copied ? 'Copied the message and link.' : ''}</p>
</div>

<style>
	.invite {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.link-row {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	/* Matches the Field atom's label so the three rows read as one form. */
	.link-label {
		color: var(--ink-bright);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.link-box {
		padding: 0.6rem 0.8rem;
		border: 1px dashed var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		overflow-wrap: anywhere;
		user-select: all;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.send-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}

	.note {
		min-height: 1.2em;
		margin: 0;
		font-size: 0.88rem;
		color: var(--ink-mid);
	}
</style>
