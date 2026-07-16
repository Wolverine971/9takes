<!-- src/lib/components/blog/StrategicQuestion.svelte -->
<!--
  The strategic question: one give-first question embedded at the earned moment
  of a markdown blog (T-12). Deliberately minimal, set in article typography:
  the question, a textarea, one button, one quiet line stating the deal. No card
  chrome, no badges, no share block before the answer. After the answer: the
  reader's take, the mirror, the nine takes, one UTM-stamped link to the real
  question page, and a quiet dismissible email ask.

  The backing question is a real `questions` row; the submitted take becomes a
  real comment there (via /api/nine/mirror), unlocking that page's give-first
  gate. Nothing gated ever renders server-side: the reveal exists only after
  the reader contributes in the browser.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
	import { capture } from '$lib/analytics/posthog';
	import { TYPE_COLOR_MAP, formatTypeLabel } from '$lib/constants/enneagramColors';

	type Take = { type: number; archetype: string; take: string; source: 'ai' | 'human' };
	type Mirror = { reflection: string; resonantType: number; resonantArchetype: string };

	let {
		question,
		questionUrl,
		blogSlug,
		campaign = 'wave1-masking'
	}: {
		/** Display text. Passed explicitly: the stored row may have lost punctuation. */
		question: string;
		/** Slug of the backing `questions` row (questions.url). */
		questionUrl: string;
		/** Host blog slug, for UTM content and analytics. */
		blogSlug: string;
		/** UTM campaign for every outbound link this widget renders. */
		campaign?: string;
	} = $props();

	let phase = $state<'ask' | 'revealed'>('ask');
	let draft = $state('');
	let submitting = $state(false);
	let submitError = $state<string | null>(null);
	let mirror = $state<Mirror | null>(null);
	let takes = $state<Take[]>([]);
	let root = $state<HTMLElement | undefined>();
	let revealEl = $state<HTMLElement | undefined>();
	let seen = $state(false);

	// Email ask (post-reveal, dismissible).
	let emailState = $state<'idle' | 'done' | 'dismissed'>('idle');
	let email = $state('');
	let emailError = $state('');
	let emailSubmitting = $state(false);
	let honeypot = $state('');
	const loadedAt = Date.now();

	const wordCount = $derived(draft.trim() ? draft.trim().split(/\s+/).length : 0);

	const questionHref = $derived.by(() => {
		const params = new URLSearchParams({
			utm_source: 'blog',
			utm_medium: 'strategic_question',
			utm_campaign: campaign,
			utm_content: blogSlug
		});
		return `/questions/${questionUrl}?${params.toString()}`;
	});

	// Depth-band impression: fires once when the widget scrolls into view.
	$effect(() => {
		if (!browser || seen || !root) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					seen = true;
					observer.disconnect();
					void capture('strategic_question_seen', {
						blog_slug: blogSlug,
						question_url: questionUrl,
						campaign
					});
				}
			},
			{ threshold: 0.4 }
		);
		observer.observe(root);
		return () => observer.disconnect();
	});

	async function submit() {
		if (submitting) return;
		if (wordCount < 3) {
			submitError = 'Say a little more. Three words is enough.';
			return;
		}
		submitting = true;
		submitError = null;
		try {
			const res = await fetch('/api/nine/mirror', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					subjectType: 'question',
					questionUrl,
					take: draft.trim(),
					sourcePath: browser ? window.location.pathname : undefined
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error ?? data?.message ?? 'failed');
			mirror = {
				reflection: data.reflection,
				resonantType: data.resonantType,
				resonantArchetype: data.resonantArchetype
			};
			takes = data.takes ?? [];
			phase = 'revealed';
			void capture('strategic_question_answered', {
				blog_slug: blogSlug,
				question_url: questionUrl,
				campaign
			});
			await tick();
			revealEl?.focus();
		} catch (e) {
			submitError =
				e instanceof Error && e.message !== 'failed'
					? e.message
					: 'Something slipped. Try once more.';
		} finally {
			submitting = false;
		}
	}

	async function submitEmail() {
		if (emailSubmitting) return;
		const normalized = email.trim().toLowerCase();
		if (!/\S+@\S+\.\S+/.test(normalized)) {
			emailError = 'Enter a valid email address';
			return;
		}
		emailError = '';
		emailSubmitting = true;

		const body = new FormData();
		body.append('email', normalized);
		body.append('form_extra', honeypot);
		body.append('_timeToken', String(Date.now() - loadedAt));
		// Source tag rides along for measurability; the endpoint safely ignores
		// fields it does not read yet, so this stays within its payload shape.
		body.append('source', 'strategic_question');

		try {
			const res = await fetch('/api/signups', { method: 'POST', body });
			const result = (await res.json()) as { ok: boolean; code?: string; message?: string };
			if (result.ok || result.code === 'already_exists') {
				emailState = 'done';
				void capture('strategic_question_email_signup', {
					blog_slug: blogSlug,
					question_url: questionUrl,
					campaign
				});
			} else {
				emailError = result.message || 'We could not subscribe you. Please try again.';
			}
		} catch {
			emailError = 'We could not subscribe you. Check your connection and try again.';
		} finally {
			emailSubmitting = false;
		}
	}

	function typeColor(type: number) {
		return TYPE_COLOR_MAP[type] ?? 'var(--lamp-glow, #f59e0b)';
	}
