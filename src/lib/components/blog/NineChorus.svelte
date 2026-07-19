<!-- src/lib/components/blog/NineChorus.svelte -->
<script lang="ts">
	// NineChorus — "one question, nine ways to answer it."
	// The give-first threshold: you answer before you see how nine minds answer.
	// The question is a real row in the `questions` table; this section is an entry
	// point to its /questions/[slug] page. Sharing and "see everyone's answers"
	// route back there. See docs/product/the-chorus-vision.md.
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
	import QRCode from 'qrcode';
	import { TYPE_COLOR_MAP, formatTypeLabel } from '$lib/constants/enneagramColors';

	type Take = { type: number; archetype: string; take: string; source: 'ai' | 'human' };
	type Mirror = { reflection: string; resonantType: number; resonantArchetype: string };

	let {
		subjectType = 'personality-analysis',
		slug,
		question,
		questionUrl,
		personName = ''
	}: {
		subjectType?: string;
		slug: string;
		question: string | null | undefined;
		questionUrl?: string | null;
		personName?: string;
	} = $props();

	let phase = $state<'threshold' | 'revealed'>('threshold');
	let draft = $state('');
	let submitting = $state(false);
	let submitError = $state<string | null>(null);
	let mirror = $state<Mirror | null>(null);
	let takes = $state<Take[]>([]);
	let shareState = $state<'idle' | 'copied'>('idle');
	let qrDataUrl = $state('');

	let root = $state<HTMLElement | undefined>();

	const wordCount = $derived(draft.trim() ? draft.trim().split(/\s+/).length : 0);
	const canSubmit = $derived(wordCount >= 3 && !submitting);
	const questionPath = $derived(questionUrl ? `/questions/${questionUrl}` : '');
	const shareUrl = $derived(questionUrl ? `https://9takes.com/questions/${questionUrl}` : '');

	async function submit() {
		if (!canSubmit) return;
		submitting = true;
		submitError = null;
		try {
			const res = await fetch('/api/nine/mirror', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ subjectType, slug, take: draft.trim() })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error ?? 'failed');
			mirror =
				typeof data?.reflection === 'string' &&
				Number.isInteger(data?.resonantType) &&
				typeof data?.resonantArchetype === 'string'
					? {
							reflection: data.reflection,
							resonantType: data.resonantType,
							resonantArchetype: data.resonantArchetype
						}
					: null;
			takes = data.takes ?? [];
			phase = 'revealed';
			if (browser && shareUrl) {
				QRCode.toDataURL(shareUrl, { width: 180, margin: 1 })
					.then((url) => (qrDataUrl = url))
					.catch(() => {});
			}
			await tick();
			root?.querySelector('.chorus-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} catch (e) {
			submitError =
				e instanceof Error && e.message !== 'failed'
					? e.message
					: 'Something slipped. Try once more.';
		} finally {
			submitting = false;
		}
	}

	async function share() {
		if (!shareUrl) return;
		const shareData = {
			title: '9takes',
			text: question ? `${question}\n\nWhat would you say?` : 'What would you say?',
			url: shareUrl
		};
		try {
			if (browser && navigator.share) {
				await navigator.share(shareData);
				return;
			}
			if (browser && navigator.clipboard) {
				await navigator.clipboard.writeText(shareUrl);
				shareState = 'copied';
				setTimeout(() => (shareState = 'idle'), 2000);
			}
		} catch {
			/* user dismissed the share sheet; nothing to do */
		}
	}

	function typeColor(type: number) {
		return TYPE_COLOR_MAP[type] ?? 'var(--lamp-glow, #f59e0b)';
	}
</script>

