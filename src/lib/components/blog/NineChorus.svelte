<!-- src/lib/components/blog/NineChorus.svelte -->
<script lang="ts">
	// NineChorus — "one question, nine perspectives."
	// The give-first threshold: you answer before you see how nine minds answer.
	// The question is a real row in the `questions` table; this section is an entry
	// point to its /questions/[slug] page. Sharing and "see everyone's answers"
	// route back there. See docs/product/the-chorus-vision.md.
	//
	// Two subjects, matching /api/nine/mirror:
	//   personality-analysis  the page's own chorus, keyed by the person `slug`
	//   question              any chorus-ready question, keyed by `questionUrl`
	//                         (the proven fallback on personality pages)
	// The host page's HTML is shared (ISR), so everything visitor-specific
	// happens here in the browser: the visitor id, the gate impression, the answer.
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { resolve } from '$app/paths';
	import { bundledChorusPrompt } from '$lib/data/chorusStarter';
	import { qualifiedVisibility } from '$lib/analytics/qualifiedVisibility';
	import { captureChorusInteraction } from '$lib/analytics/marketingEvents';
	import {
		captureCommentCreated,
		normalizeServerCommentAnalytics
	} from '$lib/analytics/commentEvents';
	import { browser } from '$app/environment';
	import QRCode from 'qrcode';
	import { formatTypeLabel } from '$lib/constants/enneagramColors';
	import Button from '$lib/components/atoms/Button.svelte';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';

	type Take = { type: number; archetype: string; take: string; source: 'ai' | 'human' };
	type Mirror = { reflection: string; resonantType: number; resonantArchetype: string };

	let {
		subjectType = 'personality-analysis',
		slug,
		question,
		questionUrl,
		personName = '',
		sourcePath = null,
		lead = null
	}: {
		subjectType?: 'personality-analysis' | 'question';
		slug: string;
		question: string | null | undefined;
		questionUrl?: string | null;
		personName?: string;
		/** Same-site path of the host page: funnel attribution for the gate and the answer. */
		sourcePath?: string | null;
		/** One line above the question that ties it to the reader. */
		lead?: string | null;
	} = $props();

	let phase = $state<'threshold' | 'revealed'>('threshold');
	let draft = $state('');
	let submitting = $state(false);
	let submitError = $state<string | null>(null);
	let mirror = $state<Mirror | null>(null);
	let takes = $state<Take[]>([]);
	let shareState = $state<'idle' | 'copied'>('idle');
	let qrDataUrl = $state('');
	let alreadyAnswered = $state(false);
	let started = false;
	// Bundled starter questions carry their own short-answer copy.
	let starterPrompt = $derived(bundledChorusPrompt(questionUrl));
	function track(
		step: 'shown' | 'started' | 'submitted' | 'failed' | 'revealed',
		errorCategory?: 'http_error' | 'network_error' | 'invalid_response'
	) {
		if (questionUrl)
			void captureChorusInteraction({ step, questionUrl, sourcePath, errorCategory });
	}
	function startAnswer() {
		submitError = null;
		if (started || !draft.trim()) return;
		started = true;
		track('started');
	}

	let root = $state<HTMLElement | undefined>();

	// Mint flip (same as the question page's Interact): an empty box carries the mint
	// outline as the invitation; once there's text, the Post button takes the mint.
	const answerReady = $derived(draft.trim().length > 0);
	const wordCount = $derived(draft.trim() ? draft.trim().split(/\s+/).length : 0);
	const canSubmit = $derived(wordCount >= 3 && draft.trim().length >= 8 && !submitting);
	const shareUrl = $derived(questionUrl ? `https://9takes.com/questions/${questionUrl}` : '');

	async function submit() {
		if (!canSubmit) return;
		// Whoever answers saw the gate, even if they beat the dwell timer.
		reportGateImpression();
		submitting = true;
		submitError = null;
		track('submitted');
		let errorCategory: 'http_error' | 'network_error' | 'invalid_response' = 'network_error';
		try {
			const res = await fetch('/api/nine/mirror', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(buildMirrorRequest(draft.trim()))
			});
			const data = await res.json().catch(() => null);
			if (!res.ok) {
				errorCategory = 'http_error';
				throw new Error(data?.error ?? data?.message ?? 'failed');
			}
			errorCategory = 'invalid_response';
			if (data?.answerRecorded !== true || !Array.isArray(data.takes) || data.takes.length !== 9) {
				throw new Error(
					'We couldn’t confirm your answer. Your draft is still here; please try again.'
				);
			}
			alreadyAnswered = data.alreadyAnswered === true;
			if (!alreadyAnswered && Number.isSafeInteger(data.questionId)) {
				void captureCommentCreated({
					surface: 'personality_chorus',
					sourcePath: sourcePath ?? undefined,
					questionId: data.questionId,
					questionUrl: questionUrl ?? undefined,
					commentKind: 'answer',
					parentType: 'question',
					commentId: data.commentId,
					isAnonymous: data.isAnonymous === true,
					...normalizeServerCommentAnalytics(data.commentAnalytics)
				});
			}
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
			track('revealed');
			if (browser && shareUrl) {
				QRCode.toDataURL(shareUrl, { width: 180, margin: 1 })
					.then((url) => (qrDataUrl = url))
					.catch(() => {});
			}
			await tick();
			root?.querySelector('.chorus-reveal')?.scrollIntoView({
				behavior: prefersReducedMotion.current ? 'auto' : 'smooth',
				block: 'start'
			});
		} catch (e) {
			track('failed', errorCategory);
			submitError =
				e instanceof Error && e.message !== 'failed'
					? e.message
					: 'Something slipped. Try once more.';
		} finally {
			submitting = false;
		}
	}

	function buildMirrorRequest(take: string) {
		// The cookie stays the server's source of truth; the body copy keeps the
		// answer postable in browsers that drop client-written cookies.
		const identity = {
			take,
			sourcePath: sourcePath ?? undefined,
			fingerprint: browser ? getOrCreateVisitorId() : undefined
		};
		return subjectType === 'question'
			? { subjectType, questionUrl, ...identity }
			: { subjectType, slug, ...identity };
	}

	let gateReported = false;
	function reportGateImpression() {
		if (gateReported || !browser || !questionUrl || !sourcePath) return;
		gateReported = true;
		track('shown');
		void fetch('/api/nine/impression', {
			method: 'POST',
			keepalive: true,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ questionUrl, sourcePath, fingerprint: getOrCreateVisitorId() })
		}).catch(() => {
			/* instrumentation is best-effort */
		});
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
</script>