</script>

<section class="sq" bind:this={root} aria-label="A question for you">
	{#if phase === 'ask'}
		<p class="sq-question">{question}</p>
		<p class="sq-deal">Give your take. Then see how nine different minds answered it.</p>
		<label class="sq-visually-hidden" for="sq-take">Your take</label>
		<textarea
			id="sq-take"
			bind:value={draft}
			oninput={() => (submitError = null)}
			maxlength="2000"
			rows="3"
			placeholder="Answer honestly. A sentence is enough."
			aria-invalid={submitError ? 'true' : 'false'}
			aria-describedby={submitError ? 'sq-take-error' : undefined}></textarea>
		<button class="sq-button" onclick={submit} disabled={submitting}>
			{submitting ? 'Listening…' : 'Give your take'}
		</button>
		{#if submitError}
			<p id="sq-take-error" class="sq-error" role="alert">{submitError}</p>
		{/if}
	{:else}
		<div class="sq-reveal" bind:this={revealEl} tabindex="-1">
			<div class="sq-block">
				<span class="sq-kicker">Your take</span>
				<p class="sq-your-take">{draft.trim()}</p>
				{#if mirror}
					<p class="sq-mirror">{mirror.reflection}</p>
					<span class="sq-closest">Closest to {formatTypeLabel(mirror.resonantType)}</span>
				{/if}
			</div>

			<div class="sq-block">
				<span class="sq-kicker">How nine minds answered it</span>
				<ol class="sq-takes">
					{#each takes as t (t.type)}
						<li class="sq-take" style={`--accent:${typeColor(t.type)}`}>
							<span class="sq-take-label">{formatTypeLabel(t.type)}</span>
							<p class="sq-take-text">{t.take}</p>
						</li>
					{/each}
				</ol>
			</div>

			<p class="sq-door">
				<a href={questionHref} data-track="strategic-question-page-link">
					See everyone's answers on the question page →
				</a>
			</p>

			{#if emailState !== 'dismissed'}
				<div class="sq-email" role="group" aria-label="Get notified about new answers">
					{#if emailState === 'done'}
						<p class="sq-email-done" role="status">
							You're in. We'll email you when someone answers.
						</p>
					{:else}
						<p class="sq-email-line">Get notified when someone answers you.</p>
						<form
							class="sq-email-form"
							onsubmit={(e) => {
								e.preventDefault();
								submitEmail();
							}}
							novalidate
						>
							<div class="sq-visually-hidden" aria-hidden="true">
								<label for="sq-email-extra">Leave blank</label>
								<input
									id="sq-email-extra"
									name="form_extra"
									type="text"
									bind:value={honeypot}
									tabindex="-1"
									autocomplete="new-password"
								/>
							</div>
							<label class="sq-visually-hidden" for="sq-email">Email address</label>
							<input
								id="sq-email"
								name="email"
								type="email"
								bind:value={email}
								oninput={() => (emailError = '')}
								placeholder="you@example.com"
								autocomplete="email"
								aria-invalid={emailError ? 'true' : 'false'}
								aria-describedby={emailError ? 'sq-email-error' : undefined}
							/>
							<button type="submit" class="sq-email-button" disabled={emailSubmitting}>
								{emailSubmitting ? 'Saving…' : 'Notify me'}
							</button>
							<button
								type="button"
								class="sq-email-dismiss"
								onclick={() => (emailState = 'dismissed')}
							>
								No thanks
							</button>
						</form>
						{#if emailError}
							<p id="sq-email-error" class="sq-error" role="alert">{emailError}</p>
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</section>

<style lang="scss">
	/* Set in article typography on purpose: no card chrome, no banner box.
	   Every selector is nested under .sq so the scoped rules outrank the host
	   article's `.article-body :global(p|ol|li|a)` styles (specificity 0,3,0
	   beats 0,2,1); otherwise the host loosens the lockup and indents the
	   nine-takes list. */
	.sq {
		margin: 2.75rem 0;
	}

	.sq .sq-question {
		font-size: 1.35rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--ink-bright);
		margin: 0 0 0.5rem;
	}

	.sq .sq-deal {
		font-size: 0.92rem;
		color: var(--ink-mid);
		margin: 0 0 1rem;
	}

	.sq textarea {
		width: 100%;
		resize: vertical;
		padding: 0.85rem 1rem;
		border-radius: 0.625rem;
		border: 1px solid var(--stone-edge);
		background: color-mix(in srgb, var(--stone-warm) 55%, transparent);
		color: var(--ink-bright);
		font: inherit;
		line-height: 1.5;
	}

	.sq textarea::placeholder {
		color: var(--ink-dim);
	}

	.sq textarea:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--lamp-glow) 25%, transparent);
	}

	.sq .sq-button {
		appearance: none;
		border: none;
		cursor: pointer;
		margin-top: 0.75rem;
		min-height: 2.75rem;
		padding: 0.7rem 1.35rem;
		border-radius: 0.625rem;
		font-weight: 700;
		font-size: 0.95rem;
		background: var(--lamp-glow);
		color: var(--text-on-primary); /* dark text on amber, per brand */
		transition:
			transform 0.1s ease,
			filter 0.15s ease;
	}

	.sq .sq-button:hover:not(:disabled) {
		filter: brightness(1.05);
	}

	.sq .sq-button:active:not(:disabled) {
		transform: translateY(1px);
	}

	.sq .sq-button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.sq .sq-error {
		color: var(--error-text);
		font-size: 0.9rem;
		margin: 0.6rem 0 0;
	}

	/* ---- reveal ---- */
	.sq .sq-reveal:focus {
		outline: none;
	}

	.sq .sq-block {
		margin-bottom: 1.75rem;
	}

	.sq .sq-kicker {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--lamp-glow);
		margin-bottom: 0.5rem;
	}

	.sq .sq-your-take {
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--ink-bright);
		margin: 0 0 0.75rem;
	}

	.sq .sq-mirror {
		line-height: 1.55;
		color: var(--ink-mid);
		margin: 0 0 0.5rem;
	}

	.sq .sq-closest {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.sq .sq-takes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.9rem;
	}

	.sq .sq-take {
		border-left: 2px solid var(--accent);
		padding-left: 0.9rem;
		margin: 0;
	}

	.sq .sq-take-label {
		display: block;
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.sq .sq-take-text {
		margin: 0.3rem 0 0;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.sq .sq-door {
		margin: 0 0 1.5rem;
	}

	.sq .sq-door a {
		font-weight: 700;
		color: var(--lamp-glow);
		text-decoration: none;
	}

	.sq .sq-door a:hover {
		text-decoration: underline;
	}

	/* ---- email ask: quiet, below the nine ---- */
	.sq .sq-email {
		border-top: 1px solid var(--stone-edge);
		padding-top: 1rem;
	}

	.sq .sq-email-line {
		font-size: 0.9rem;
		color: var(--ink-mid);
		margin: 0 0 0.6rem;
	}

	.sq .sq-email-form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.sq .sq-email-form input[type='email'] {
		flex: 1 1 14rem;
		min-height: 2.75rem;
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--stone-warm) 55%, transparent);
		color: var(--ink-bright);
		/* 1rem minimum so iOS Safari does not auto-zoom on focus */
		font-size: 1rem;
	}

	.sq .sq-email-form input[type='email']::placeholder {
		color: var(--ink-dim);
	}

	.sq .sq-email-form input[type='email']:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--lamp-glow) 25%, transparent);
	}

	.sq .sq-email-button {
		appearance: none;
		border: none;
		cursor: pointer;
		min-height: 2.75rem;
		padding: 0.55rem 1rem;
		border-radius: 0.625rem;
		font-weight: 700;
		font-size: 0.88rem;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
	}

	.sq .sq-email-button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.sq .sq-email-dismiss {
		appearance: none;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.85rem;
		color: var(--ink-dim);
		min-height: 2.75rem;
		padding: 0.35rem 0.5rem;
	}

	.sq .sq-email-dismiss:hover {
		color: var(--ink-mid);
		text-decoration: underline;
	}

	.sq .sq-email-done {
		font-size: 0.9rem;
		color: var(--ink-bright);
		margin: 0;
	}

	.sq .sq-visually-hidden {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
</style>