{#if question}
	<section class="chorus" bind:this={root} aria-label="One question, nine ways to answer it">
		<header class="chorus-head">
			<span class="kicker">ONE QUESTION · NINE WAYS TO ANSWER IT</span>
		</header>

		{#if phase === 'threshold'}
			<div class="threshold">
				<p class="question">{question}</p>

				<label class="give" for="chorus-take">
					<span class="give-label">Your answer first</span>
					<textarea
						id="chorus-take"
						bind:value={draft}
						oninput={() => (submitError = null)}
						maxlength="2000"
						rows="4"
						placeholder="Answer honestly. No one sees this, and no one else's answers, until you write yours."
						aria-invalid={submitError ? 'true' : 'false'}
						aria-describedby={`chorus-take-count${submitError ? ' chorus-take-error' : ''}`}
					></textarea>
				</label>

				<div class="give-foot">
					<span id="chorus-take-count" class="count" class:ready={wordCount >= 3}>
						{wordCount === 0
							? 'A sentence is enough.'
							: `${wordCount} word${wordCount === 1 ? '' : 's'}`}
					</span>
					<button class="reveal-btn" onclick={submit} disabled={!canSubmit}>
						{submitting ? 'Listening…' : 'Answer and see the nine'}
					</button>
				</div>
				{#if submitError}
					<p id="chorus-take-error" class="submit-error" role="alert">{submitError}</p>
				{/if}
				<p class="promise">You answer before you see. That is the whole point.</p>
			</div>
		{:else}
			<div class="chorus-reveal">
				<!-- 1. The question -->
				<div class="block">
					<span class="block-kicker">THE QUESTION</span>
					<p class="recap-question">{question}</p>
				</div>

				<!-- 2. Your answer + the mirror -->
				<div class="your-answer block" style={`--accent:${typeColor(mirror?.resonantType ?? 9)}`}>
					<span class="block-kicker">YOUR ANSWER</span>
					<p class="your-text">{draft.trim()}</p>
					{#if mirror}
						<p class="mirror-text">{mirror.reflection}</p>
						<span class="closest">Closest to {formatTypeLabel(mirror.resonantType)}</span>
					{/if}
				</div>

				<!-- 3. The nine -->
				<div class="block">
					<span class="block-kicker">HOW THE NINE TYPES ANSWER</span>
					<p class="sub">Same question. None of them wrong.</p>
					<ol class="voices">
						{#each takes as t, i (t.type)}
							<li class="voice" style={`--accent:${typeColor(t.type)}; --delay:${i * 50}ms`}>
								<span class="voice-name">{formatTypeLabel(t.type)}</span>
								<p class="voice-take">{t.take}</p>
							</li>
						{/each}
					</ol>
				</div>

				<!-- 4. Share back to the real question page -->
				{#if questionUrl}
					<div class="share-block block">
						<span class="block-kicker">SEE WHAT REAL PEOPLE SAY</span>
						<p class="sub">
							This is a real 9takes question. Share it, then see how your friends and everyone else
							answered.
						</p>
						<div class="share-row">
							{#if qrDataUrl}
								<img class="qr" src={qrDataUrl} alt="QR code linking to this question" />
							{/if}
							<div class="share-actions">
								<button class="share-btn" onclick={share}>
									{shareState === 'copied'
										? 'Link copied'
										: 'Share with your friends to see what they would say'}
								</button>
								<a class="door-link" href={questionPath}
									>See everyone’s answers on the question page →</a
								>
							</div>
						</div>
					</div>
				{/if}

				<div class="doorway">
					<a class="door-link subtle" href="/enneagram-test">Find which voice is yours →</a>
				</div>
			</div>
		{/if}
	</section>
{/if}

<style lang="scss">
	.chorus {
		margin: 3.5rem auto;
		max-width: 44rem;
		padding: 2rem 1.75rem 2.25rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow, #f59e0b) 30%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--lamp-glow, #f59e0b) 5%, var(--night-900, #0f0f10));
	}

	.chorus-head .kicker {
		font-size: 0.7rem;
		letter-spacing: 0.18em;
		font-weight: 700;
		color: var(--lamp-glow, #f59e0b);
	}

	.question {
		font-size: clamp(1.3rem, 2.6vw, 1.7rem);
		line-height: 1.35;
		color: var(--ink-50, #fafafa);
		margin: 0.5rem 0 1.5rem;
		font-weight: 600;
	}

	.give {
		display: block;
	}
	.give-label {
		display: block;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--lamp-glow, #f59e0b);
		margin-bottom: 0.5rem;
	}
	textarea {
		width: 100%;
		resize: vertical;
		padding: 0.9rem 1rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--stone-400, #9ca3af) 40%, transparent);
		background: var(--night-950, #0a0a0b);
		color: var(--ink-50, #fafafa);
		font: inherit;
		line-height: 1.5;
	}
	textarea:focus {
		outline: none;
		border-color: var(--lamp-glow, #f59e0b);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--lamp-glow, #f59e0b) 25%, transparent);
	}

	.give-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 0.75rem;
		flex-wrap: wrap;
	}
	.count {
		font-size: 0.85rem;
		color: var(--stone-400, #9ca3af);
	}
	.count.ready {
		color: var(--lamp-glow, #f59e0b);
	}

	.reveal-btn,
	.share-btn {
		appearance: none;
		border: none;
		cursor: pointer;
		padding: 0.7rem 1.25rem;
		border-radius: 0.625rem;
		font-weight: 700;
		font-size: 0.95rem;
		background: var(--lamp-glow, #f59e0b);
		color: #1a1205; // dark text on amber, per brand
		transition:
			transform 0.1s ease,
			filter 0.15s ease;
	}
	.reveal-btn:hover:not(:disabled),
	.share-btn:hover {
		filter: brightness(1.05);
	}
	.reveal-btn:active:not(:disabled),
	.share-btn:active {
		transform: translateY(1px);
	}
	.reveal-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.submit-error {
		color: var(--error-text);
		font-size: 0.9rem;
		margin: 0.6rem 0 0;
	}
	.promise {
		margin: 1rem 0 0;
		font-size: 0.82rem;
		color: var(--stone-500, #6b7280);
	}

	/* ---- reveal ---- */
	.block {
		margin-bottom: 2rem;
	}
	.block-kicker {
		display: block;
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		font-weight: 700;
		color: var(--lamp-glow, #f59e0b);
		margin-bottom: 0.5rem;
	}
	.recap-question {
		font-size: 1.2rem;
		line-height: 1.4;
		font-weight: 600;
		color: var(--ink-50, #fafafa);
		margin: 0;
	}

	.your-answer {
		border-left: 3px solid var(--accent);
		padding-left: 1.1rem;
	}
	.your-answer .block-kicker {
		color: var(--ink-bright);
	}
	.your-text {
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--ink-50, #fafafa);
		margin: 0 0 0.75rem;
	}
	.mirror-text {
		line-height: 1.55;
		color: var(--ink-100, #ededed);
		margin: 0 0 0.5rem;
	}
	.closest {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--ink-bright);
	}

	.sub {
		font-size: 0.9rem;
		color: var(--stone-400, #9ca3af);
		margin: 0 0 1rem;
	}

	.voices {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.75rem;
	}
	.voice {
		border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
		border-left: 3px solid var(--accent);
		border-radius: 0.625rem;
		padding: 0.85rem 1rem;
		background: color-mix(in srgb, var(--accent) 7%, var(--night-950, #0a0a0b));
		animation: rise 0.45s ease both;
		animation-delay: var(--delay, 0ms);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	.voice-name {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--ink-bright);
	}
	.voice-take {
		margin: 0.35rem 0 0;
		line-height: 1.5;
		color: var(--ink-100, #ededed);
	}

	/* ---- share ---- */
	.share-block {
		border-top: 1px solid color-mix(in srgb, var(--stone-400, #9ca3af) 20%, transparent);
		padding-top: 1.5rem;
	}
	.share-row {
		display: flex;
		gap: 1.25rem;
		align-items: center;
		flex-wrap: wrap;
	}
	.qr {
		width: 120px;
		height: 120px;
		border-radius: 0.625rem;
		background: #fff;
		padding: 6px;
		flex: none;
	}
	.share-actions {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		flex: 1 1 16rem;
		align-items: flex-start;
	}

	.doorway {
		margin-top: 0.5rem;
		text-align: center;
	}
	.door-link {
		font-weight: 700;
		color: var(--lamp-glow, #f59e0b);
		text-decoration: none;
	}
	.door-link:hover {
		text-decoration: underline;
	}
	.door-link.subtle {
		font-weight: 500;
		color: var(--stone-400, #9ca3af);
		font-size: 0.9rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.voice {
			animation: none;
		}
	}
</style>