{#if question}
	<section
		class="chorus ph-no-capture"
		bind:this={root}
		{@attach qualifiedVisibility(reportGateImpression)}
		aria-label="One question, nine perspectives"
	>
		<header class="chorus-head">
			<span class="kicker">ONE QUESTION · NINE PERSPECTIVES</span>
		</header>

		{#if phase === 'threshold'}
			<div class="threshold">
				{#if lead}
					<p class="lead">{lead}</p>
				{/if}
				<p class="question">{question}</p>

				<label class="give" for="chorus-take">
					<span class="give-label">Your answer first</span>
					<textarea
						id="chorus-take"
						class={{ invite: !answerReady }}
						bind:value={draft}
						oninput={startAnswer}
						maxlength="2000"
						rows={starterPrompt ? 2 : 4}
						disabled={submitting}
						placeholder={starterPrompt?.placeholder ?? 'A few words in your own voice…'}
						aria-invalid={submitError ? 'true' : 'false'}
						aria-describedby={`chorus-take-count${submitError ? ' chorus-take-error' : ''}`}
					></textarea>
				</label>

				<div class="give-foot">
					<span id="chorus-take-count" class={['count', { ready: wordCount >= 3 }]}>
						{wordCount === 0
							? (starterPrompt?.hint ?? 'A sentence is enough.')
							: `${wordCount} word${wordCount === 1 ? '' : 's'}`}
					</span>
					<Button
						variant={answerReady ? 'action' : 'secondary'}
						size="lg"
						onclick={submit}
						disabled={!canSubmit}
					>
						{submitting ? 'Posting…' : 'Post answer and compare'}
					</Button>
				</div>
				{#if submitError}
					<p id="chorus-take-error" class="submit-error" role="alert">{submitError}</p>
				{/if}
				<p class="promise">
					Compare your answer with nine AI-written examples of different perspectives.
				</p>
				<p class="trust">No account needed. Your answer is posted publicly to the question page.</p>
			</div>
		{:else}
			<div class="chorus-reveal">
				<!-- 1. The question -->
				<div class="block">
					<span class="block-kicker">THE QUESTION</span>
					<p class="recap-question">{question}</p>
				</div>

				<!-- 2. Your answer + the mirror -->
				<div class="your-answer block">
					<span class="block-kicker"
						>{alreadyAnswered ? 'YOU ALREADY ANSWERED THIS QUESTION' : 'YOUR ANSWER · POSTED'}</span
					>
					{#if !alreadyAnswered}<p class="your-text">{draft.trim()}</p>{/if}
					{#if mirror && !alreadyAnswered}
						<p class="mirror-text">{mirror.reflection}</p>
						<span class="closest">Closest to {formatTypeLabel(mirror.resonantType)}</span>
					{/if}
				</div>

				<!-- 3. The nine -->
				<div class="block">
					<span class="block-kicker">HOW THE NINE TYPES ANSWER</span>
					<p class="sub">
						AI-written examples illustrate different priorities. They don’t determine your type.
					</p>
					<ol class="voices">
						{#each takes as t, i (t.type)}
							<li class="voice" style={`--delay:${i * 50}ms`}>
								<span class="voice-name">{formatTypeLabel(t.type)}</span>
								<p class="voice-take">{t.take}</p>
								<span class="voice-name"
									>{t.source === 'human' ? 'Community answer' : 'AI-written example'}</span
								>
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
								<Button variant="primary" size="lg" class="share-btn" onclick={share}>
									{shareState === 'copied'
										? 'Link copied'
										: 'Share with your friends to see what they would say'}
								</Button>
								<a class="door-link" href={resolve('/questions/[slug]', { slug: questionUrl })}
									>See everyone’s answers on the question page →</a
								>
							</div>
						</div>
					</div>
				{/if}

				<div class="doorway">
					<a class="door-link subtle" href={resolve('/enneagram-test')}
						>Find which voice is yours →</a
					>
				</div>
			</div>
		{/if}
	</section>
{/if}

<style lang="scss">
	/* Cold Light: the card sits in the dark; the empty answer box carries the mint
	   invitation, and the Post button takes the mint once there is text. */
	.chorus {
		margin: 3.5rem auto;
		max-width: 44rem;
		padding: 2rem 1.75rem 2.25rem;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: color-mix(in srgb, var(--accent) 6%, var(--surface));
		color: var(--text);
		font-family: var(--font-talk);
	}

	.chorus-head .kicker,
	.give-label,
	.block-kicker {
		display: block;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-faint);
	}

	.lead {
		margin: 0.75rem 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text-muted);
	}

	.question {
		font-size: clamp(1.3rem, 2.6vw, 1.7rem);
		line-height: 1.35;
		color: var(--text);
		margin: 0.5rem 0 1.5rem;
		font-weight: 600;
	}

	.give {
		display: block;
	}
	.give-label {
		margin-bottom: 0.5rem;
	}
	textarea {
		width: 100%;
		resize: vertical;
		padding: 0.9rem 1rem;
		border-radius: 10px;
		border: 1px solid var(--rule);
		background: var(--bg);
		color: var(--text);
		caret-color: var(--highlight);
		font: inherit;
		line-height: 1.5;
	}
	textarea::placeholder {
		color: var(--text-faint);
		opacity: 1;
	}
	textarea:focus {
		outline: none;
		border-color: var(--highlight);
		box-shadow: 0 0 0 1px var(--highlight);
	}
	textarea.invite {
		border-color: var(--action);
	}
	textarea.invite:focus {
		border-color: var(--action);
		box-shadow: 0 0 0 1px var(--action);
	}
	textarea[aria-invalid='true'] {
		border-color: var(--error-text);
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
		font-size: var(--font-size-sm);
		color: var(--text-faint);
	}
	.count.ready {
		color: var(--text-muted);
	}

	/* The atom keeps labels on one line; the share label is a full sentence. */
	.share-actions :global(.share-btn) {
		white-space: normal;
		text-align: center;
	}

	.submit-error {
		color: var(--error-text);
		font-size: var(--font-size-sm);
		margin: 0.6rem 0 0;
	}
	.promise,
	.trust {
		margin: 1rem 0 0;
		font-size: 0.82rem;
		color: var(--text-muted);
	}
	.trust {
		margin-top: 0.25rem;
		color: var(--text-faint);
	}

	/* ---- reveal ---- */
	.block {
		margin-bottom: 2rem;
	}
	.block-kicker {
		margin-bottom: 0.5rem;
	}
	.recap-question {
		font-size: var(--font-size-xl);
		line-height: 1.4;
		font-weight: 600;
		color: var(--text);
		margin: 0;
	}

	.your-answer {
		border-left: 3px solid var(--action);
		padding-left: 1.1rem;
	}
	.your-text {
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--text);
		margin: 0 0 0.75rem;
	}
	.mirror-text {
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-lg);
		line-height: 1.55;
		color: var(--highlight);
		margin: 0 0 0.5rem;
	}
	.closest {
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.sub {
		font-size: 0.9rem;
		color: var(--text-muted);
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
		border: 1px solid var(--rule);
		border-left: 3px solid color-mix(in srgb, var(--accent) 70%, transparent);
		border-radius: 10px;
		padding: 0.85rem 1rem;
		background: var(--surface-raised);
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
		font-size: var(--font-size-xs);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--text-faint);
	}
	.voice-name:first-child {
		color: var(--highlight);
	}
	.voice-take {
		margin: 0.35rem 0 0;
		line-height: 1.5;
		color: var(--text);
	}

	/* ---- share ---- */
	.share-block {
		border-top: 1px solid var(--rule);
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
		border-radius: 10px;
		/* QR codes need a light quiet zone to scan. */
		background: white;
		padding: 6px;
		flex: none;
	}
	.share-actions {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		flex: 1 1 16rem;
		align-items: flex-start;
		min-width: 0;
	}

	.doorway {
		margin-top: 0.5rem;
		text-align: center;
	}
	.door-link {
		font-weight: 600;
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}
	.door-link:hover {
		color: var(--text);
	}
	.door-link:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 2px;
		border-radius: 4px;
	}
	.door-link.subtle {
		font-weight: 500;
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.voice {
			animation: none;
		}
	}
</style>
