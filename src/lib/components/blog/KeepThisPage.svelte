<!-- src/lib/components/blog/KeepThisPage.svelte -->
<!--
  "Email me this page": a one-field card for reference articles people come back
  to (the compatibility matrix, subtypes, the type pages). It posts to
  /api/signups with the page path, so the welcome email leads with the link they
  asked for, and the reader joins the update list. The copy says both.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/atoms';
	import { prepareEmailSignup } from '$lib/analytics/marketingEvents';
	import { markKeepPageDone } from '$lib/utils/keepThisPage';

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	let { path }: { path: string } = $props();

	let email = $state('');
	let formExtra = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'already'>('idle');
	let error = $state('');
	let formLoadTime = Date.now();

	onMount(() => {
		formLoadTime = Date.now();
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;

		const address = email.trim().toLowerCase();
		if (!/^\S+@\S+\.\S+$/.test(address)) {
			error = 'Enter an email address like you@example.com.';
			return;
		}
		error = '';
		status = 'sending';

		const body = new FormData();
		body.append('email', address);
		body.append('form_extra', formExtra);
		body.append('_timeToken', String(Date.now() - formLoadTime));
		body.append('saved_path', path);

		try {
			await prepareEmailSignup(body, { surface: 'keep_this_page', sourcePath: path });
			const response = await fetch('/api/signups', { method: 'POST', body });
			const result = (await response.json()) as SignupResponse;
			if (result.ok) {
				status = 'sent';
				markKeepPageDone();
			} else if (result.code === 'already_exists') {
				status = 'already';
				markKeepPageDone();
			} else {
				status = 'idle';
				error = result.message || 'We couldn’t send that. Please try again.';
			}
		} catch {
			status = 'idle';
			error = 'We couldn’t send that. Check your connection and try again.';
		}
	}
</script>

<aside class="keep-page" aria-labelledby="keep-page-title" data-beta-skip>
	<p class="title" id="keep-page-title">Coming back to this page?</p>
	{#if status === 'sent'}
		<p class="body" role="status">Sent. The link is in your inbox.</p>
	{:else if status === 'already'}
		<p class="body" role="status">
			That address is already on the 9takes list, so we didn’t send another email. Bookmark this
			page instead.
		</p>
	{:else}
		<p class="body">We’ll email you the link so you can stop searching for it.</p>
		<form onsubmit={submit} novalidate aria-busy={status === 'sending'}>
			<div class="honeypot" aria-hidden="true">
				<label for="keep-page-extra">Leave blank</label>
				<input
					id="keep-page-extra"
					name="form_extra"
					type="text"
					bind:value={formExtra}
					tabindex="-1"
					autocomplete="new-password"
				/>
			</div>
			<label class="sr-only" for="keep-page-email">Email address</label>
			<input
				id="keep-page-email"
				class="email"
				type="email"
				name="email"
				bind:value={email}
				autocomplete="email"
				placeholder="you@example.com"
				aria-invalid={!!error}
				aria-describedby={error ? 'keep-page-error keep-page-note' : 'keep-page-note'}
				disabled={status === 'sending'}
			/>
			<Button type="submit" variant="primary" loading={status === 'sending'}>Email it to me</Button>
		</form>
		{#if error}
			<p class="error" id="keep-page-error" role="alert">{error}</p>
		{/if}
		<p class="note" id="keep-page-note">
			You’ll also get an occasional email from 9takes. One click stops it.
		</p>
	{/if}
</aside>

<style>
	.keep-page {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 2rem 0;
		padding: 1rem 1.1rem;
		border: 1px solid var(--rule);
		border-left: 3px solid var(--highlight);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text);
	}

	.title {
		margin: 0;
		font-size: var(--font-size-base);
		font-weight: 700;
		line-height: 1.3;
	}

	.body,
	.note,
	.error {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.body {
		color: var(--text-muted);
	}

	.note {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
	}

	.error {
		color: var(--error-text);
	}

	form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.15rem 0;
	}

	.email {
		flex: 1 1 13rem;
		min-width: 0;
		min-height: 44px;
		padding: 0.55rem 0.8rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text);
		font: inherit;
		font-size: var(--font-size-base);
	}

	.email:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 2px;
	}

	.honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
